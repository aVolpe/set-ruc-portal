# Uso

## Obtener datos

Los datos se obtienen de la SET, se debe ejecutar el submódulo set-customers
(ver [https://github.com/aVolpe/set-customers/blob/master/README.md](README.md))
y luego ejecutar:

```bash
sqlite3 server/temp/db.db
```

Y luego:

```SQL
CREATE TABLE rucs (doc TEXT, name TEXT, div TEXT, old TEXT);
.separator '|'
.import  ./set-customers/result.txt  rucs
```

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
