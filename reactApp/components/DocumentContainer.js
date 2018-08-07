import React from 'react';
import {
  Editor,
  EditorState,
  convertToRaw,
  convertFromRaw,
  SelectionState
} from 'draft-js';
import Link from 'react-router-dom';
import DocumentEditor from './DocumentEditor';
import StyleToolbar from './StyleToolbar';
import ColorDropdown from './ColorDropdown';
import axios from 'axios';
import io from 'socket.io-client';

const axiosConfig = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
};

class DocumentContainer extends React.Component {
  constructor(props) {
    super(props);
    console.log('doc containers props ', props);
    const id = this.props.match.params.docid;
    this.state = {
      id: id,
      title: '',
      isLoading: true,
      editorState: EditorState.createEmpty(),
      currentSelection: SelectionState.createEmpty(),
      socket: io.connect(
        'http://localhost:3000',
        { transports: ['websocket'] }
      )
    };

    //socket stuff
    this.state.socket.on('connect', () => {
      console.log('connected to web sockets!');
      this.state.socket.emit('join', this.state.id);
    });
    //axios get doc
    axios
      .get(
        localStorage.getItem('url') + '/findDoc/' + this.state.id,
        axiosConfig
      )
      .then(response => {
        console.log(
          'got a document payload on page load. response: ',
          response.data
        );
        this.setState({
          title: response.data.doc.title,
          editorState: response.data.doc.contents
            ? EditorState.createWithContent(
                convertFromRaw(JSON.parse(response.data.doc.contents))
              )
            : this.state.editorState,
          currentSelection: response.data.doc.editorRaw
            ? EditorState.createWithContent(
                convertFromRaw(JSON.parse(response.data.doc.contents))
              ).getSelection()
            : this.state.currentSelection,
          isLoading: false
        });
        console.log(
          'the state after pageload payload was applied: ',
          this.state
        );
      })
      .catch(function(error) {
        console.log(
          'There was an error while trying to retrieve the document on page load ',
          error
        );
      });

    this.onChange = editorState => {
      this.state.socket.emit(
        'typing',
        JSON.stringify(convertToRaw(editorState.getCurrentContent()))
      );
      this.state.socket.emit('selection', {
        anchorOffset: editorState.getSelection().getAnchorOffset(),
        focusOffset: editorState.getSelection().getFocusOffset(),
        anchorKey: editorState.getSelection().getAnchorKey(),
        focusKey: editorState.getSelection().getFocusKey(),
        isCollapsed: editorState.getSelection().isCollapsed(),
        isBackward: editorState.getSelection().getIsBackward()
      });
      this.setState({
        editorState,
        currentSelection: editorState.getSelection()
      });
    };
  }

  setStateFunction(toSet) {
    this.setState({
      editorState: toSet
    });
  }

  //lifecycle
  componentWillMount() {
    this.state.socket.on('changestate', newState => {
      this.setState({
        editorState: EditorState.forceSelection(
          EditorState.createWithContent(convertFromRaw(JSON.parse(newState))),
          this.state.currentSelection
        )
      });
    });
  }

  saveDocument() {
    axios
      .post('http://localhost:3000/saveDoc/', {
        docId: this.state.id,
        title: this.state.title,
        editorState: JSON.stringify(
          convertToRaw(this.state.editorState.getCurrentContent())
        )
      })
      .then(response => {
        console.log('got response from save: ', response);
        if (response.data.success) {
          console.log('saved');
        } else {
          console.log('error saving');
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  exitDoc() {
    this.state.socket.emit('exit');
  }

  render() {
    if (this.state.isLoading) {
      return <h3>Document Loading...</h3>;
    }

    return (
      <div>
        <StyleToolbar />
        {/* <ColorDropdown /> */}
        <DocumentEditor
          props={this.props}
          loading={this.state.loading}
          title={this.state.title}
          docId={this.state.id}
          currentSelection={this.state.currentSelection}
          editorState={this.state.editorState}
          onChangeFn={this.onChange}
          socket={this.state.socket}
          setStateFn={this.setStateFunction.bind(this)}
          exitDoc={this.exitDoc.bind(this)}
          saveFn={this.saveDocument.bind(this)}
        />
      </div>
    );
  }
}

export default DocumentContainer;
