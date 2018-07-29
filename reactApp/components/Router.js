import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Register from './Register';
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
        <Route path={'/register'} exact component={Register} />
        <Route path={'/login'} exact component={Login} />
        <Route path={'/home'} exact component={Home} />
      </div>
    );
  }
}

export default Router;
