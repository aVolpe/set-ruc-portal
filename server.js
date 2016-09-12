var http = require('http');
var express = require('express');
var dbHelper = require('./db_helper.js');
var cors = require('cors');

var router = express();
var server = http.createServer(router);
router.use(cors());

router.get('/', function(req, res) {
  res.send('Hello world');
});

router.get('/find', function(req, res) {
  if (!req.query.query) 
    res.json({ message : 'Invalid query'});
  else
    dbHelper.findByRuc(req.query.query, function(data) {
      res.json(data);
    });
});

router.get('/all.:tipo', function(req, res) {
  var tipo = req.params['tipo'];
  if (tipo != 'json' && tipo != 'csv') {
    return res.json({
      message: 'Invalid format'
    });
  }
  res.send('El tipo pedido es' + req.params['tipo']);
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
