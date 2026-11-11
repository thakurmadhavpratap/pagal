@echo off
cd /d "%~dp0"
echo ========================================================
echo  Starting NoidaGym Marketplace Server on http://localhost:3000
echo ========================================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
  start "NoidaGym Server" cmd /k "node server.js"
) else if exist "C:\Users\user\AppData\Local\Programs\antigravity\Antigravity.exe" (
  set ELECTRON_RUN_AS_NODE=1
  start "NoidaGym Server" cmd /k ""C:\Users\user\AppData\Local\Programs\antigravity\Antigravity.exe" server.js"
) else (
  echo [ERROR] Node.js was not detected in PATH.
  echo Please install Node.js from https://nodejs.org
  pause
  exit /b 1
)

timeout /t 2 /nobreak >nul
echo Opening marketplace in default web browser...
start http://localhost:3000
