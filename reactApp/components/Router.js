import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './Login';

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
          </Switch>
        </div>
      </div>
    );
  }
}

export default Router;
