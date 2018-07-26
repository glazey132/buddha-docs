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

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
    console.log('this state after change ', this.state);
  }

  render() {
    return (
      <div className="home-page">
        <div className="color-overlay" />
        <div style={{ color: 'white', zIndex: 4, textAlign: 'center' }}>
          <h2 className={'home-welcome'}>Buddha Docs</h2>
          <Row>
            <Input
              onChange={this.handleInputChange}
              value={this.state.username}
              name="username"
              type="text"
              label="username"
              s={12}
            />
            <Input
              onChange={this.handleInputChange}
              value={this.state.password}
              name="password"
              type="password"
              label="password"
              s={12}
            />
            <Button className="login-button">Login</Button>
          </Row>
        </div>
      </div>
    );
  }
}

export default Home;
