#!/usr/bin/env python3
"""
Scanix AI - Model Testing Script
Tests the trained tumor detection model with sample images.
"""

from PIL import Image
import numpy as np
import joblib
import sys
import os

def load_model():
    """Load the trained model."""
    try:
        return joblib.load('tumor_detector.pkl')
    except FileNotFoundError:
        print("Error: tumor_detector.pkl not found. Run train_model.py first.")
        sys.exit(1)

def preprocess_image(image_path):
    """Preprocess image for model prediction."""
    if not os.path.exists(image_path):
        print(f"Error: Image {image_path} not found.")
        return None
    
    img = Image.open(image_path).convert('L').resize((64, 64))
    img_array = np.array(img).flatten()
    return img_array.reshape(1, -1)

def main():
    """Main testing function."""
    pipeline = load_model()
    
    # Test with available images
    test_images = ['img_1.png', 'img.png']
    
    for image_path in test_images:
        if os.path.exists(image_path):
            print(f"\nTesting: {image_path}")
            img_features = preprocess_image(image_path)
            
            if img_features is not None:
                prediction = pipeline.predict(img_features)[0]
                confidence = pipeline.predict_proba(img_features)[0].max()
                
                result = "Tumor detected" if prediction == 1 else "No tumor detected"
                print(f"Prediction: {result}")
                print(f"Confidence: {confidence:.2%}")
        else:
            print(f"Image {image_path} not found, skipping...")

if __name__ == "__main__":
    main()
