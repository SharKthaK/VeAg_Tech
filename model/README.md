# VeAg Model - Crop Disease Detection System

A complete end-to-end deep learning solution for crop disease detection, from model training to deployment with AI-powered treatment recommendations.

## 🌾 Overview

**VeAg by Vacant Vectors** provides a comprehensive crop disease detection system using state-of-the-art deep learning models. The system consists of two main components:

1. **Backend** (`model/backend/`): Training pipeline for deep learning models
2. **Client** (`model/client/`): Deployment application with Gradio web interface

### Example Implementation: Rice Leaf Disease Detection

This repository demonstrates the complete workflow using **rice leaf disease detection** as an example. The same architecture and methodology can be adapted for detecting diseases in other crops such as wheat, corn, tomato, potato, and more.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    VeAg Model System                     │
└─────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│   BACKEND (Training) │         │   CLIENT (Inference)  │
│                      │         │                       │
│  ┌────────────────┐ │         │  ┌────────────────┐  │
│  │ Dataset Prep   │ │         │  │ Gradio Web UI  │  │
│  └────────┬───────┘ │         │  └────────┬───────┘  │
│           │          │         │           │          │
│  ┌────────▼───────┐ │         │  ┌────────▼───────┐  │
│  │ Model Training │ │──.pth──>│  │ Model Loading  │  │
│  │  • ConvNeXt    │ │  files  │  │  • Ensemble    │  │
│  │  • EfficientNet│ │         │  │  • Single Model│  │
│  │  • DeiT        │ │         │  └────────┬───────┘  │
│  └────────┬───────┘ │         │           │          │
│           │          │         │  ┌────────▼───────┐  │
│  ┌────────▼───────┐ │         │  │  Prediction    │  │
│  │  Evaluation    │ │         │  │  • Images      │  │
│  └────────────────┘ │         │  │  • Ensemble    │  │
│                      │         │  └────────┬───────┘  │
└──────────────────────┘         │           │          │
                                 │  ┌────────▼───────┐  │
                                 │  │ Gemini API     │  │
                                 │  │ (Treatment)    │  │
                                 │  └────────┬───────┘  │
                                 │           │          │
                                 │  ┌────────▼───────┐  │
                                 │  │ Results &      │  │
                                 │  │ Visualization  │  │
                                 │  └────────────────┘  │
                                 └──────────────────────┘
```

## 🚀 Key Features

### Backend (Training)
- ✅ Support for three powerful architectures (ConvNeXt, EfficientNetV2, DeiT)
- ✅ Comprehensive data augmentation pipeline
- ✅ Transfer learning from ImageNet weights
- ✅ Detailed performance metrics and visualizations
- ✅ Automated model saving with metadata
- ✅ Jupyter notebook for interactive training

### Client (Deployment)
- ✅ User-friendly Gradio web interface
- ✅ Multi-model ensemble predictions
- ✅ Real-time confidence visualization
- ✅ AI-powered treatment advice (Google Gemini)
- ✅ Batch image processing
- ✅ Comprehensive logging and CSV export
- ✅ Progressive Web App (PWA) support

## 📁 Project Structure

```
model/
├── README.md                    # This file - complete system overview
│
├── backend/                     # Training pipeline
│   ├── README.md               # Training documentation
│   └── ML_Crop_Disease_Detection_Model.ipynb
│
└── client/                      # Inference application
    ├── README.md               # Deployment documentation
    ├── app.py                  # Gradio web application
    ├── classes.json            # Disease class definitions
    ├── requirements.txt        # Python dependencies
    ├── Demo.ipynb             # Development notebook
    ├── src/
    │   ├── model_handler.py   # Model loading logic
    │   └── predict.py         # Prediction functions
    ├── models/
    │   └── checkpoints/       # Trained .pth files go here
    └── logs/
        ├── predictions/       # Prediction results
        └── gemini/           # Treatment advice
```

## 🎯 Complete Workflow

### 1️⃣ Data Preparation
```bash
# Organize your dataset
your_dataset/
├── train/
│   ├── Disease_Class_1/
│   ├── Disease_Class_2/
│   └── Healthy/
├── validation/
└── test/
```

### 2️⃣ Model Training (Backend)

```bash
cd model/backend
jupyter notebook ML_Crop_Disease_Detection_Model.ipynb
```

**Steps:**
1. Load and explore dataset
2. Configure training parameters (classes, epochs, batch size)
3. Train models (ConvNeXt, EfficientNetV2, DeiT)
4. Evaluate performance
5. Save trained `.pth` files

**Output:** Three `.pth` model files

**See:** `model/backend/README.md` for detailed training instructions

### 3️⃣ Model Deployment (Client)

```bash
# Copy trained models
cp backend/*.pth client/models/checkpoints/

# Navigate to client
cd model/client

# Install dependencies
pip install -r requirements.txt

# Configure classes
# Edit classes.json to match your disease categories

# Set up Gemini API (optional)
# Create .env file with GEMINI_API_KEY=your_key

# Launch application
python app.py
```

**See:** `model/client/README.md` for detailed deployment instructions

### 4️⃣ Making Predictions

1. Open browser at `http://localhost:7860`
2. Upload crop leaf images
3. Select model (Best Overall, Individual, or Ensemble)
4. View predictions with visualizations
5. Get AI treatment advice
6. Download results as CSV

## 🔧 System Requirements

### For Training (Backend)
- **Python**: 3.8+
- **GPU**: CUDA-compatible (highly recommended)
- **RAM**: 8GB+ (16GB recommended)
- **Storage**: 10GB+ for datasets and models
- **OS**: Linux, Windows, macOS

### For Inference (Client)
- **Python**: 3.8+
- **GPU**: Optional (CPU works but slower)
- **RAM**: 4GB+
- **Storage**: 2GB+ for models
- **OS**: Linux, Windows, macOS

## 📦 Dependencies

```bash
# Core ML libraries
torch>=2.0.0
torchvision
timm

# Web interface
gradio>=4.26.0

# Data processing
pandas
numpy
pillow

# Visualization
matplotlib
seaborn

# Utilities
python-dotenv
requests
scikit-learn
```

Install all:
```bash
pip install -r model/client/requirements.txt
```

## 🌍 Adapting to Different Crops

This example demonstrates **rice leaf disease detection**, but the system is designed to work with any crop:

### Supported Crop Examples:
- 🌾 **Rice**: Bacterial blight, brown spot, leaf smut
- 🌾 **Wheat**: Rust, leaf blight, powdery mildew
- 🌽 **Corn**: Northern leaf blight, gray leaf spot, common rust
- 🍅 **Tomato**: Early blight, late blight, leaf mold, septoria
- 🥔 **Potato**: Early blight, late blight, black scurf
- 🥬 **Vegetable crops**: Various leaf diseases
- 🍇 **Grape**: Powdery mildew, downy mildew, black rot

### Steps to Adapt:

1. **Prepare Dataset**
   - Collect images of your target crop
   - Organize by disease classes
   - Split into train/validation/test sets

2. **Train Models**
   - Use `model/backend/` notebook
   - Update NUM_CLASSES and class names
   - Train on your dataset

3. **Deploy**
   - Copy `.pth` files to `model/client/models/checkpoints/`
   - Update `model/client/classes.json`
   - Launch `model/client/app.py`

4. **Test & Iterate**
   - Test with real images
   - Monitor performance
   - Retrain if needed

## 🎨 Model Architectures

### ConvNeXt-Base
- **Parameters**: 88M
- **Strengths**: Modern CNN design, excellent accuracy
- **Best for**: Overall balanced performance

### EfficientNetV2-M
- **Parameters**: 54M
- **Strengths**: Efficient, fast inference, good mobile performance
- **Best for**: Production deployment, resource-constrained environments

### DeiT-Small (Vision Transformer)
- **Parameters**: 22M
- **Strengths**: Attention mechanisms, captures global features
- **Best for**: Complex patterns, high-resolution images

### Ensemble (Recommended)
- **Combines**: All three models
- **Strengths**: Best overall accuracy, robust predictions
- **Best for**: Maximum performance, production use

## 📊 Performance Metrics

The system provides comprehensive metrics:
- **Accuracy**: Overall and per-class
- **Precision, Recall, F1-Score**
- **Confusion Matrix**
- **ROC Curves**
- **Confidence Scores**
- **Prediction Probabilities**

## 🤖 AI Treatment Advisor

Integration with **Google Gemini API** provides:
- **Disease Causes**: What causes the detected disease
- **Treatment Methods**: Recommended treatments and remedies
- **Prevention Measures**: How to prevent future occurrences

Results saved in JSON and CSV formats for easy access.

## 🔒 Important Notes

### ⚠️ Disclaimer
This system provides automated crop disease predictions and treatment suggestions for **educational and informational purposes only**. It is **not a substitute for professional agricultural advice**.

### ✅ Best Practices
1. **Always verify** predictions with domain experts
2. **Test thoroughly** before production deployment
3. **Monitor performance** regularly
4. **Update models** as new data becomes available
5. **Document changes** and maintain version control

## 📚 Documentation

- **Backend Training**: See `model/backend/README.md`
- **Client Deployment**: See `model/client/README.md`
- **Main Project**: See root `README.md` for VeAg platform integration

## 🐛 Troubleshooting

### Training Issues
- **OOM errors**: Reduce batch size, image size
- **Poor accuracy**: More epochs, data augmentation, balanced dataset
- **Overfitting**: Add dropout, regularization, more data

See: `model/backend/README.md` for detailed troubleshooting

### Deployment Issues
- **Models not loading**: Verify .pth files in checkpoints, check class count
- **CUDA errors**: Install correct PyTorch version, use CPU fallback
- **API errors**: Check Gemini API key, verify quota

See: `model/client/README.md` for detailed troubleshooting

## 🚀 Quick Start

### For Training:
```bash
cd model/backend
jupyter notebook ML_Crop_Disease_Detection_Model.ipynb
# Follow notebook instructions
# Copy generated .pth files to ../client/models/checkpoints/
```

### For Deployment:
```bash
cd model/client
pip install -r requirements.txt
# Update classes.json
python app.py
# Open http://localhost:7860
```

## 🔗 Integration with VeAg Platform

This model system integrates with the larger VeAg platform:
- **Server**: Stores case data, user information, subscriptions
- **Client**: Web application for farmers and agronomists
- **Model**: AI-powered disease detection (this component)

See main project README for complete platform documentation.

## 📝 License

This project is provided as-is for educational and research purposes.

## 🙏 Acknowledgments

- **PyTorch** and **TIMM** for model architectures
- **Gradio** for web interface
- **Google Gemini** for AI treatment recommendations
- Open-source crop disease datasets

---

**VeAg by Vacant Vectors** - Empowering agriculture with AI-powered disease detection and treatment recommendations.

For questions or contributions, please refer to the main project documentation.
