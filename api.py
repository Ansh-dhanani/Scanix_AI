from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import numpy as np
import joblib
import io
import base64

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173', 'http://localhost:5174'])

# Load the trained model
pipeline = joblib.load('tumor_detector.pkl')

def preprocess_image(image):
    img = image.convert('L').resize((64, 64))
    img_array = np.array(img).flatten()
    return img_array.reshape(1, -1)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'API is running'})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        image_data = data['image'].split(',')[1]  # Remove data:image/jpeg;base64,
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        img_features = preprocess_image(image)
        prediction = pipeline.predict(img_features)[0]
        confidence = pipeline.predict_proba(img_features)[0].max()
        
        result = {
            'prediction': 'Tumor detected' if prediction == 1 else 'No tumor detected',
            'has_tumor': bool(prediction),
            'confidence': float(confidence)
        }
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)