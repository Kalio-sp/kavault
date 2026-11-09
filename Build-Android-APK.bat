@echo off
chcp 65001 >nul
title Сборка Android APK для KAVAULT
echo ==========================================================
echo             СБОРКА ANDROID APK (KAVAULT)
echo ==========================================================
echo.
echo [1/3] Сборка веб-интерфейса фронтенда...
cd kavault-frontend
call npm run build

echo.
echo [2/3] Синхронизация ассетов с нативным проектом Android...
call npx cap sync android

echo.
echo [3/3] Сборка APK через Gradle...
cd android
call gradlew.bat assembleDebug

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ==========================================================
    echo   УСПЕШНО! APK файл готов:
    echo   kavault-frontend\android\app\build\outputs\apk\debug\app-debug.apk
    echo ==========================================================
) else (
    echo.
    echo Примечание: для локальной сборки требуется установленная Java 17.
    echo Если локально Java нет, APK автоматически собирается в облаке GitHub Actions!
)
cd ..\..
pause
