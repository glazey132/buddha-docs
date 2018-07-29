import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Row, Input, Icon } from 'react-materialize';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.registerUser = this.registerUser.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  registerUser() {
    axios
      .post(localStorage.getItem('url') + '/register', this.state)
      .then(resp => {
        if (!resp.data) {
          console.error(
            '\n Unable to get a response from server on register \n'
          );
        }
        console.log(
          '\n ~~ the response.data to registering ===> \n ',
          resp.data
        );
        this.props.history.push('/home');
      })
      .catch(err => console.error('There was an error logging in: ', err));
  }

  render() {
    return (
      <div className="register-page">
        <div className="color-overlay" />
        <div style={{ color: 'white', zIndex: 4, textAlign: 'center' }}>
          <h2 className={'auth-title'}>Buddha Docs</h2>
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
            <Button onClick={this.registerUser} className="auth-button">
              Register
              <Icon left>offline_bolt</Icon>
            </Button>
          </Row>
          <Row>
            <Link to="/login">
              <p>Already signed up? Login Here</p>
            </Link>
          </Row>
        </div>
      </div>
    );
  }
}

export default Register;
