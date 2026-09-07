@echo off
title Kaigong Site - Rebuild React
cd /d "%~dp0\app-frontend"
echo.
echo =====================================
echo   Rebuilding React frontend
echo =====================================
echo.
echo Step 1: install frontend dependencies
call npm install
if errorlevel 1 (
  echo.
  echo Frontend install failed. Please install Node.js 20 first.
  pause
  exit /b 1
)
echo.
echo Step 2: build dist
call npm run build
if errorlevel 1 (
  echo.
  echo React build failed. Please check the file you changed.
  pause
  exit /b 1
)
echo.
echo React build finished.
echo Refresh http://localhost:8787 to review the page.
pause
