@echo off
chcp 65001 >nul
color 0b
mode con: cols=100 lines=30
title Scanix AI - Brain Tumor Detection System

cls
echo.
echo                              Loading Scanix AI...
echo.
echo                                    [    ]
timeout /t 1 /nobreak >nul
cls
echo.
echo                              Loading Scanix AI...
echo.
echo                                    [#   ]
timeout /t 1 /nobreak >nul
cls
echo.
echo                              Loading Scanix AI...
echo.
echo                                    [##  ]
timeout /t 1 /nobreak >nul
cls
echo.
echo                              Loading Scanix AI...
echo.
echo                                    [### ]
timeout /t 1 /nobreak >nul
cls
echo.
echo                              Loading Scanix AI...
echo.
echo                                    [####]
timeout /t 1 /nobreak >nul
cls

echo.
echo                   ######   #####    #    #   # # #   #
echo                   #       #        # #   ##  # #  # #
echo                   #####   #       #####  # # # #   #
echo                       #   #       #   #  # # # #   #
echo                       #   #       #   #  #  ## #  # #
echo                   #####    #####  #   #  #   # # #   #
echo.
echo                      AI-Powered Brain Tumor Detection System
echo                            Built by Manan and Ansh
echo.
echo ================================================================================
timeout /t 2 /nobreak >nul
echo [*] Initializing Scanix AI System...
timeout /t 1 /nobreak >nul
echo [*] Loading ML Models...
timeout /t 1 /nobreak >nul
echo [*] Starting Backend Services...
timeout /t 1 /nobreak >nul
echo [*] Preparing Frontend Interface...
timeout /t 1 /nobreak >nul
echo ================================================================================
echo [PYTHON] Starting Flask API Server...
start /min "Flask API Server" cmd /k "python api.py"
timeout /t 2 /nobreak >nul
echo [REACT] Starting React Development Server...
cd frontend
start /min "React Frontend" cmd /k "npm run dev"
cd ..
timeout /t 3 /nobreak >nul
start http://localhost:5173
echo ================================================================================
echo                                 SYSTEM READY!
echo.
echo                      Flask API: http://localhost:5000
echo                      React App: http://localhost:5173
echo.
echo                   Frontend opened in your default browser!
echo                            Press any key to continue...
echo ================================================================================
pause >nul