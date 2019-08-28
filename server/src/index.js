const cors = require('cors');
const express = require('express');
const http = require('http');
const {DBHelper} = require('./lib/DBHelper.js');

const router = express();
const server = http.createServer(router);
router.use(cors());
const db = new DBHelper();

const config = {
  csv_file: 'src/temp/data.csv',
  json_file: 'src/temp/data.json'
};

router.get('/find', (req, res) => {
  let query = req.query.query;
  query = query && query.trim();

  if (!query)
    res.status(400).send({message: 'Invalid query'});
  else {
    if (isNaN(parseInt(query, 10))) {
      console.log("Searching by name. ", query)
      db.findByName(query).then(data => {
        res.send(data);
      }).catch(e => console.warn(e) && res.status(500).send(e));
    } else {
      console.log("Searching by document. ", query)
      db.findByRuc(req.query.query).then(data => {
        res.send(data);
      }).catch(e => console.warn(e) && res.status(500).send(e));
    }
  }

});

router.get('/all.:tipo', (req, res) => {
  switch (req.params['tipo']) {
    case 'csv':
      res.download(config.csv_file);
      break;
    case 'json':
      res.download(config.json_file);
      break;
    default:
      res.status(400).send({
        message: 'Invalid format'
      });
  }
});

const port = parseInt(process.env.PORT || "2001");
const hostname = process.env.IP ? "0.0.0.0" : "";

server.listen(port,
  hostname,
  () => {
    console.log("Server listening at ", server.address());
  });
