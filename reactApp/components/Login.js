import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Row, Input, Icon } from 'react-materialize';

/*
** necessary to make req.user available on server side
** when axios sends a request. Must set these options on all requests.
*/
const axiosConfig = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
};

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.loginUser = this.loginUser.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  loginUser() {
    axios
      .post(localStorage.getItem('url') + '/login', this.state, axiosConfig)
      .then(resp => {
        if (!resp.data) {
          console.error('\n Unable to get a response from server on login \n');
        }
        console.log(
          '\n ~~ the response.data to logging in ===> \n ',
          resp.data
        );
        this.props.history.push('/home/' + resp.data.id);
      })
      .catch(err => console.error('There was an error logging in: ', err));
  }

  render() {
    return (
      <div className="login-page">
        <div className="color-overlay" />
        <div className="auth-center-section">
          <h2 className="auth-title">Buddha Docs</h2>
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
            <Button onClick={this.loginUser} className="auth-button">
              Login
              <Icon left>offline_bolt</Icon>
            </Button>
          </Row>
          <Row>
            <Link to="/register">
              <p>Not signed up yet? Register Here</p>
            </Link>
          </Row>
        </div>
      </div>
    );
  }
}

export default Login;
