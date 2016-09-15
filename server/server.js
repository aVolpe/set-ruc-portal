var http = require('http');
var express = require('express');
var dbHelper = require('./db_helper.js');
var cors = require('cors');

var router = express();
var server = http.createServer(router);
router.use(cors());

var config = {
  csv_file : 'temp/data.csv',
  json_file : 'temp/data.json'
}

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
  switch (req.params['tipo']) {
    case 'csv':
      res.download(config.csv_file);
      break;
    case 'json':
      res.download(config.json_file);
      break;
    default:
      res.json({
        message: 'Invalid format'
      });
  }
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at ", addr.address + ":" + addr.port);
});
