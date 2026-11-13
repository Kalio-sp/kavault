@echo off
chcp 65001 >nul
title KAVAULT Network Server (for PC & iPhone)
echo ========================================================
echo   KAVAULT Server для ПК и подключения с iPhone по Wi-Fi
echo ========================================================
echo.
echo 1. Убедитесь, что iPhone и ПК подключены к одной сети Wi-Fi
echo 2. Адрес для открытия в Safari на iPhone: http://192.168.0.100:5173
echo 3. Адрес бэкенда API:                     http://192.168.0.100:4000
echo.
echo Запуск бэкенда и фронтенда...
start "KAVAULT Backend (Порт 4000)" cmd /c "cd /d "%~dp0..\..\kavault-backend" && npm run start"
start "KAVAULT Frontend (Порт 5173)" cmd /c "cd /d "%~dp0..\..\kavault-frontend" && npm run dev"
echo.
echo Серверы запущены! Теперь страница на iPhone будет открываться моментально.
pause
