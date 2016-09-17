# Uso

## Obtener datos

Los datos se obtienen de la SET, se debe ejecutar el submódulo set-customers
(ver [https://github.com/aVolpe/set-customers/blob/master/README.md](README.md))
y luego ejecutar:

```bash
# Creamos el directorio donde almacenaremos todo
cd server
mkdir temp 
node download_builder.js csv
node download_builder.js pdf

# Insertamos en un SQlite
sqlite3 temp/db.db
```

Y luego:

```SQL
CREATE TABLE rucs (doc TEXT, name TEXT, div TEXT, old TEXT);
.separator '|'
.import  ./temp/data.csv rucs
```

Listo!, no deben salir errores.

El archivo `db_helper.js` tiene una manera de crear la db desde
javascript, pero no es muy eficiente

Una vez finalizada la creación de la db, se debe generar
los archivos para descargar, lo que se realiza ejecutando:

```
node download_builder.js
```

Luego ya puede iniciarse el servidor.

## Archivos importantes

* `server/temp/db.db` sqlite temporal (para búsquedas)
* `server/temp/data.csv` versión en csv para descarga
* `server/temp/data.json` versión en JSON para descarga

## Ejecución

### Servidor

```bash
cd server
npm install
node server.js
```

### Cliente

```bash
cd client
npm install
npm start
```

### Docker

Una vez construidas el servidor y el cliente, se puede ejecutar Docker:

```bash
docker-compose up -d
```
