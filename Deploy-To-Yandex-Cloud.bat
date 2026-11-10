@echo off
chcp 65001 >nul
title Развёртывание KAVAULT в Yandex Cloud (51.250.64.21)
echo ===================================================================
echo            РАЗВЁРТЫВАНИЕ KAVAULT В YANDEX CLOUD
echo                 Сервер: 51.250.64.21 (Ubuntu)
echo ===================================================================
echo.
echo ВНИМАНИЕ:
echo 1. Убедитесь, что виртуальная машина ЗАПУЩЕНА в консоли Yandex Cloud!
echo 2. В группе безопасности (default-sg-enpj2bhcj825qbvqrn2pi)
echo    открыты входящие порты: 80 (HTTP) и 4000 (API).
echo.
pause

echo.
echo [1/3] Создание чистого архива проекта (без node_modules и лишних файлов)...
tar.exe --exclude="node_modules" --exclude="release" --exclude=".git" --exclude="*.tar.gz" --exclude="*.zip" --exclude="ios" --exclude="android" --exclude="dist" --exclude=".github" -czf kavault-deploy.tar.gz .

if not exist kavault-deploy.tar.gz (
    echo Ошибка архивации!
    pause
    exit /b 1
)

echo.
echo [2/3] Копирование архива на сервер Yandex Cloud (51.250.64.21)...
scp -o StrictHostKeyChecking=no kavault-deploy.tar.gz kalio-453@51.250.64.21:~/

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ОШИБКА] Не удалось подключиться к серверу по SCP.
    echo Проверьте:
    echo 1. Запущена ли машина в консоли Yandex Cloud (зеленый статус "Running").
    echo 2. Открыт ли 22 порт (SSH) в группе безопасности.
    pause
    exit /b 1
)

echo.
echo [3/3] Запуск сборки Docker-контейнеров на сервере...
ssh -o StrictHostKeyChecking=no kalio-453@51.250.64.21 "mkdir -p ~/kavault && tar -xzf ~/kavault-deploy.tar.gz -C ~/kavault && rm -f ~/kavault-deploy.tar.gz && cd ~/kavault && chmod +x deploy.sh && ./deploy.sh"

echo.
echo Очистка локального архива...
del kavault-deploy.tar.gz 2>nul

echo.
echo ===================================================================
echo    ДЕПЛОЙ УСПЕШНО ЗАВЕРШЕН!
echo    Веб-версия KAVAULT доступна по ссылке:
echo    http://51.250.64.21
echo ===================================================================
pause
