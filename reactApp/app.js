import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Router from './components/Router';

require('../css/Draft.css');

ReactDOM.render(
  <BrowserRouter basename="/">
    <MuiThemeProvider>
      <Route path={'/'} component={Router} />
    </MuiThemeProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
