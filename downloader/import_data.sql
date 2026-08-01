CREATE TABLE rucs (ruc TEXT, name TEXT, dv TEXT, old TEXT, state TEXT);
.separator ','
.import --skip 1 ./output/data.csv rucs

CREATE TABLE stats AS
SELECT state AS label, COUNT(*) AS count FROM rucs GROUP BY state
UNION ALL
SELECT 'total' AS label, COUNT(*) AS count FROM rucs;
