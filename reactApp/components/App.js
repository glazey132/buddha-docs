import React from 'react';
import { Route } from 'react-router-dom';
import Home from './Home';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    localStorage.setItem('url', 'https://buddha-docs-server.herokuapp.com/');
    return (
      <div>
        <div>
          <Route exact path="/" component={Home} />
        </div>
      </div>
    );
  }
}

export default App;
