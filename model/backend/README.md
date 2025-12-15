# VeAg Model Backend - Training Pipeline

This directory contains the Jupyter notebook for training deep learning models for crop disease detection. The trained models are then deployed using the client application.

## 📋 Overview

The backend provides a comprehensive training pipeline for three state-of-the-art deep learning architectures:
- **ConvNeXt-Base** (88M parameters)
- **EfficientNetV2-M** (54M parameters)
- **DeiT-Small** (Vision Transformer)

### Current Example: Rice Leaf Disease Detection

This notebook demonstrates the complete training process using **rice leaf disease dataset** as an example. The same approach can be applied to other crops by replacing the dataset.

## 🎯 Purpose

This training pipeline:
1. Prepares and augments crop disease image datasets
2. Trains individual deep learning models
3. Evaluates model performance with comprehensive metrics
4. Saves trained models as `.pth` files for deployment
5. Generates ensemble-ready models for the client application

## 📁 Files

```
model/backend/
├── ML_Crop_Disease_Detection_Model.ipynb    # Main training notebook
└── README.md                                 # This file
```

## 🛠️ Prerequisites

### System Requirements
- Python 3.8 or higher
- CUDA-compatible GPU (highly recommended for training)
- At least 8GB RAM (16GB+ recommended)
- 10GB+ free disk space for datasets and models

### Required Libraries
```bash
pip install torch torchvision
pip install timm
pip install pandas numpy matplotlib seaborn
pip install scikit-learn
pip install pillow
pip install jupyter notebook
```

Or install all dependencies from the main requirements:
```bash
pip install -r ../client/requirements.txt
```

## 📊 Dataset Preparation

### Dataset Structure

Organize your dataset in the following structure:
```
your_dataset/
├── train/
│   ├── Disease_Class_1/
│   │   ├── image1.jpg
│   │   ├── image2.jpg
│   │   └── ...
│   ├── Disease_Class_2/
│   │   └── ...
│   ├── Disease_Class_3/
│   │   └── ...
│   └── Healthy/
│       └── ...
├── validation/
│   ├── Disease_Class_1/
│   ├── Disease_Class_2/
│   ├── Disease_Class_3/
│   └── Healthy/
└── test/
    ├── Disease_Class_1/
    ├── Disease_Class_2/
    ├── Disease_Class_3/
    └── Healthy/
```

### Example: Rice Disease Dataset

For rice leaf disease detection:
```
rice_disease_dataset/
├── train/
│   ├── Bacterial_leaf_blight/
│   ├── Brown_spot/
│   ├── Leaf_smut/
│   └── Healthy_Rice_Leaf/
├── validation/
│   └── ...
└── test/
    └── ...
```

### Data Requirements
- **Image format**: JPEG, PNG
- **Recommended size**: 224x224 or larger
- **Minimum images per class**: 100+ for training, 20+ for validation
- **Balance**: Try to have similar number of images across classes

## 🚀 Training Process

### Step 1: Open the Notebook

```bash
cd model/backend
jupyter notebook ML_Crop_Disease_Detection_Model.ipynb
```

### Step 2: Configure Parameters

In the notebook, update the following parameters:

```python
# Dataset paths
DATASET_PATH = "path/to/your/dataset"
TRAIN_DIR = "path/to/your/dataset/train"
VAL_DIR = "path/to/your/dataset/validation"
TEST_DIR = "path/to/your/dataset/test"

# Training parameters
NUM_CLASSES = 4  # Number of disease classes (including healthy)
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 50
LEARNING_RATE = 0.001

# Model selection
MODELS_TO_TRAIN = ["ConvNeXt-Base", "EfficientNetV2-M", "DeiT-Small"]
```

### Step 3: Execute Cells

Run all cells in sequence:
1. **Import libraries**
2. **Load and explore dataset**
3. **Data augmentation setup**
4. **Model architecture definition**
5. **Training loop** (this takes the longest)
6. **Evaluation and metrics**
7. **Save trained models**

### Step 4: Monitor Training

The notebook provides:
- Real-time training loss and accuracy
- Validation metrics after each epoch
- Confusion matrices
- ROC curves
- Training history plots

## 💾 Model Output

### Generated Files

After training, the notebook generates `.pth` files:

```
convnext_base_<crop>_v1_augmented_<timestamp>.pth
efficientnetv2_m_<crop>_v1_augmented_<timestamp>.pth
deit_small_<crop>_v1_augmented_<timestamp>.pth
```

Example for rice:
```
convnext_base_rice_v1_augmented_20251014_154540.pth
efficientnetv2_m_rice_v1_augmented_20251014_154703.pth
deit_small_rice_v1_augmented_20251014_154738.pth
```

### Model File Contents

Each `.pth` file contains:
```python
{
    'model_state_dict': model.state_dict(),
    'metadata': {
        'model_name': 'ConvNeXt-Base',
        'num_classes': 4,
        'img_size': 224,
        'training_date': '2024-10-14',
        'accuracy': 0.95,
        'classes': ['Disease1', 'Disease2', 'Disease3', 'Healthy']
    }
}
```

## 📤 Deployment

### Copy Models to Client

After training, **copy the generated `.pth` files** to the client application:

```bash
# From model/backend directory
cp *.pth ../client/models/checkpoints/

# Or on Windows
copy *.pth ..\client\models\checkpoints\
```

### Update Client Configuration

1. Navigate to `model/client/`
2. Update `classes.json` to match your trained classes:
   ```json
   [
     "Disease Class 1",
     "Disease Class 2",
     "Disease Class 3",
     "Healthy Leaf"
   ]
   ```
3. Launch the client application: `python app.py`

## 🔧 Customization

### Training Different Crops

To train models for a different crop (e.g., wheat, tomato, corn):

1. **Prepare dataset** for your target crop
2. **Update dataset paths** in the notebook
3. **Modify NUM_CLASSES** to match your disease categories
4. **Update class names** in the notebook and later in `classes.json`
5. **Run training** and monitor results
6. **Copy .pth files** to client application
7. **Test** with sample images

### Hyperparameter Tuning

You can experiment with:
- **Learning rate**: Try values between 0.0001 and 0.01
- **Batch size**: 16, 32, 64 (depends on GPU memory)
- **Epochs**: 30-100 (monitor for overfitting)
- **Image augmentation**: Adjust rotation, flip, brightness
- **Optimizer**: Adam, SGD, AdamW
- **Scheduler**: ReduceLROnPlateau, CosineAnnealing

### Transfer Learning

The models use pre-trained ImageNet weights by default. You can:
- Fine-tune all layers (longer training)
- Freeze early layers and train only final layers (faster)
- Progressive unfreezing (start with frozen, then unfreeze)

## 📊 Performance Metrics

The notebook generates:
- **Accuracy**: Overall and per-class
- **Precision, Recall, F1-Score**: For each disease class
- **Confusion Matrix**: Visual representation of predictions
- **ROC Curves**: For binary classification tasks
- **Training History**: Loss and accuracy over epochs
- **Sample Predictions**: Visual inspection of model outputs

## 🐛 Troubleshooting

### Common Issues

1. **Out of Memory (OOM)**:
   - Reduce `BATCH_SIZE` (try 16 or 8)
   - Reduce `IMG_SIZE` to 192 or 160
   - Use mixed precision training (fp16)

2. **Poor accuracy**:
   - Increase number of epochs
   - Add more data augmentation
   - Balance your dataset
   - Try different learning rates

3. **Overfitting**:
   - Add dropout layers
   - Increase data augmentation
   - Reduce model complexity
   - Add L2 regularization

4. **Training too slow**:
   - Ensure CUDA is available and being used
   - Increase batch size (if GPU memory allows)
   - Use data parallelism for multiple GPUs

5. **Model not converging**:
   - Reduce learning rate
   - Use learning rate scheduler
   - Check data preprocessing
   - Verify labels are correct

## 📈 Best Practices

1. **Data Quality**: 
   - Use high-quality, clear images
   - Remove blurry or corrupted images
   - Ensure correct labeling

2. **Data Augmentation**:
   - Apply realistic transformations
   - Don't over-augment (can hurt performance)
   - Test augmentation strategies

3. **Validation Strategy**:
   - Use separate validation set
   - Monitor validation metrics
   - Stop training when validation loss increases

4. **Model Selection**:
   - Start with one model, then train all three
   - Compare performance metrics
   - Use ensemble for best results

5. **Documentation**:
   - Record training parameters
   - Save training logs
   - Document any modifications

## 🔗 Next Steps

After successful training:

1. ✅ Copy `.pth` files to `model/client/models/checkpoints/`
2. ✅ Update `model/client/classes.json`
3. ✅ Test models using `model/client/app.py`
4. ✅ Evaluate performance on new images
5. ✅ Iterate and improve based on results

## 📝 Additional Resources

- **PyTorch Documentation**: https://pytorch.org/docs/
- **TIMM Library**: https://github.com/huggingface/pytorch-image-models
- **Transfer Learning Guide**: https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html

---

**Note**: This is an example implementation for **rice leaf disease detection**. The same training pipeline can be used for any crop disease detection task by preparing the appropriate dataset and updating the class labels.
