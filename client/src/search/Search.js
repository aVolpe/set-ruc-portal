import React, { Component } from 'react';
import './Search.css';

class Search extends Component {
    
  doFetch = (ruc) => {
    fetch('https://set-ruc-finder-avolpe.c9users.io:8081/find?query=' + ruc)
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
  
  state = this.getValues('4787587');
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
              {this.state.result.map((i) => {
                return <div> <br/> <code> { i.name } </code> </div>;
              })}
          </div>
        </form>
      </div>
    );
  }
}

export default Search;