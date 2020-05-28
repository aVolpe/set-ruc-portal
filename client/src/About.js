import React, { Component } from 'react';
import './License.css';

export default class About extends Component {
  render() {
    return  (
      <div>
        <div className="header">
          <h1>Acerca de</h1>
          <h2>Motivos por los cuales existe este portal</h2>
        </div>
        <div className="credit">
          <ol>
            <li>Probar si es realmente factible utilizar un IDE online, en este caso <a href="https://c9.io/" target="_blank" rel="noopener noreferrer">Cloud 9</a></li>
            <li>Aprender lo básico de React</li>
            <li>Aprender lo básico de node.js</li>

            <li>Disponibilizar en un formato accesible los datos de los contribuyentes</li>
            <li>Proveer algorítmos para la verificación de dígitos de manera sencilla</li>
          </ol>
        </div>
      </div>
    )
  }
}
