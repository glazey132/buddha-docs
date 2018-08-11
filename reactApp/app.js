import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from 'react-router-dom';

import Router from './components/Router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

ReactDOM.render(
  <HashRouter>
    <MuiThemeProvider>
      <Route path={'/'} component={Router} />
    </MuiThemeProvider>
  </HashRouter>,
  document.getElementById('root')
);
