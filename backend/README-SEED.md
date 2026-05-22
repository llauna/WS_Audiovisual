# 🌱 Database Seeder - Sistema de Eventos Audiovisuales

Este directorio contiene scripts y datos de prueba para poblar tu base de datos MongoDB con información realista para el sistema de gestión de eventos audiovisuales.

## 📁 Estructura de Archivos

```
backend/
├── seed-data/                    # Datos JSON
│   ├── clientes.json            # 5 clientes (RTVE, Antena 3, etc.)
│   ├── materiales.json          # 8 materiales (cámaras, audio, etc.)
│   ├── personal.json            # 10 personal (técnicos, productores, etc.)
│   ├── eventos.json             # 6 eventos con detalles completos
│   ├── registro_horas.json      # 5 registros de horas
│   └── notas_gastos.json        # 4 notas de gasto
├── app/src/main/java/com/david/app/config/
│   └── DataSeeder.java         # Clase Java para cargar datos
├── seed.sh                      # Script para Linux/Mac
├── seed.bat                     # Script para Windows
└── README-SEED.md              # Este archivo
```

## 🚀 Uso Rápido

### Windows
```bash
# Desde el directorio backend/
seed.bat clean    # Limpiar y poblar base de datos
seed.bat stats    # Ver estadísticas
seed.bat check    # Verificar conexión MongoDB
```

### Linux/Mac
```bash
# Desde el directorio backend/
chmod +x seed.sh   # Dar permisos de ejecución
./seed.sh clean    # Limpiar y poblar base de datos
./seed.sh stats    # Ver estadísticas
./seed.sh check    # Verificar conexión MongoDB
```

## 📊 Datos Incluidos

### 👥 Clientes (5)
- **Televisión Española** - Producción de programas
- **Antena 3** - Retransmisiones deportivas
- **Movistar+** - Producciones originales
- **Netflix España** - Series y documentales
- **Amazon Prime Video** - Producción de series

### 📦 Materiales (8)
- **Cámaras**: Sony FX9 (8 unidades)
- **Trípodes**: Manfrotto 504HD (12 unidades)
- **Monitores**: Sony OLED 7" (6 unidades)
- **Audio**: Micrófonos Sennheiser, grabadoras
- **Iluminación**: Sets LED ARRI SkyPanel
- **Drones**: DJI Inspire 2 (3 unidades)

### 👨‍💼 Personal (10)
- **Dirección**: Directores de producción
- **Producción**: Productores, asistentes
- **Técnicos**: Cámara, sonido, iluminación
- **Apoyo**: Maquillaje, grip, edición

### 📅 Eventos (6)
1. **Grabación Programa "El Hormiguero"** (15/05/2026)
2. **Montaje Teatro Real** (18/05/2026)
3. **Ensayo Documental** (20/05/2026)
4. **Retransmisión Fútbol LaLiga** (22/05/2026)
5. **Reunión Producción Netflix** (25/05/2026)
6. **Publicidad Coca-Cola** (28/05/2026)

### 💰 Datos Financieros
- **Registros de horas**: 5 registros con diferentes tarifas
- **Notas de gasto**: 4 gastos (catering, transporte, permisos)

## 🔧 Configuración Requerida

### 1. MongoDB
Asegúrate de que MongoDB esté corriendo:
```bash
# En Windows
net start MongoDB

# En Linux/Mac
sudo systemctl start mongod
```

### 2. Configuración Spring Boot
Verifica tu `application.properties`:
```properties
# MongoDB Configuration
spring.data.mongodb.uri=mongodb://localhost:27017/audiovisual_db
spring.data.mongodb.database=audiovisual_db
```

### 3. Dependencias Maven
Asegúrate de tener estas dependencias en `pom.xml`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>
```

## 🎯 Escenarios de Prueba

Los datos están diseñados para probar diferentes funcionalidades:

### 📋 Gestión de Eventos
- **Diferentes tipos**: Evento, Montaje, Ensayo, Otro
- **Estados de presupuesto**: Pendiente, Aceptado, Rechazado
- **Cálculos**: Modo días vs jornadas

### 📦 Gestión de Material
- **Stock control**: Total, disponible, reservado, reparación
- **Categorías**: Cámaras, audio, iluminación, drones
- **Tarifas**: Precios por día

### 👥 Gestión de Personal
- **Tipos de contrato**: Plantilla, Autónomo, Subcontratado
- **Roles**: Producción, técnicos, apoyo
- **Tarifas por hora**: Diferentes según rol

### 💰 Gestión Financiera
- **Registros de horas**: Vinculados a eventos y personal
- **Notas de gasto**: Con estados pendiente/pagado
- **Presupuestos**: Calculado vs presentado

## 🔍 Verificación de Datos

### Estadísticas Esperadas
```
📊 Database Statistics:
   • Clientes: 5
   • Materiales: 8
   • Personal: 10
   • Eventos: 6
   • Registros de horas: 5
   • Notas de gasto: 4
```

### Consultas MongoDB Útiles
```javascript
// Ver todos los eventos
db.eventos.find().pretty()

// Eventos por tipo
db.eventos.find({tipo: "Evento"}).pretty()

// Materiales disponibles
db.materiales.find({estado: "Disponible"}).pretty()

// Personal activo
db.personal.find({estado: "Activo"}).pretty()
```

## 🛠️ Personalización

### Modificar Datos
1. Edita los archivos JSON en `seed-data/`
2. Ejecuta `seed.bat clean` o `./seed.sh clean`

### Agregar Nuevos Datos
1. Crea nuevos archivos JSON
2. Modifica `DataSeeder.java` para incluirlos
3. Agrega nuevos métodos `seed*()`

### Modificar IDs
Los IDs se generan automáticamente por MongoDB. Si necesitas IDs específicos:
```json
{
  "_id": "custom-id-1",
  "nombre": "Tu dato"
}
```

## 🐛 Solución de Problemas

### Error de Conexión MongoDB
```bash
# Verificar si MongoDB está corriendo
mongosh --eval "db.adminCommand('ismaster')"

# En Windows
net start MongoDB

# En Linux/Mac
sudo systemctl status mongod
```

### Error de Compilación
```bash
# Limpiar y recompilar
mvn clean compile

# Verificar dependencias
mvn dependency:tree
```

### Error de Perfiles
Asegúrate de tener el perfil `seed` configurado:
```java
@Profile("seed")
public CommandLineRunner seedDatabase() {
```

## 📝 Notas Técnicas

- **Orden de carga**: Clientes → Materiales → Personal → Eventos → Registros → Notas
- **Limpieza**: Se borran todos los datos antes de cargar nuevos
- **Logs**: El proceso muestra logs detallados del progreso
- **Validación**: Los datos siguen las restricciones de los modelos Java

## 🔄 Actualización

Para actualizar los datos:
1. Modifica los archivos JSON
2. Ejecuta el script de seed
3. Verifica los resultados con `seed.bat stats`

## 📞 Soporte

Si encuentras problemas:
1. Verifica la conexión a MongoDB
2. Revisa los logs del seed
3. Verifica los formatos JSON
4. Comprueba la configuración de Spring Boot

---

**Versión**: 1.0.0  
**Última actualización**: Mayo 2026  
**Compatible con**: Spring Boot 3.x, MongoDB 6.x+
