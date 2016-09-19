import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import Validator from './validator/Validator'
import Search from './search/Search'
import Download from './download/Download'
import License from './License'
import About from './About'


ReactDOM.render(
  (
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Search} />
      <Route path="validate" component={Validator} />
      <Route path="download" component={Download} />
      <Route path="about" component={About} />
      <Route path="license" component={License} />
    </Route>
  </Router>
  ),
  document.getElementById('root')
);
