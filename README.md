# Brain Tumor Detection App

A React frontend connected to a Flask API for brain tumor detection using machine learning.

## Setup

1. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Install Node.js dependencies:
   ```
   cd tumor-frontend
   npm install
   ```

## Running the Application

### Option 1: Use the startup script
```
start.bat
```

### Option 2: Manual startup
1. Start Flask API:
   ```
   python api.py
   ```

2. Start React frontend:
   ```
   cd tumor-frontend
   npm run dev
   ```

## Usage

1. Open http://localhost:5173 in your browser
2. Upload an MRI image
3. Click "Analyze Image" to get tumor detection results

## API Endpoints

- `POST /predict` - Upload image for tumor detection
  - Input: Base64 encoded image
  - Output: Prediction result with confidence score