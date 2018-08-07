import React from 'react';
import DocumentEditor from './DocumentEditor';
import io from 'socket.io-client';
import '../../css/DocumentPage.css';
class DocumentPage extends React.Component {
  constructor(props) {
    super(props);
    console.log('doc containers props ', props);
    const id = this.props.match.params.docid;
    this.state = {
      id: id,
      socket: io.connect(
        localStorage.getItem('url'),
        { transports: ['websocket'] }
      )
    };

    //socket stuff
    this.state.socket.on('connect', () => {
      console.log('connected to web sockets!');
      this.state.socket.emit('join', this.state.id);
    });
  }

  render() {
    return (
      <div className="doc-page-container">
        <DocumentEditor
          id={this.state.id}
          props={this.props}
          socket={this.state.socket}
        />
      </div>
    );
  }
}

export default DocumentPage;
