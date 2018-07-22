var React = require('react');
var ReactDOM = require('react-dom');
import { MemoryRouter } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

require('./css/main.css');
class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Route path="/editDocument/:docid" component={DocumentContainer} />
            <Route path="/userDocs/:userid" component={DocumentPortal} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>,
  document.getElementById('root')
);
