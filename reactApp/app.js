import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';

import Router from './components/Router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

require('../css/Draft.css');

ReactDOM.render(
  <BrowserRouter>
    <MuiThemeProvider>
      <Route path={'/'} component={Router} />
    </MuiThemeProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
