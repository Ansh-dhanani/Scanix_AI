from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
import io
import base64

app = Flask(__name__)
CORS(app)

# Device setup
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Transform
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# Label map
label_map = {
    0: "glioma",
    1: "meningioma", 
    2: "no_tumor",
    3: "pituitary"
}

# Load model
model = models.resnet18(weights=None)
model.fc = nn.Linear(model.fc.in_features, 4)
model = model.to(device)
model.load_state_dict(torch.load("brain_tumor_resnet18.pth", map_location=device))
model.eval()

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get image from request
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        file = request.files['image']
        img = Image.open(file.stream).convert('RGB')
        
        # Transform and predict
        img_tensor = transform(img).unsqueeze(0).to(device)
        with torch.no_grad():
            outputs = model(img_tensor)
            probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
            _, pred_idx = torch.max(outputs, 1)
            
        result = {
            'prediction': label_map[pred_idx.item()],
            'confidence': float(probabilities[pred_idx].item()),
            'probabilities': {label_map[i]: float(prob) for i, prob in enumerate(probabilities)}
        }
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)