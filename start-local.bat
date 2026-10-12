@echo off
rem MathPivot — one-click local dev server
rem Double-click this file; a browser tab opens at http://localhost:3000
cd /d "%~dp0"
set "PATH=C:\Program Files\nodejs;%APPDATA%\npm;%PATH%"
title MathPivot Dev Server (close this window to stop)
echo Starting MathPivot on http://localhost:3000 ...
echo Keep this window open while you use the app. Close it to stop the server.
start "" cmd /c "timeout /t 6 /nobreak >nul & start http://localhost:3000"
pnpm dev
if errorlevel 1 (
  echo.
  echo pnpm failed — trying npx pnpm instead...
  npx pnpm dev
)
pause
