import React, { Component } from 'react';
var Config = require('../Config.js');

class Download extends Component {
  
  render() {
    return (
      <div>
        <h1>Descargar base de datos</h1>
        <ol>
          <li> <a href={Config.JSON_FILE} target="_blank">JSON</a> </li>
          <li> <a href={Config.CSV_FILE} target="_blank">CSV (separado por |)</a> </li>
        </ol>
      </div>
    );
  }
}

export default Download;