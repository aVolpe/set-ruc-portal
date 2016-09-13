import React, { Component } from 'react';
import './Validator.css';
import DigitGenerator from './DigitGenerator';
var Config = require('../Config.js');

class Validator extends Component {
  
  getValues = (ruc) => {
    return {
      ruc : ruc,
      digit : new DigitGenerator().getDigitoVerificadorBase11(ruc)
    };
  }
  
  changeCurrentRuc = (evt) => {
    this.setState(this.getValues(evt.target.value));
  };
  
  state = this.getValues(Config.EXAMPLE_RUC);
  
  render() {
    return (
      <div>
        <h1>Digitos verificadores</h1>
        <form>
          <label>Deseo obtener el digito validador de
            <input 
              className="ruc-input"
              placeholder={"1123456, 01-2140"} 
              type="text" 
              value={this.state.ruc}
              onChange={this.changeCurrentRuc} />
          </label>
        </form>
        <label>El dígito de {this.state.ruc} es {this.state.digit}</label>
      </div>
    );
  }
}

export default Validator;
