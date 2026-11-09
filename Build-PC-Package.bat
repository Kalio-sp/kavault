@echo off
chcp 65001 >nul
title Сборка архива KAVAULT для друзей
echo ==========================================================
echo        СБОРКА ZIP-АРХИВА KAVAULT ДЛЯ WINDOWS
echo ==========================================================
echo.
echo Архивируем портативную версию для ПК в KAVAULT-Windows.zip...
tar.exe -a -c -f KAVAULT-Windows.zip -C kavault-frontend\release win-unpacked
echo.
echo Готово! Файл KAVAULT-Windows.zip создан в корне проекта.
echo Вы можете отправить этот ZIP-архив друзьям.
pause
