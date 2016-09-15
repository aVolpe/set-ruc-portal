import React, { Component } from 'react';
import './Download.css';
var Config = require('../Config.js');

class Download extends Component {
  
  render() {
    return (
      <div>
        <div className="header">
          <h1>Descargar</h1>
          <h2>Obten los datos en formatos accesibles</h2>
        </div>
        <p>
          <a className="pure-button pure-button-primary first-button" href={Config.JSON_FILE} target="_blank">
            JSON
          </a>
          <a className="pure-button pure-button-primary" href={Config.CSV_FILE} target="_blank">
            CSV (separado por |)
          </a>
        </p>
      </div>
    );
  }
}

export default Download;