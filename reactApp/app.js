var React = require('react');
var ReactDOM = require('react-dom');
import { MemoryRouter } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import App from './Components/App';

ReactDOM.render(
  <MemoryRouter>
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
  </MemoryRouter>,
  document.getElementById('root')
);
