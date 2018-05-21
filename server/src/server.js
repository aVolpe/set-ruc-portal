var http = require('http');
var express = require('express');
var dbHelper = require('./db_helper.js');
var cors = require('cors');

var router = express();
var server = http.createServer(router);
router.use(cors());

var config = {
  csv_file : 'src/temp/data.csv',
  json_file : 'src/temp/data.json'
}

router.get('/find', function(req, res) {
  if (!req.query.query)
    res.json({ message : 'Invalid query'});
  else {
    if (!isNaN(req.query.query))
      dbHelper.findByRuc(req.query.query, function(data) {
        res.json(data);
      });
    else
      dbHelper.findByName(req.query.query, function(data) {
        res.json(data);
      });
  }

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

server.listen(process.env.PORT || 2001, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at ", addr.address + ":" + addr.port);
});
