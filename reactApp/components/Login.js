import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Row, Input, Icon } from 'react-materialize';

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
    console.log(
      'in user here is localstorage url ',
      localStorage.getItem('url')
    );
    axios
      .post(localStorage.getItem('url') + '/login', this.state)
      .then(resp => {
        console.log('the resp.data ', resp.data);
        if (resp.data.user) {
          console.log('The resp to logging in: ', resp.data);
          this.props.history.push('/userDocs/' + resp.data.user._id);
        } else {
          console.log('\n ERR was not able to get response \n');
        }
      })
      .catch(err => console.error('There was an error logging in: ', err));
  }

  render() {
    return (
      <div className="login-page">
        <div className="color-overlay" />
        <div style={{ color: 'white', zIndex: 4, textAlign: 'center' }}>
          <h2 className={'login-title'}>Buddha Docs</h2>
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
            <Button onClick={this.loginUser} className="login-button">
              Login
              <Icon left>offline_bolt</Icon>
            </Button>
          </Row>
        </div>
      </div>
    );
  }
}

export default Login;
