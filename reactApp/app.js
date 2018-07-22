import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import ElectronApp from './components/ElectronApp';

ReactDOM.render(
  <MemoryRouter>
    <MuiThemeProvider>
      <ElectronApp />
    </MuiThemeProvider>
  </MemoryRouter>,
  document.getElementById('root')
);
