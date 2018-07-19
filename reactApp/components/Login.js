import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    };
  }

  login() {
    axios.post("http://localhost:3000/login", {
      username: this.state.username,
      password: this.state.password,
    })
    .then((resp) => {
      if (resp.data.success) {
        console.log("success", resp.data);
        this.props.history.push('/userDocs/' + resp.data.user._id)
      } else {
        console.log("err", resp);
      }
    })
    .catch((error) => {
      console.log("Error", error);
      return null;
    });
  }

  render() {
    return (
      <div className="page-container">
        <h3>Login</h3>
        <input
          type="text"
          placeholder="username"
          name="username"
          value={this.state.username || ''}
          onChange={(event) => { this.setState({ username: event.target.value })}}
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="password"
          value={this.state.password || ''}
          onChange={(event) => { this.setState({ password: event.target.value })}}
        />
        <br />
        <button onClick={() => this.login()}>Login</button>
        <br />
        <Link to='/register'>
          <div style={{padding: '10px'}}>Don't have an account? Sign up here.</div>
        </Link>
      </div>
    )
  }
}

export default Login;
