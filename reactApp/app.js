import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import App from './components/App';

require('../css/Draft.css');

ReactDOM.render(
  <MemoryRouter>
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
  </MemoryRouter>,
  document.getElementById('root')
);
