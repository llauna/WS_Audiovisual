@echo off
REM Script para ejecutar el seed de datos en MongoDB (Windows)
REM Uso: seed.bat [clean|stats]

echo 🎬 Audiovisual Events - Database Seeder
echo ======================================

REM Verificar si estamos en el directorio correcto
if not exist "pom.xml" (
    echo ❌ Error: Debes ejecutar este script desde el directorio raíz del backend (donde está pom.xml)
    pause
    exit /b 1
)

REM Procesar argumentos
if "%1"=="clean" goto clean
if "%1"=="stats" goto stats
if "%1"=="check" goto check

goto help

:check
echo 🔍 Verificando conexión a MongoDB...
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=test" -q >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Conexión a MongoDB exitosa
) else (
    echo ❌ Error: No se puede conectar a MongoDB
    echo    Asegúrate de que MongoDB esté corriendo y accesible
    echo    Verifica tu configuración en application.properties
    pause
    exit /b 1
)
goto end

:clean
echo 🧹 Limpiando y poblando la base de datos...

REM Compilar el proyecto
echo 📦 Compilando proyecto...
mvn clean compile -q

REM Ejecutar el seed
echo 🌱 Ejecutando seed de datos...
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=seed" -q

echo ✅ Seed completado exitosamente!
goto end

:stats
echo 📊 Mostrando estadísticas de la base de datos...
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=stats" -q
goto end

:help
echo Uso: %0 {clean^|stats^|check}
echo.
echo Comandos:
echo   clean  - Limpia la base de datos y carga los datos de prueba
echo   stats  - Muestra estadísticas de la base de datos
echo   check  - Verifica la conexión a MongoDB
echo.
echo Ejemplo:
echo   %0 clean    # Poblar la base de datos con datos de prueba
echo   %0 stats    # Ver estadísticas
pause
exit /b 1

:end
pause
