@echo off
chcp 65001 >nul
title KAVAULT Desktop
echo ===================================================
echo   Запуск KAVAULT Desktop (ПК Приложение)
echo ===================================================
start "" "%~dp0..\..\kavault-frontend\release\win-unpacked\KAVAULT.exe"
exit
