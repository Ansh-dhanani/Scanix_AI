@echo off
echo Starting Flask API...
cd /d "f:\project\learning-stuff\tumorORno"
py -m pip install flask flask-cors pillow numpy scikit-learn joblib
py api.py
pause