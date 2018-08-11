import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Home from './Home';
import DocumentPage from './DocumentPage';

class Router extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    //buddha-docs-server.herokuapp.com
    localStorage.setItem('url', 'https://buddha-docs-server.herokuapp.com');
    return (
      <div>
        <Route path={'/'} exact component={Login} />
        <Route path={'/register'} exact component={Register} />
        <Route path={'/login'} exact component={Login} />
        <Route path={'/home/:userid'} exact component={Home} />
        <Route path={'/document/:docid'} exact component={DocumentPage} />
      </div>
    );
  }
}

export default Router;
