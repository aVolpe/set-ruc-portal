import React, { Component } from 'react';
import './Search.css';

var Config = require('../Config.js');

class Search extends Component {
    
  doFetch = (ruc) => {
    fetch(Config.URL + 'find?query=' + ruc)
      .then((response) => response.json())
      .then((response) => this.setState({ result : response }));
  }
  
  getValues = (ruc) => {
    return {
      ruc : ruc,
      result : []
    };
  }
  
  changeCurrentRuc = (evt) => {
     let newRuc = evt.target.value;
     this.setState({ ruc : newRuc });
     if (!newRuc || newRuc.length < 3) {
         return;
     }
     this.doFetch(newRuc);
  }
  
  getRandomOption = () => {
    
    let initialOptions = [ Config.EXAMPLE_RUC, 'ASISMED', 'SANTA CLARA'];
    return initialOptions[Math.floor(Math.random()*initialOptions.length)];
  }
  
  state = this.getValues(this.getRandomOption());
  tes = this.doFetch(this.state.ruc);
  
  
  render() {
    return (
      <div>
        <div className="header">
          <h1>Buscador</h1>
          <h2>Busca personas por documento</h2>
        </div>
        <form className="pure-form">
          <p>
            <label>Ingrese un nombre o un RUC para buscar
              <input 
                className="ruc-input"
                placeholder={"1123456, ASISMED"} 
                type="text" 
                value={this.state.ruc}
                onChange={this.changeCurrentRuc} />
            </label>
          </p>
          <div className="result-container">
            <table className="pure-table pure-table-horizontal">
              <thead>
                  <tr>
                      <th>Documento</th>
                      <th>Nombre</th>
                      <th>Digito</th>
                  </tr>
              </thead>
              <tbody className="results-body">
                {this.state.result.map((i) => {
                  return (
                    <tr key={i.doc}>
                      <th>{i.doc}</th>
                      <th>{i.name}</th>
                      <th>{i.div}</th>
                    </tr>);
                })}
              </tbody>
            </table>
          </div>
          <p>Puedes buscar por nombre (si es persona fisica primero pon el apellido) o por
          numero de RUC (sin digito verificador)</p>
          <p> Se limita el resultado a 10 elementos, ingresa mas para 
            mejorar los resultados.
          </p>
        </form>
      </div>
    );
  }
}

export default Search;