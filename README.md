# [BACKEND] Obligatorio DIU

## Description

Chat API hecha con NestJS y GraphQL como requisito de la materia Diseño de Interfaces de Usuario.

Playground deployado [aquí](https://obli-diu.herokuapp.com/api/graphql) en Heroku.

## Configuración

Crear un archivo `.env.local` con el siguiente contenido:

```ini
NODE_ENV=development
MONGO_CONN_STRING=
JWT_SECRET=secret
```

Para correr el sistema levantar una base de datos MongoDB en Atlas o local. Para levantarla local recomendamos [usar docker](https://hub.docker.com/_/mongo).

## Instalación de dependencias

```bash
$ yarn
```

## Correr la aplicación

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```
