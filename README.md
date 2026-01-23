# WS_Audiovisual

## Requisitos
- Java 17
- Maven
- Node.js + npm
- MongoDB (local en `mongodb://localhost:27017/audiovisual`)

## Arranque rapido (todo junto)
1) Inicia MongoDB (o aseguralo como servicio).
2) Instala dependencias del frontend:
   ```
   cd frontend
   npm install
   ```
3) Desde la raiz del proyecto:
   ```
   npm start
   ```

## Arranque por separado
- Backend:
  ```
  cd backend/app
  mvn spring-boot:run
  ```
- Frontend:
  ```
  cd frontend
  npm start
  ```

## Puertos
- Backend: `http://localhost:8081`
- Frontend: `http://localhost:4200`
