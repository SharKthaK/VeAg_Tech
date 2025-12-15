import json
from pathlib import Path
from typing import List, Optional, Dict, Tuple

import torch
import torch.nn.functional as F
import numpy as np
import pandas as pd
from PIL import Image
from torchvision import transforms

from src import model_handler


def load_classes(classes_path: str = "classes.json") -> List[str]:
    p = Path(classes_path)
    if not p.exists():

        return ["Bacterial leaf blight", "Brown spot", "Leaf smut"]
    return json.loads(p.read_text())


def _val_transform(img_size: int = 224):
    return transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                             std=[0.229, 0.224, 0.225]),
    ])

def _prep_batch(image_paths: List[str], img_size: int) -> torch.Tensor:
    tfm = _val_transform(img_size)
    imgs = []
    for p in image_paths:
        img = Image.open(p).convert("RGB")
        imgs.append(tfm(img))
    return torch.stack(imgs, dim=0)

def _topk_from_probs(probs: np.ndarray, class_names: List[str], k: int = 3):
    k = min(k, len(class_names))
    idx = np.argsort(-probs)[:k]
    return list(idx), [class_names[i] for i in idx], list(probs[idx])


def _scan_checkpoints(ckpt_dir: str = "models/checkpoints") -> List[Dict]:
    items = []
    for fp in Path(ckpt_dir).glob("*.pth"):
        try:
            ck = torch.load(fp, map_location="cpu")
            meta = ck.get("metadata", {})
            model_name = ck.get("model_name") or meta.get("model_name")
            best_acc = meta.get("best_val_accuracy")  # your Trainer stored this in percent
            items.append({
                "path": str(fp),
                "model_name": model_name,
                "best_val_accuracy": float(best_acc) if best_acc is not None else 0.0
            })
        except Exception:
            continue
    return items

def _best_overall_ckpt(ckpts: List[Dict]) -> Optional[Dict]:
    if not ckpts:
        return None
    return sorted(ckpts, key=lambda x: x.get("best_val_accuracy", 0.0), reverse=True)[0]

def _best_ckpt_per_arch(ckpts: List[Dict], arches: List[str]) -> Dict[str, Optional[Dict]]:
    result = {}
    for arch in arches:
        cands = [c for c in ckpts if (c.get("model_name") == arch)]
        if cands:
            result[arch] = sorted(cands, key=lambda x: x.get("best_val_accuracy", 0.0), reverse=True)[0]
        else:
            result[arch] = None
    return result


def _infer_model(model, image_paths: List[str], device: torch.device,
                 class_names: List[str], batch_size: int = 16, img_size: int = 224) -> pd.DataFrame:
    model.eval()
    records = []
    with torch.no_grad():
        for i in range(0, len(image_paths), batch_size):
            chunk = image_paths[i:i+batch_size]
            x = _prep_batch(chunk, img_size).to(device)
            logits = model(x)
            prob = F.softmax(logits, dim=1).cpu().numpy()
            pred_idx = prob.argmax(axis=1)
            for j, p in enumerate(chunk):
                idx = int(pred_idx[j])
                rec = {
                    "filepath": p,
                    "pred_idx": idx,
                    "pred_label": class_names[idx],
                    "confidence": float(prob[j, idx])
                }
                top_idx, top_lbl, top_val = _topk_from_probs(prob[j], class_names, k=3)
                for t, (lbl, val) in enumerate(zip(top_lbl, top_val), start=1):
                    rec[f"top{t}_label"] = lbl
                    rec[f"top{t}_prob"] = float(val)
                for ci, cname in enumerate(class_names):
                    rec[f"prob_{cname}"] = float(prob[j, ci])
                records.append(rec)
    return pd.DataFrame(records)


def predict_best_overall(image_paths: List[str], device: torch.device,
                         classes_path: str = "classes.json", img_size: int = 224,
                         ckpt_dir: str = "models/checkpoints") -> Tuple[pd.DataFrame, Dict]:
    class_names = load_classes(classes_path)
    num_classes = len(class_names)
    ckpts = _scan_checkpoints(ckpt_dir)
    best = _best_overall_ckpt(ckpts)
    if not best:
        raise RuntimeError("No checkpoints found in models/checkpoints")
    model, _ = model_handler.load_model(best["path"], num_classes=num_classes, device=device)
    df = _infer_model(model, image_paths, device, class_names, img_size=img_size)
    return df, {"model_used": best["model_name"], "best_val_accuracy": best["best_val_accuracy"]}

def predict_arch(arch_name: str, image_paths: List[str], device: torch.device,
                 classes_path: str = "classes.json", img_size: int = 224,
                 ckpt_dir: str = "models/checkpoints") -> Tuple[pd.DataFrame, Dict]:
    class_names = load_classes(classes_path)
    num_classes = len(class_names)
    ckpts = _scan_checkpoints(ckpt_dir)
    per_arch = _best_ckpt_per_arch(ckpts, [arch_name])
    entry = per_arch.get(arch_name)
    if not entry:
        raise RuntimeError(f"No checkpoint found for {arch_name} in {ckpt_dir}")
    model, _ = model_handler.load_model(entry["path"], num_classes=num_classes, device=device)
    df = _infer_model(model, image_paths, device, class_names, img_size=img_size)
    return df, {"model_used": arch_name, "best_val_accuracy": entry.get("best_val_accuracy")}

def predict_ensemble(image_paths: List[str], device: torch.device,
                     weights: Optional[List[float]] = None, mode: str = "weighted",
                     classes_path: str = "classes.json", img_size: int = 224,
                     ckpt_dir: str = "models/checkpoints",
                     logits_fusion: bool = False) -> Tuple[pd.DataFrame, Dict]:
    class_names = load_classes(classes_path)
    num_classes = len(class_names)
    ckpts = _scan_checkpoints(ckpt_dir)
    arches = ["ConvNeXt-Base", "EfficientNetV2-M", "DeiT-Small"]
    sel = _best_ckpt_per_arch(ckpts, arches)
    if not all(sel[a] for a in arches):
        missing = [a for a in arches if not sel[a]]
        raise RuntimeError(f"Missing checkpoints for: {missing}")

    if not logits_fusion:

        ensemble = model_handler.load_ensemble_from_checkpoints(
            convnext_path=sel["ConvNeXt-Base"]["path"],
            efficientnet_path=sel["EfficientNetV2-M"]["path"],
            deit_path=sel["DeiT-Small"]["path"],
            num_classes=num_classes,
            device=device,
            weights=weights or [1/3, 1/3, 1/3],
            mode=mode
        )
        df = _infer_model(ensemble, image_paths, device, class_names, img_size=img_size)
        meta = {"models_used": arches, "weights": weights or [1/3, 1/3, 1/3], "mode": mode, "fusion": "probabilities"}
        return df, meta


    models = []
    for a in arches:
        m, _ = model_handler.load_model(sel[a]["path"], num_classes=num_classes, device=device)
        m.eval()
        models.append(m)
    w = weights or [1/3, 1/3, 1/3]
    s = sum(w) or 1.0
    w = [wi / s for wi in w]

    records = []
    with torch.no_grad():
        for i in range(0, len(image_paths), 16):
            chunk = image_paths[i:i+16]
            x = _prep_batch(chunk, img_size).to(device)
            logits_sum = None
            for wi, m in zip(w, models):
                logits = m(x) * wi
                logits_sum = logits if logits_sum is None else logits_sum + logits
            prob = F.softmax(logits_sum, dim=1).cpu().numpy()
            pred_idx = prob.argmax(axis=1)
            for j, p in enumerate(chunk):
                idx = int(pred_idx[j])
                rec = {
                    "filepath": p,
                    "pred_idx": idx,
                    "pred_label": class_names[idx],
                    "confidence": float(prob[j, idx])
                }
                top_idx, top_lbl, top_val = _topk_from_probs(prob[j], class_names, k=3)
                for t, (lbl, val) in enumerate(zip(top_lbl, top_val), start=1):
                    rec[f"top{t}_label"] = lbl
                    rec[f"top{t}_prob"] = float(val)
                for ci, cname in enumerate(class_names):
                    rec[f"prob_{cname}"] = float(prob[j, ci])
                records.append(rec)
    df = pd.DataFrame(records)
    meta = {"models_used": arches, "weights": w, "mode": mode, "fusion": "logits"}
    return df, meta
