import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button } from 'react-materialize';
import '../../css/Home.css';

const axiosConfig = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
};

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      docs: [],
      username: '',
      userid: '',
      newDocumentName: '',
      newDocumentPassword: '',
      addDocId: '',
      loading: true
    };
  }

  newDoc() {
    console.log('this.state before new doc ', this.state);
    axios(localStorage.getItem('url') + '/newDoc', {
      method: 'post',
      data: {
        title: this.state.newDocumentName,
        password: this.state.newDocumentPassword
      },
      withCredentials: true
    }).then(resp => {
      console.log('the response to new doc ', resp);
      this.setState({
        docs: [...this.state.docs, resp.data.document],
        newDocumentName: '',
        newDocumentPassword: ''
      });
    });
  }

  addDoc() {
    if (this.state.addDocId === '') return;
    axios(localStorage.getItem('url') + '/document/add', {
      method: 'post',
      data: {
        docId: this.state.addDocId
      },
      withCredentials: true
    })
      .then(resp => {
        this.setState({
          docs: [...this.state.docs, resp.data.document],
          addDocId: ''
        });
      })
      .catch(err => {
        console.log('There was an error while adding document ', err);
      });
  }

  renderDocumentList() {
    return this.state.docs.map((doc, i) => (
      <div key={i}>
        <Link to={`/document/${doc._id}`}>{doc.title}</Link>
      </div>
    ));
  }

  logout() {
    axios
      .post('http://localhost:3000/logout')
      .then(resp => {
        this.props.history.replace('/');
      })
      .catch(error => console.log(error));
  }

  componentDidMount() {
    axios
      .get(
        localStorage.getItem('url') +
          '/getAllDocs/' +
          this.props.match.params.userid,
        axiosConfig
      )
      .then(resp => {
        console.log('awaited response in comp did mount of home ', resp);
        this.setState({
          docs: resp.data.docs,
          username: resp.data.username,
          userid: resp.data.userid,
          loading: false
        });
      })
      .catch(function(error) {
        console.log('Error loading documents in home component: ', error);
      });
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          <h2>Loading...</h2>
        </div>
      );
    } else {
      return (
        <div className="page-container">
          <div className="document-header">
            <button className="logout-button" onClick={() => this.logout()}>
              Logout
            </button>
            <h3 className="title">Welcome, {this.state.username}.</h3>
          </div>
          <div className="create-or-share-document-div">
            <input
              type="text"
              placeholder="New document name"
              name="newDocumentName"
              value={this.state.newDocumentName || ''}
              onChange={event => {
                this.setState({ newDocumentName: event.target.value });
              }}
              className="small-input"
            />
            <input
              className="small-input"
              type="password"
              placeholder="new document password"
              name="newDocumentPassword"
              value={this.state.newDocumentPassword || ''}
              onChange={event => {
                this.setState({ newDocumentPassword: event.target.value });
              }}
            />
            <Button
              className="home-styled-button"
              onClick={() => this.newDoc()}
            >
              New Doc
            </Button>
          </div>
          <div className="document-container">
            <div className="document-list">
              <p>My Documents:</p>
              <ul>{this.renderDocumentList()}</ul>
            </div>
          </div>
          <br />
          <div className="create-or-share-document-div">
            <input
              className="small-input"
              type="text"
              placeholder="paste a docID to collab on a doc"
              ref="sharedDoc"
              value={this.state.addDocId}
              onChange={e => this.setState({ addDocId: e.target.value })}
            />
            <Button
              className="home-styled-button"
              onClick={() => this.addDoc()}
            >
              Add Shared Doc
            </Button>
          </div>
        </div>
      );
    }
  }
}

export default Home;
