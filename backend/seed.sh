#!/bin/bash

# Script para ejecutar el seed de datos en MongoDB
# Uso: ./seed.sh [clean|stats]

set -e

echo "🎬 Audiovisual Events - Database Seeder"
echo "======================================"

# Verificar si estamos en el directorio correcto
if [ ! -f "pom.xml" ]; then
    echo "❌ Error: Debes ejecutar este script desde el directorio raíz del backend (donde está pom.xml)"
    exit 1
fi

# Función para mostrar estadísticas
show_stats() {
    echo "📊 Mostrando estadísticas de la base de datos..."
    mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=stats" -q
}

# Función para limpiar y hacer seed
clean_and_seed() {
    echo "🧹 Limpiando y poblando la base de datos..."
    
    # Compilar el proyecto
    echo "📦 Compilando proyecto..."
    mvn clean compile -q
    
    # Ejecutar el seed
    echo "🌱 Ejecutando seed de datos..."
    mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=seed" -q
    
    echo "✅ Seed completado exitosamente!"
}

# Función para verificar conexión a MongoDB
check_mongodb() {
    echo "🔍 Verificando conexión a MongoDB..."
    
    # Intentar conectar a MongoDB usando el perfil por defecto
    if mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=test" -q > /dev/null 2>&1; then
        echo "✅ Conexión a MongoDB exitosa"
        return 0
    else
        echo "❌ Error: No se puede conectar a MongoDB"
        echo "   Asegúrate de que MongoDB esté corriendo y accesible"
        echo "   Verifica tu configuración en application.properties"
        return 1
    fi
}

# Procesar argumentos
case "$1" in
    "clean")
        check_mongodb
        clean_and_seed
        ;;
    "stats")
        show_stats
        ;;
    "check")
        check_mongodb
        ;;
    *)
        echo "Uso: $0 {clean|stats|check}"
        echo ""
        echo "Comandos:"
        echo "  clean  - Limpia la base de datos y carga los datos de prueba"
        echo "  stats  - Muestra estadísticas de la base de datos"
        echo "  check  - Verifica la conexión a MongoDB"
        echo ""
        echo "Ejemplo:"
        echo "  $0 clean    # Poblar la base de datos con datos de prueba"
        echo "  $0 stats    # Ver estadísticas"
        exit 1
        ;;
esac
