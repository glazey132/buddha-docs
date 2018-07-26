import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './Login';
import Home from './Home';

class Router extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    //buddha-docs-server.herokuapp.com
    localStorage.setItem('url', 'http://localhost:3000');
    return (
      <div>
        <div>
          <Switch>
            <Route path="/" component={Login} />
            <Route path="/userDocs" component={Home} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default Router;
