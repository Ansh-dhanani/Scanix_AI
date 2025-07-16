@echo off
echo Starting Tumor Detection Application...

echo Installing Python dependencies...
pip install -r requirements.txt

echo Starting Flask API...
start "Flask API" python api.py

echo Starting React Frontend...
cd tumor-frontend
start "React App" npm run dev

echo Both services are starting...
echo Flask API: http://localhost:5000
echo React App: http://localhost:5173
pause