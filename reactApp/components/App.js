import React from 'react';
import { Route } from 'react-router-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="home-page">
          <h1>App home</h1>
        </div>
      </div>
    );
  }
}

export default App;
