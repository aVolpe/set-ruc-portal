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
  
  state = this.getValues(Config.EXAMPLE_RUC);
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
            <label>Ingrese un RUC (o una parte) para buscar:
              <input 
                className="ruc-input"
                placeholder={"1123456, 01-2140"} 
                type="text" 
                value={this.state.ruc}
                onChange={this.changeCurrentRuc} />
            </label>
            <div className="result-container">
              <table className="pure-table">
                <thead>
                    <tr>
                        <th>Doc</th>
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
          </p>
        </form>
      </div>
    );
  }
}

export default Search;