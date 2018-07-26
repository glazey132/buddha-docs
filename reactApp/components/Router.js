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
        <Route path={'/'} exact component={Login} />
        <Route path={'/home/:userid'} exact component={Home} />
      </div>
    );
  }
}

export default Router;
