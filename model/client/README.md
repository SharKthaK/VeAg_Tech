# VeAg Model Client - Crop Disease Detection & Treatment Advice System

A comprehensive deep learning solution for detecting and classifying crop diseases using ensemble of state-of-the-art computer vision models, integrated with AI-powered treatment recommendations.

## 🌾 Overview

**VeAg by Vacant Vectors** is a flexible crop disease detection system that uses three powerful deep learning architectures:
- **ConvNeXt-Base** (88M parameters)
- **EfficientNetV2-M** (54M parameters) 
- **DeiT-Small** (Vision Transformer)

### Example Implementation: Rice Leaf Disease Detection

This repository demonstrates the system with **rice leaf disease detection** as an example. The same architecture and approach can be adapted for other crops such as wheat, corn, tomato, potato, and more by training models on respective datasets.

The system provides:
- **Gradio web interface** for easy interaction and real-time predictions
- **Jupyter notebook** for development and experimentation
- **AI-powered treatment advice** using Google Gemini API
- **Comprehensive visualization** with charts, gauges, and confidence scores

## 🚀 Features

- **Multi-model Ensemble**: Combines predictions from three different architectures for improved accuracy
- **Interactive Web Interface**: User-friendly Gradio interface for image upload and real-time prediction
- **AI Treatment Advisor**: Get automated treatment advice using Google Gemini API
- **Batch Processing**: Support for processing multiple images simultaneously
- **Comprehensive Visualization**: 
  - Probability bar charts
  - Top-N predictions pie charts
  - Confidence gauge meters
- **Flexible Configuration**: Easy customization of disease classes and model weights
- **Comprehensive Logging**: Automatic logging of predictions, treatment advice, and model performance
- **Adaptable to Multiple Crops**: Architecture designed to work with any crop disease dataset

## 📋 Disease Classes (Rice Example)

The current implementation detects the following rice leaf diseases:
1. **Bacterial leaf blight**
2. **Brown spot** 
3. **Leaf smut**

**Note**: You can adapt this system for other crops (e.g., wheat, corn, tomato, potato) by training models on the respective datasets and updating the `classes.json` file to include additional disease classes and a "Healthy" class.

## 🛠️ Installation

### Prerequisites
- Python 3.8 or higher
- CUDA-compatible GPU (recommended for faster inference)
- Google Gemini API key (optional, for treatment advice feature)

### Setup Steps

1. **Clone or download this repository**
   ```bash
   cd VeAg_Project/model/client
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Copy trained model files**
   
   **IMPORTANT**: You need to first train the models using the code in `model/backend/`. After training, copy the generated `.pth` model files to the `models/checkpoints/` directory:
   
   ```bash
   # After training models in model/backend/, copy the .pth files:
   cp path/to/trained/models/*.pth models/checkpoints/
   ```
   
   Place your pre-trained `.pth` model files in the `models/checkpoints/` directory:
   ```
   models/
   └── checkpoints/
      ├── convnext_base_rice_*.pth
      ├── efficientnetv2_m_rice_*.pth
      └── deit_small_rice_*.pth
   ```
   
   Example files generated from training:
   ```
   convnext_base_rice_v1_augmented_20251014_154540.pth
   efficientnetv2_m_rice_v1_augmented_20251014_154703.pth
   deit_small_rice_v1_augmented_20251014_154738.pth
   ```

4. **Configure disease classes**
   
   Edit the `classes.json` file to match your specific crop and diseases:
   ```json
   [
     "Disease Class 1",
     "Disease Class 2", 
     "Disease Class 3",
     "Healthy Leaf"
   ]
   ```
   
   **Important**: The number of classes in `classes.json` must match the number of classes your trained models expect!

5. **Set up Gemini API (Optional)**
   
   For AI-powered treatment advice, create a `.env` file and add your Gemini API key:
   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```
   
   If no API key is provided, the treatment advice feature will be disabled but predictions will still work.

## 🎯 Usage

### Web Interface (Recommended)

Launch the Gradio web interface:
```bash
python app.py
```

Then open your browser and navigate to the displayed URL (typically `http://127.0.0.1:7860` or `http://0.0.0.0:7860`).

**Interface Features**:
- Upload single or multiple crop leaf images (rice in this example)
- Select from different models:
  - **Best Overall**: Automatically uses the best performing model
  - **Individual Models**: ConvNeXt-Base, EfficientNetV2-M, DeiT-Small
  - **Ensemble**: Combines all three models with customizable weights
  - **Ensemble (logits)**: Advanced ensemble using logit-level fusion
- Adjust ensemble model weights in real-time
- View prediction results with:
  - Probability bar charts
  - Top-N predictions pie charts
  - Confidence gauge meters
- Get AI-powered treatment advice for detected diseases
- Download prediction results as CSV
- View comprehensive logs

### Treatment Advice Feature

After getting predictions, click "Get Treatment Advice" to receive:
- **Causes**: What causes the detected disease
- **Treatment**: Recommended treatment methods
- **Prevention**: Preventive measures for future protection

Results are automatically saved in JSON and CSV formats in `logs/gemini/`.

### Jupyter Notebook

For development and experimentation:
```bash
jupyter notebook Demo.ipynb
```

The notebook contains:
- Model training pipelines
- Data preprocessing examples
- Evaluation metrics and visualization
- Batch inference examples

### Programmatic Usage

```python
from src.predict import predict_batch
from src.model_handler import load_ensemble_models

# Load models
models = load_ensemble_models("models/checkpoints/")

# Predict on images
results = predict_batch(
    image_paths=["path/to/image1.jpg", "path/to/image2.jpg"],
    models=models,
    ensemble_weights=[0.4, 0.3, 0.3]  # ConvNeXt, EfficientNet, DeiT
)
```

## ⚙️ Configuration

### Model Ensemble Weights

You can adjust the contribution of each model in the ensemble by modifying weights in the web interface or programmatically:

```python
# Equal weighting (default)
weights = [0.33, 0.33, 0.34]  # [ConvNeXt, EfficientNet, DeiT]

# Favor ConvNeXt model
weights = [0.5, 0.25, 0.25]

# Custom weighting based on validation performance
weights = [0.4, 0.35, 0.25]
```

### Custom Disease Classes

To adapt this system for different crops or diseases:

1. **Train new models** using the `model/backend/` code with your dataset

2. **Update `classes.json`**:
   ```json
   [
     "Your Disease 1",
     "Your Disease 2", 
     "Your Disease 3",
     "Healthy Leaf"
   ]
   ```

3. **Copy trained model files** from `model/backend/` to `models/checkpoints/`

4. **Ensure model compatibility**: Your trained models must output the same number of classes as defined in `classes.json`

## 🌍 Adapting to Other Crops

This example uses **rice leaf disease detection**, but the same system can be used for other crops:

### Steps to Adapt:
1. **Prepare your dataset** for the target crop (e.g., wheat, corn, tomato)
2. **Train models** using the `model/backend/ML_Crop_Disease_Detection_Model.ipynb` notebook
3. **Copy trained .pth files** to `models/checkpoints/`
4. **Update `classes.json`** with your crop-specific diseases
5. **Modify UI text** in `app.py` if desired (optional)
6. **Test** with sample images of your crop

### Example Crop Adaptations:
- **Wheat**: Rust, leaf blight, powdery mildew
- **Tomato**: Early blight, late blight, leaf mold, septoria leaf spot
- **Potato**: Early blight, late blight, black scurf
- **Corn**: Northern corn leaf blight, gray leaf spot, common rust

## 📁 Project Structure

```
model/client/
├── app.py                          # Main Gradio web application
├── classes.json                    # Disease class definitions (customize for your crop)
├── requirements.txt                # Python dependencies
├── Demo.ipynb                      # Jupyter notebook for development
├── README.md                       # This file
├── .env                            # Environment variables (create this for Gemini API)
├── src/
│   ├── __init__.py
│   ├── model_handler.py            # Model loading and ensemble logic
│   └── predict.py                  # Prediction and inference functions
├── models/
│   └── checkpoints/                # Place .pth files from model/backend here
│       ├── convnext_base_*.pth
│       ├── efficientnetv2_m_*.pth
│       └── deit_small_*.pth
└── logs/
    ├── predictions/                # CSV files of prediction results
    └── gemini/                     # Treatment advice (JSON & CSV format)
```

## 🔧 Model Requirements

### Supported Architectures
- **ConvNeXt-Base**: `timm.create_model('convnext_base')`
- **EfficientNetV2-M**: `timm.create_model('tf_efficientnetv2_m')`  
- **DeiT-Small**: `timm.create_model('deit_small_patch16_224')`

### Model File Format
Your `.pth` files should be saved with:
```python
torch.save({
    'model_state_dict': model.state_dict(),
    'metadata': {
        'model_name': 'ConvNeXt-Base',  # or 'EfficientNetV2-M', 'DeiT-Small'
        'num_classes': 3,
        'img_size': 224,
        'training_date': '2024-10-14',
        'accuracy': 0.95
    }
}, 'model_path.pth')
```

## 📊 Performance

The ensemble approach typically provides:
- **Higher accuracy** than individual models
- **Better generalization** across different rice varieties
- **Robust predictions** with confidence estimation
- **Reduced overfitting** through model diversity

## 🐛 Troubleshooting

### Common Issues

1. **Model loading errors**:
   - Ensure `.pth` files are in `models/checkpoints/`
   - Verify models were trained using `model/backend/` code
   - Check that model architectures match expected types
   - Verify number of classes matches `classes.json`

2. **CUDA/GPU issues**:
   - Install CUDA-compatible PyTorch version
   - System will automatically fall back to CPU if GPU unavailable

3. **Memory issues**:
   - Reduce batch size for large images
   - Use CPU inference for very large models
   - Process images one at a time instead of batches

4. **Class mismatch errors**:
   - Ensure `classes.json` has same number of classes as trained models
   - Verify class order matches training data

5. **Gemini API errors**:
   - Check your API key in `.env` file
   - Verify API key is valid and has quota
   - Treatment advice will be skipped if API key is missing (predictions still work)

6. **No models found**:
   - Train models first using `model/backend/ML_Crop_Disease_Detection_Model.ipynb`
   - Copy generated `.pth` files to `models/checkpoints/`
   - Ensure file names contain architecture identifiers (convnext, efficientnet, deit)

### Getting Help

- Check the logs in `logs/predictions/` for detailed error information
- Enable debug mode by setting `DEBUG = True` in `app.py`
- Review the Jupyter notebook `Demo.ipynb` for usage examples
- Refer to `model/backend/README.md` for model training instructions

## 🔗 Related Documentation

- **Model Training**: See `model/backend/README.md` for instructions on training models
- **Full Model Documentation**: See `model/README.md` for complete system overview
- **VeAg Platform**: See main project README for full application integration

## 📝 License

This project is provided as-is for educational and research purposes.

---

**Important Notes**:
- This is a demonstration with **rice leaf disease detection**. You can adapt it for other crops.
- Remember to **train models first** in `model/backend/` and copy the `.pth` files to `models/checkpoints/`.
- Update `classes.json` to match your specific crop and disease categories.
- The system provides automated predictions and treatment suggestions for **informational purposes only** and is not a substitute for professional agricultural advice.