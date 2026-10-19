@echo off
title Flow Desktop Installer
echo ========================================================
echo    Flow Music Player - Windows Desktop Setup
echo ========================================================
echo.
echo Installing Flow shortcuts and configuring desktop integration...
powershell -ExecutionPolicy Bypass -File "%~dp0scripts\install-desktop.ps1"
echo.
echo Setup completed! Launching Flow Desktop...
start "" "%~dp0Flow.exe"
pause
