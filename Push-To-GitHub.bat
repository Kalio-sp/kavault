@echo off
chcp 65001 >nul
title Отправка KAVAULT на GitHub
echo ===================================================================
echo                     ОТПРАВКА KAVAULT НА GITHUB
echo ===================================================================
echo.
echo Текущая ветка: main
echo Все файлы зафиксированы в чистом коммите.
echo.
set /p REPO_URL="Вставьте ссылку на ваш GitHub-репозиторий (например, https://github.com/ваш-логин/kavault.git): "

if "%REPO_URL%"=="" (
    echo Ссылка не указана.
    pause
    exit /b 1
)

git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main

echo.
echo Отправляем проект в репозиторий origin/main...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================================================
    echo    УСПЕШНО! Ваш проект KAVAULT опубликован на GitHub!
    echo ===================================================================
) else (
    echo.
    echo [!] Произошла ошибка при отправке. Проверьте правильность ссылки и авторизацию в GitHub.
)
pause
