const React = require('react');
import {
  Editor,
  EditorState,
  RichUtils,
  DefaultDraftBlockRenderMap,
  convertToRaw,
  convertFromRaw,
  SelectionState
} from 'draft-js';
import axios from 'axios';
import _ from 'underscore';
import { Map } from 'immutable';
import { Row, Col, Button, CardPanel } from 'react-materialize';

//import components
import StyleToolbar from './StyleToolbar';
import Cursor from './Cursor';

//assets
import customStyleMap from '../assets/customStyleMap';
import myBlockTypes from '../assets/blockTypes';

const axiosConfig = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
};

class DocumentEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      title: '',
      collaborators: [],
      revisions: [],
      editorState: EditorState.createEmpty(),
      currentSelection: SelectionState.createEmpty(),
      collabObj: {},
      color: '',
      isLoading: true,
      revisionsOpen: false
    };

    this.focus = () => this.domEditor.focus();
    this.setDomEditorRef = ref => (this.domEditor = ref);

    this.props.socket.on('changeEditorState', data => {
      const newUserObj = Object.assign({}, this.state.collabObj);
      newUserObj[data.socketId] = data.userObj[data.socketId];
      console.log(
        'new User obj on changeEditor state in client side ',
        newUserObj
      );
      this.setState({ collabObj: newUserObj });
      let newEditorState = this.createEditorStateFromStringifiedContentState(
        data.contentState
      );
      this.setState({
        editorState: EditorState.forceSelection(
          newEditorState,
          this.state.editorState.getSelection()
        )
      });
    });
  }

  //lifecycle methods
  async componentDidMount() {
    this.domEditor.focus();
    //axios call to backend to retrieve document
    try {
      let doc = await axios.get(
        localStorage.getItem('url') + '/findDoc/' + this.state.id,
        axiosConfig
      );
      console.log('the doc returned ===> ', doc);
      let editorState = this.createEditorStateFromStringifiedContentState(
        doc.data.doc.contents
      );
      let title = doc.data.doc.title;
      this.setState({
        collaborators: doc.data.doc.collaborators,
        editorState: editorState,
        revisions: doc.data.doc.revision_history,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        isLoading: false
      });

      this.props.socket.emit('documentJoin', {
        docId: this.state.id
      });
    } catch (e) {
      console.log(e);
    }
  }

  async componentWillUnmount() {
    this.props.socket.emit('documentLeave', {
      docId: this.state.id,
      color: this.state.color
    });
  }

  onChange(editorState) {
    this.setState({
      editorState
    });

    let data;
    const windowSelection = window.getSelection();
    if (windowSelection.rangeCount > 0) {
      const range = windowSelection.getRangeAt(0);
      const clientRects = range.getClientRects();
      if (clientRects.length > 0) {
        console.log('client reacts ', clientRects);
        const rects = clientRects[0];
        console.log('rects ', rects);
        const loc = { top: rects.top, left: rects.left, right: rects.right };
        data = { loc };
      }
    }

    let stringifiedContentState = this.createStringifiedContentStateFromEditorState(
      editorState
    );

    this.props.socket.emit('changeEditorState', {
      room: this.state.id,
      contentState: stringifiedContentState,
      socketId: this.props.socket.id,
      data
    });
  }

  createEditorStateFromStringifiedContentState(stringifiedContentState) {
    let contentState = JSON.parse(stringifiedContentState);
    contentState = convertFromRaw(contentState);
    let editorState = EditorState.createWithContent(contentState);
    return editorState;
  }

  createStringifiedContentStateFromEditorState(editorState) {
    let contentState = editorState.getCurrentContent();
    contentState = convertToRaw(contentState);
    let stringifiedContentState = JSON.stringify(contentState);
    return stringifiedContentState;
  }

  toggleBlockType(event, blockType) {
    if (event) {
      event.preventDefault();
    }

    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  }

  toggleInlineStyle(event, inlineStyle) {
    if (event) {
      event.preventDefault();
    }

    console.log('attempting to apply inline style of ==> ', inlineStyle);

    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
    );
  }

  myBlockStyleFn(contentBlock) {
    const type = contentBlock.getType();
    switch (type) {
      case 'left':
        return 'align-left';
      case 'center':
        return 'align-center';
      case 'right':
        return 'align-right';
      default:
        return null;
    }
  }

  onTabKey(event) {
    console.log('there was a tab event! ', event);
    event.preventDefault();
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(event, this.state.editorState, maxDepth));
  }

  exitDoc() {
    this.state.socket.emit('exit');
  }

  //toolbar button toggle function
  toggleFormat(e, style, block) {
    console.log(
      'in toggle format after font change and here is event style and block ',
      e,
      style,
      block
    );
    e.preventDefault();
    if (block) {
      this.setState({
        editorState: RichUtils.toggleBlockType(this.state.editorState, style)
      });
    } else {
      this.setState({
        editorState: RichUtils.toggleInlineStyle(this.state.editorState, style)
      });
    }
  }

  //save document to db function
  saveDoc() {
    const rawJson = JSON.stringify(
      convertToRaw(this.state.editorState.getCurrentContent())
    );
    axios
      .post(
        localStorage.getItem('url') + '/saveDoc/',
        {
          docid: this.state.id,
          title: this.state.title,
          contents: rawJson
        },
        axiosConfig
      )
      .then(resp => {
        console.log('~`* Successfully saved doc data *`~', resp);
        this.setState({
          revisions: resp.data.doc.revision_history
        });
      })
      .catch(error => {
        console.log('Caught error saving doc ', error);
      });
  }

  //navigate back button function
  navigateBack() {
    this.props.props.history.goBack();
  }

  render() {
    return (
      <div className="document-editor-page">
        <div className="document-header">
          <button
            name="backbutton"
            className="back-to-documents-button"
            onClick={() => this.navigateBack()}
          >
            Back to Documents
          </button>
        </div>
        <div>
          {_.map(this.state.collabObj, (val, key) => {
            console.log('val', val);
            if (val) {
              if (val.hasOwnProperty('top')) {
                if (val.left !== val.right) {
                  return (
                    <div
                      key={val.color}
                      style={{
                        position: 'absolute',
                        opacity: 0.2,
                        zIndex: 0,
                        backgroundColor: val.color,
                        width: Math.abs(val.left - val.right) + 'px',
                        height: '15px',
                        top: val.top - 70,
                        left: val.left + 130
                      }}
                    />
                  );
                }
                return (
                  <div
                    key={val.color}
                    style={{
                      position: 'absolute',
                      backgroundColor: val.color,
                      width: '2px',
                      height: '15px',
                      top: val.top,
                      left: val.left
                    }}
                  />
                );
              } else {
                return <div key={key} />;
              }
            }
            return <div key={key} />;
          })}
          {this.state.revisionsOpen ? (
            <CardPanel className="teal lighten-4 black-text">
              <ul style={{ display: 'flex' }}>
                {this.state.revisions.map((revision, index) => {
                  const dateInstance = new Date(revision.timestamp);
                  const dateStr = dateInstance.toString().slice(0, 24);
                  return (
                    <li key={index} style={{ flex: 1, margin: '1em' }}>
                      <a
                        style={{ color: 'darkslategray' }}
                        href="#"
                        onClick={() => {
                          let editorState = this.createEditorStateFromStringifiedContentState(
                            revision.contents
                          );
                          this.setState({
                            editorState: editorState
                          });
                        }}
                      >
                        {dateStr}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </CardPanel>
          ) : null}
        </div>
        <div>
          <StyleToolbar
            editorState={this.state.editorState}
            id={this.state.id}
            onToggleBlockType={(event, style) =>
              this.toggleBlockType(event, style)
            }
            onToggleInlineStyle={(event, style) =>
              this.toggleInlineStyle(event, style)
            }
            onSave={() => this.saveDoc()}
          />
        </div>
        <div className="editor-container">
          <div className="editor-page">
            <Editor
              editorState={this.state.editorState}
              customStyleMap={customStyleMap}
              blockStyleFn={this.myBlockStyleFn}
              ref={this.setDomEditorRef}
              onChange={state => this.onChange(state)}
              spellCheck={true}
              onTab={e => this.onTabKey(e)}
            />
          </div>
        </div>
        <Row>
          <Button
            onClick={() => {
              this.setState(prevState => ({
                revisionsOpen: !prevState.revisionsOpen
              }));
              console.log('this.state.revisions ', this.state.revisions);
            }}
          >
            Revisions
          </Button>
        </Row>
      </div>
    );
  }
}

export default DocumentEditor;
