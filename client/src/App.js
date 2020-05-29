import React from 'react';
import './App.css';
import Validator from './validator/Validator'
import {Search} from './search/Search'
import Download from './download/Download'
import License from './License'
import About from './About'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink,
    Redirect
} from "react-router-dom";
import {QueryParamProvider} from 'use-query-params';

export default function App() {

    return <Router>
        <QueryParamProvider ReactRouterRoute={Route}>
            <div id="layout">
                <a href="#menu" id="menuLink" className="menu-link">
                    <span></span>
                </a>
                <Menu />
                <div className="App main">
                    <div className="App-intro content">
                        <Switch>
                            <Route path="/search" component={Search} />
                            <Route path="/validate" component={Validator} />
                            <Route path="/download" component={Download} />
                            <Route path="/about" component={About} />
                            <Route path="/license" component={License} />
                            <Route path="/"><Redirect to="/search" /></Route>
                        </Switch>

                    </div>
                </div>
            </div>
        </QueryParamProvider>
    </Router>

}

function Menu() {
    return <div id="menu">
        <div className="pure-menu">
            <span className="pure-menu-heading"></span>

            <ul className="pure-menu-list">
                <li className="pure-menu-item"><NavLink activeClassName="pure-menu-selected" className="pure-menu-link" to="/search">Buscador</NavLink></li>
                <li className="pure-menu-item"><NavLink activeClassName="pure-menu-selected" className="pure-menu-link" to="/validate">Validador</NavLink></li>
                <li className="pure-menu-item"><NavLink activeClassName="pure-menu-selected" className="pure-menu-link" to="/download">Descargar</NavLink></li>
            </ul>

            <div className="bottom-menu">
                <ul className="pure-menu-list">
                    <li className="pure-menu-item menu-item-divided"><NavLink activeClassName="pure-menu-selected" className="pure-menu-link" to="about">Acerca de</NavLink></li>
                    <li className="pure-menu-item"><NavLink activeClassName="pure-menu-selected" className="pure-menu-link" to="license">Licencia</NavLink></li>
                </ul>
            </div>
        </div>
    </div>
}
