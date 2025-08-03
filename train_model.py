#!/usr/bin/env python3
"""
Scanix AI - Model Training Script
Trains a brain tumor detection model using logistic regression.
"""

from datasets import load_dataset
from PIL import Image
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from collections import Counter
import joblib

# Configuration
TARGET_IMAGE_SIZE = (64, 64)
MIN_SAMPLES_PER_CLASS = 3000
MODEL_FILENAME = 'tumor_detector.pkl'

def load_and_preprocess_data():
    """Load and preprocess the brain tumor dataset."""
    print("Loading dataset...")
    dataset = load_dataset("hungngo04/brain-tumor-binary-classification-dataset", 
                          split="train", streaming=True)
    
    X, y = [], []
    label_counter = Counter()
    
    for sample in dataset:
        label = sample["label"]
        img = sample["image"].convert("L").resize(TARGET_IMAGE_SIZE)
        X.append(np.array(img).flatten())
        y.append(label)
        label_counter[label] += 1
        
        # Stop when both classes have enough samples
        if len(label_counter) == 2 and min(label_counter.values()) >= MIN_SAMPLES_PER_CLASS:
            break
    
    print(f'Loaded samples: {label_counter}')
    return np.array(X), np.array(y)

def train_model(X, y):
    """Train the tumor detection model."""
    print("\nSplitting dataset...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"Training set: {Counter(y_train)}")
    print(f"Test set: {Counter(y_test)}")
    
    print("\nTraining model...")
    pipeline = make_pipeline(
        StandardScaler(), 
        LogisticRegression(max_iter=1000, random_state=42)
    )
    pipeline.fit(X_train, y_train)
    
    return pipeline, X_test, y_test

def evaluate_model(pipeline, X_test, y_test):
    """Evaluate the trained model."""
    print("\nEvaluating model...")
    y_pred = pipeline.predict(X_test)
    
    metrics = {
        'Accuracy': accuracy_score(y_test, y_pred),
        'Precision': precision_score(y_test, y_pred),
        'Recall': recall_score(y_test, y_pred),
        'F1 Score': f1_score(y_test, y_pred)
    }
    
    for metric, value in metrics.items():
        print(f"{metric}: {value:.4f}")
    
    return metrics

def main():
    """Main training function."""
    try:
        # Load and preprocess data
        X, y = load_and_preprocess_data()
        
        # Train model
        pipeline, X_test, y_test = train_model(X, y)
        
        # Evaluate model
        evaluate_model(pipeline, X_test, y_test)
        
        # Save model
        print(f"\nSaving model to {MODEL_FILENAME}...")
        joblib.dump(pipeline, MODEL_FILENAME)
        print("Model training completed successfully!")
        
    except Exception as e:
        print(f"Error during training: {str(e)}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())
