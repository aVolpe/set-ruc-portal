# Importar datos

Los datos se obtienen de la SET, se debe ejecutar el submodulo 
set-customers (ver README.md) y luego ejecutar:

```SQL
CREATE TABLE rucs (doc TEXT, name TEXT, div TEXT, old TEXT);
.separator '|'
.import  ./set-customers/result.txt  rucs
```

El archivo db_helper.js tiene una manera de crear la db desde
javascript, pero es muy lento.

Una vez finalizada la creación de la db, se debe generar
los archivos para descargar, lo que se realiza ejecutando:

```
node download_builder.js
```

Luego ya puede iniciarse el servidor.

# Archivos importantes

* temp/db.db sqlite temporal (para busquedas)
* temp/data.csv versión en csv para descarga
* temp/data.json versión en JSON para descarga
