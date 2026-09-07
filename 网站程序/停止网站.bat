@echo off
title Kaigong Site - Stop
cd /d "%~dp0"
set "SITE_PORT=8787"
set "SITE_PID="
set "SITE_OK="

for /f %%i in ('powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='SilentlyContinue'; try { $resp = Invoke-WebRequest -Uri 'http://localhost:%SITE_PORT%/health' -UseBasicParsing -TimeoutSec 2; if ($resp.StatusCode -eq 200 -and $resp.Content -match 'kaigong-consultant-v13') { 'OK' } } catch {}"') do set "SITE_OK=%%i"

for /f %%i in ('powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='SilentlyContinue'; $conn = Get-NetTCPConnection -LocalPort %SITE_PORT% -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1; if ($conn) { $conn.OwningProcess }"') do set "SITE_PID=%%i"

if "%SITE_PID%"=="" (
  echo.
  echo =====================================
  echo   Kaigong Site is not running
  echo =====================================
  echo.
  echo No process is listening on port %SITE_PORT%.
  pause
  exit /b 0
)

if /I not "%SITE_OK%"=="OK" (
  echo.
  echo =====================================
  echo   Port %SITE_PORT% is in use
  echo =====================================
  echo.
  echo PID: %SITE_PID%
  echo The process on port %SITE_PORT% did not identify itself as this website.
  echo To avoid stopping the wrong program, no action was taken.
  pause
  exit /b 1
)

echo.
echo =====================================
echo   Stopping Kaigong Site
echo =====================================
echo.
echo PID: %SITE_PID%
taskkill /PID %SITE_PID% /F
if errorlevel 1 (
  echo.
  echo Stop failed. Please close the Node window manually.
  pause
  exit /b 1
)

echo.
echo Kaigong Site has been stopped.
pause
