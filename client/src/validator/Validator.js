import React, {
  Component
}
from 'react';
import './Validator.css';
import DigitGenerator from './DigitGenerator';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import EmbeddedGist from '../util/EmbeddedGist.js';
var Config = require('../Config.js');

class Validator extends Component {

  getValues = (ruc) => {
    return {
      ruc: ruc,
      digit: new DigitGenerator().getDigitoVerificadorBase11(ruc)
    };
  }

  changeCurrentRuc = (evt) => {
    this.setState(this.getValues(evt.target.value));
  };

  state = this.getValues(Config.EXAMPLE_RUC);

  render() {
    return (
      <div>
        <div className="header">
          <h1>Digitos verificadores</h1>
          <h2>Verificación rápida de RUCs</h2>
        </div>
        <form className="pure-form">
          <p>
            <label>El dígito verificador de <input 
              className="ruc-input"
              placeholder={"1123456, 01-2140"} 
              type="text" 
              value={this.state.ruc}
              onChange={this.changeCurrentRuc} /> es <b>{this.state.digit}</b></label>
          </p>
        </form>

        <h2> Codigo fuente: </h2>
        <Tabs>
          <TabList>
            <Tab>Java</Tab>
            <Tab>JavaScript</Tab>
          </TabList>
          <TabPanel>
            <EmbeddedGist gist="aVolpe/fffbe6a9e9858c7e3546fb1d55782152" file="SetUtils.java"></EmbeddedGist>
          </TabPanel>
          <TabPanel>
            <EmbeddedGist gist="aVolpe/fffbe6a9e9858c7e3546fb1d55782152" file="DigitGenerator.js"></EmbeddedGist>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default Validator;
