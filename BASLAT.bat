@echo off
echo.
echo ======================================================
echo   Akilli Harclik ^& Finans Kocu - Proje Baslatici
echo ======================================================
echo.

:: Maven dizini ayarla
set MAVEN_HOME=C:\Users\DELL\Desktop\smart-finance-coach\apache-maven-3.9.15
set PATH=%MAVEN_HOME%\bin;%PATH%

echo [1] Backend baslatiliyor (Spring Boot - port 8080)...
echo.
start "Finans Kocu - Backend" cmd /k "cd /d C:\Users\DELL\Desktop\smart-finance-coach\backend && mvn spring-boot:run"

echo [2] Backend baslamasi icin 15 saniye bekleniyor...
timeout /t 15 /nobreak > nul

echo.
echo [3] Frontend baslatiliyor (React - port 5173)...
start "Finans Kocu - Frontend" cmd /k "cd /d C:\Users\DELL\Desktop\smart-finance-coach\frontend && npm run dev"

echo.
echo [4] Tarayici aciliyor...
timeout /t 5 /nobreak > nul
start http://localhost:5173

echo.
echo ======================================================
echo   Uygulama Basladi!
echo   Frontend : http://localhost:5173
echo   Backend  : http://localhost:8080
echo   H2 DB    : http://localhost:8080/h2-console
echo ======================================================
echo.
pause
