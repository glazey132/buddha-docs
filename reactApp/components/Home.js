import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Row, Input, Icon } from 'react-materialize';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  render() {
    return (
      <div className="home-page">
        <div>
          <h2>Welcome home</h2>
          <Row>
            <Input name="username" type="text" label="username" />
            <Input name="password" type="password" label="password" />
            <Button>Login</Button>
          </Row>
        </div>
      </div>
    );
  }
}

export default Home;
