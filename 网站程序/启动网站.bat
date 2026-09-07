@echo off
title Kaigong Site - Start
cd /d "%~dp0\backend"
set "SITE_PORT=8787"
set "SITE_RUNNING="
set "PORT_PID="

for /f %%i in ('powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='SilentlyContinue'; try { $resp = Invoke-WebRequest -Uri 'http://localhost:%SITE_PORT%/health' -UseBasicParsing -TimeoutSec 2; if ($resp.StatusCode -eq 200 -and $resp.Content -match 'kaigong-consultant-v13') { 'RUNNING' } } catch {}"') do set "SITE_RUNNING=%%i"

if /I "%SITE_RUNNING%"=="RUNNING" (
  echo.
  echo =====================================
  echo   Kaigong Site is already running
  echo =====================================
  echo.
  echo Home:   http://localhost:%SITE_PORT%
  echo Form:   http://localhost:%SITE_PORT%/guide-form
  echo Cases:  http://localhost:%SITE_PORT%/cases.html
  echo Annual: http://localhost:%SITE_PORT%/annual.html
  echo Admin:  http://localhost:%SITE_PORT%/admin.html
  echo.
  echo No need to start it again.
  pause
  exit /b 0
)

for /f %%i in ('powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='SilentlyContinue'; $conn = Get-NetTCPConnection -LocalPort %SITE_PORT% -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1; if ($conn) { $conn.OwningProcess }"') do set "PORT_PID=%%i"

if not "%PORT_PID%"=="" (
  echo.
  echo =====================================
  echo   Port %SITE_PORT% is already in use
  echo =====================================
  echo.
  echo PID: %PORT_PID%
  echo Another program is using port %SITE_PORT%.
  echo Please close that program first, or change PORT in backend\.env.
  pause
  exit /b 1
)

echo.
echo =====================================
echo   Starting Kaigong Site
echo =====================================
echo.
echo Step 1: install backend dependencies
call npm install
if errorlevel 1 (
  echo.
  echo Backend install failed. Please install Node.js 20 first.
  pause
  exit /b 1
)
echo.
echo Step 2: start web server
echo Home:   http://localhost:%SITE_PORT%
echo Form:   http://localhost:%SITE_PORT%/guide-form
echo Cases:  http://localhost:%SITE_PORT%/cases.html
echo Annual: http://localhost:%SITE_PORT%/annual.html
echo Admin:  http://localhost:%SITE_PORT%/admin.html
echo.
call npm start
pause
