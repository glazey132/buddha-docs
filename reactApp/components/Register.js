import React from 'react';
import { Link, Route } from 'react-router-dom';
import axios from 'axios';


class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    };
  }



  register() {
    axios.post("http://localhost:3000/register", {
      'username': this.state.username,
      'password': this.state.password
    })
    .then((resp) => {
      if (resp.data.success) {
        this.props.history.push('/login')
      } else {
        console.log(resp.data.error);
      }
    })
    .catch((error) => console.log(error))
  }

  render() {
    return (
      <div className="page-container">
        <h3>Register</h3>
        <input
          type="text"
          name="username"
          placeholder="username"
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
        <button onClick={() => this.register()}>Register</button>
        <br />
        <Link to='/login'>
          <div style={{padding: '10px'}}>Already a member? Login.</div>
        </Link>
      </div>
    )
  }
}

export default Register;
