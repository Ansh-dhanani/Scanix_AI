from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import numpy as np
import joblib
import io
import base64
import os

app = Flask(__name__)
CORS(app)  # Allow all origins for simplicity

# Load the trained model
try:
    pipeline = joblib.load('tumor_detector.pkl')
    print("Model loaded successfully")
except Exception as e:
    print(f"Error loading model: {e}")
    pipeline = None

def preprocess_image(image):
    """Preprocess image for model prediction"""
    # Convert to grayscale and resize to match training data
    img = image.convert('L').resize((64, 64))
    img_array = np.array(img, dtype=np.float32) / 255.0  # Normalize to 0-1
    return img_array.flatten().reshape(1, -1)

@app.route('/', methods=['GET'])
def home():
    """Root endpoint"""
    return jsonify({
        'message': 'Scanix AI - Brain Tumor Detection API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/health',
            'predict': '/predict'
        }
    })

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'API is running',
        'model_loaded': pipeline is not None
    })

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    """Prediction endpoint"""
    if request.method == 'OPTIONS':
        return jsonify({'status': 'OK'})
    
    try:
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400
        
        # Extract base64 image data
        image_data = data['image']
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        # Decode and process image
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        if pipeline is None:
            return jsonify({'error': 'Model not available'}), 503
        
        # Use ML model for prediction
        img_features = preprocess_image(image)
        prediction = pipeline.predict(img_features)[0]
        probabilities = pipeline.predict_proba(img_features)[0]
        confidence = probabilities.max()
        
        # Debug logging
        print(f"Debug - Prediction: {prediction}, Probabilities: {probabilities}, Confidence: {confidence}")
        
        result = {
            'prediction': 'Tumor detected' if prediction == 1 else 'No tumor detected',
            'has_tumor': bool(prediction),
            'confidence': float(confidence)
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'error': f'Prediction failed: {str(e)}',
            'details': 'Please check your image format and try again'
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') != 'production'
    print(f"Starting Scanix AI API on port {port}")
    app.run(debug=debug, host='0.0.0.0', port=port)