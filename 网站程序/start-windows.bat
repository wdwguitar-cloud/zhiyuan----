@echo off
title 开工顾问网站 V13 工具化引流与产品矩阵
cd /d "%~dp0backend"
echo.
echo =====================================
echo   正在启动 开工顾问网站 V13
echo =====================================
echo.
echo 第一步：安装/检查依赖...
call npm install
if errorlevel 1 (
  echo.
  echo npm install 失败。请确认已安装 Node.js。
  echo 下载地址：https://nodejs.org/
  pause
  exit /b 1
)
echo.
echo 第二步：启动网站服务...
echo.
echo 启动成功后，请不要关闭这个窗口。
echo 首页：http://localhost:8787
echo 自检器：http://localhost:8787/self-check.html
echo 产品矩阵：http://localhost:8787/product-matrix.html
echo 后台：http://localhost:8787/admin.html
echo.
call npm start
pause
