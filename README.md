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
