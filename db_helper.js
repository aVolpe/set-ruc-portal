var ex = module.exports = {};

var data = ex.data = {
    dbName : 'db.db',
    tableName : 'rucs',
    maxResults : 3
};

ex.init = function() {
    
    data.sqlite = require('sqlite3');
    data.db = new data.sqlite.Database(data.dbName);
    data.loaded = true;
};

/**
 * The callback receives true if the
 * database has elements, or else false.
 */
ex.hasData = function(callback) {
    if (!data.loaded) ex.init();
    
    data.db.get('SELECT * FROM ' + data.tableName + ' LIMIT 1',
        function (err, count) {
            if (err) callback(false);
            else callback(true);
        });
};

/**
 * Uses the set_parser to get all the initial
 * data and stores it in the database
 */
ex.loadDataFromSet = function(success) {
    if (!data.loaded) ex.init();
    var db = data.db;
    
    var set_parser = require('./set_parser.js');
    
    db.run('CREATE TABLE ' + data.tableName + ' (doc TEXT, name TEXT, div TEXT, old TEXT)', [],  function() {
      var stmt = db.prepare('INSERT INTO ' + data.tableName + ' VALUES ($doc, $name, $div, $old)');
      var i = 0;
      set_parser.readByRow(function newLine(row) {
        console.log('Valor numero ' + i++);
        stmt.run(row);
      }, function endStream() {
        stmt.finalize(success);
      });
    });
};

/**
 * Queries the database with the given ruc
 */
ex.findByRuc = function(query, success) {
    if (!data.loaded) ex.init();
    
    data.db.all('SELECT * FROM ' + data.tableName + ' WHERE doc LIKE $doc LIMIT $size', 
        { 
            $doc : '%' + query + '%',
            $size : data.maxResults
        },
        function(err, rows) {
            if (!err) return success(rows);
            console.log(err);
        });
};