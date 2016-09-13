import React, { Component } from 'react';
import './App.css';
import { Link, IndexLink } from 'react-router'

class App extends Component {
  
  initPure = function (window, document) {

    console.log('iniciando pure');
    var layout   = document.getElementById('layout'),
        menu     = document.getElementById('menu'),
        menuLink = document.getElementById('menuLink');

    function toggleClass(element, className) {
        var classes = element.className.split(/\s+/),
            length = classes.length,
            i = 0;

        for(; i < length; i++) {
          if (classes[i] === className) {
            classes.splice(i, 1);
            break;
          }
        }
        // The className is not found
        if (length === classes.length) {
            classes.push(className);
        }

        element.className = classes.join(' ');
    }

    menuLink.onclick = function (e) {
        var active = 'active';

        e.preventDefault();
        toggleClass(layout, active);
        toggleClass(menu, active);
        toggleClass(menuLink, active);
    };

  }

  componentDidMount() {
    this.initPure(window, document);
  }
  
  render() {
    return (
      <div id="layout">
        <a href="#menu" id="menuLink" className="menu-link">
            <span></span>
        </a>
        <div id="menu">
          <div className="pure-menu">
              <span className="pure-menu-heading">Menu</span>
          
              <ul className="pure-menu-list">
                  <li className="pure-menu-item"><IndexLink activeClassName="pure-menu-selected" className="pure-menu-link" to="/">Buscador</IndexLink></li>
                  <li className="pure-menu-item"><Link activeClassName="pure-menu-selected" className="pure-menu-link" to="validate">Validador</Link></li>
                  <li className="pure-menu-item"><Link activeClassName="pure-menu-selected" className="pure-menu-link" to="download">Descargar</Link></li>
              </ul>
          </div>
        </div>
        <div className="App main">
          <div className="App-intro content">
            {/*
              next we replace `<Child>` with `this.props.children`
              the router will figure out the children for us
            */}
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
  
}

export default App;
