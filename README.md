<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Teslo API

1. Clonar proyecto

2. npm install

3. Clonar archivo __.env.template__ y renombrarlo a __.env__

4. Cambiar las variables de entorno

5. Levantar Base de Datos
```
docker-compose up -d
```
6. Levantar servidor
```
npm run start:dev
```

7. Ejecutar SEED
```
http://localhost:3000/api/seed
```
8. Ir a swagger para probar los endpoints
```
http://localhost:3000/api
```

# Dependencias

* NestJS
* bcrypt
* Postgres
* socket.io
* uuid
* passport-jwt
* class-validator
* Docker

# Link Frontend

[TesloFrontend](https://github.com/DarkKapo/TesloFrontend)