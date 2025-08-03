@echo off
echo Starting Scanix AI Application...

echo Installing Python dependencies...
pip install -r requirements.txt

echo Starting Flask API...
start "Scanix API" python api.py

echo Starting React Frontend...
cd frontend
if exist package.json (
    npm install
    start "Frontend" cmd /k "npm run dev"
) else (
    echo Error: package.json not found in frontend directory
)
cd ..

echo.
echo Waiting for services to start...
timeout /t 5 /nobreak >nul

echo ================================
echo   SCANIX AI IS READY!
echo ================================
echo API Server: http://localhost:5000
echo Frontend:   http://localhost:5173
echo.
echo Opening browser...
start http://localhost:5173
echo.
echo Press any key to exit...
pause