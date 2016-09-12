import React, { Component } from 'react';
import './App.css';
import { Link } from 'react-router'

class App extends Component {
  
  render() {
    return (
      <div className="App">
        <h1 className="App-header">
          App
          <ul>
            <li><Link to="/search">Buscador</Link></li>
            <li><Link to="/validate">Validador</Link></li>
            <li><Link to="/download">Descargar</Link></li>
          </ul>
        </h1>

        <div className="App-intro">
          {/*
            next we replace `<Child>` with `this.props.children`
            the router will figure out the children for us
          */}
          {this.props.children}
        </div>
      </div>
    )
  }
  
}

export default App;
