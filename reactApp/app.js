import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';

import Router from './components/Router';

require('../css/Draft.css');

ReactDOM.render(
  <BrowserRouter>
    <Route path={'/'} component={Router} />
  </BrowserRouter>,
  document.getElementById('root')
);
