@echo off
chcp 65001 >nul
title Отправка KAVAULT на GitHub
echo ===================================================================
echo                     ОТПРАВКА KAVAULT НА GITHUB
echo ===================================================================
echo.
set "ROOT_DIR=%~dp0..\.."
cd /d "%ROOT_DIR%"

echo Текущая ветка: main
echo.
git status
echo.
set /p COMMIT_MSG="Введите сообщение для коммита (Enter для авто): "
if "%COMMIT_MSG%"=="" set COMMIT_MSG="chore: update project"

git add .
git commit -m "%COMMIT_MSG%"
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================================================
    echo    УСПЕШНО! Все изменения отправлены на GitHub!
    echo ===================================================================
) else (
    echo.
    echo [!] Ошибка при отправке на GitHub.
)
pause
