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
        <h1>Buscar RUC's</h1>
        <form>
          <label>Ingrese un RUC (o una parte) para buscar:
            <input 
              className="ruc-input"
              placeholder={"1123456, 01-2140"} 
              type="text" 
              value={this.state.ruc}
              onChange={this.changeCurrentRuc} />
          </label>
          <div className="results">
            <ol>
              {this.state.result.map((i) => {
                return <li key={i.doc}>{i.name}</li>;
              })}
            </ol>
          </div>
        </form>
      </div>
    );
  }
}

export default Search;