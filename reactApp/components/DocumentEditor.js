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
import { Map } from 'immutable';
import { Row, Col } from 'react-materialize';

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
      editorState: EditorState.createEmpty(),
      currentSelection: SelectionState.createEmpty(),
      otherUsers: {},
      color: '',
      isLoading: true
    };

    this.extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(
      new Map({
        right: {
          element: 'div'
        },
        center: {
          element: 'div'
        },
        left: {
          element: 'div'
        }
      })
    );

    this.props.socket.on('updateEditorState', data => {
      //get new editor state
      let contentState = JSON.parse(data.contentState);
      contentState = convertFromRaw(contentState);
      let editorState = EditorState.push(this.state.editorState, contentState);

      //selection states
      let currentSelectionState = editorState.getSelection();
      let otherSelectionState = currentSelectionState.merge(
        data.selectionState
      );

      //force other selectionState
      editorState = EditorState.forceSelection(
        editorState,
        otherSelectionState
      );
      this.setState({ editorState });

      let startKey = otherSelectionState.getStartKey();
      let endKey = otherSelectionState.getEndKey();
      let startOffset = otherSelectionState.getStartOffset();
      let endOffset = otherSelectionState.getEndOffset();

      const windowSelectionState = window.getSelection();
      console.log('the windowSelection ', windowSelectionState);
      console.log(' \n startkey \n', startKey);
      console.log(' \n endkey \n', endKey);
      console.log(' \n startOffset \n', startOffset);
      console.log(' \n endOffset \n', endOffset);
      if (windowSelectionState.rangeCount > 0) {
        const range = windowSelectionState.getRangeAt(0);
        console.log('\n the range \n ', range);
        const clientRects = range.getClientRects();
        const rects = clientRects[0];
        let cursorLocation = {
          top: rects.top,
          left: rects.left,
          height: rects.height
        };
        let highlights = [];
        for (let i = 0; i < clientRects.length; i++) {
          let highlightLocation = {
            top: clientRects[i].top,
            bottom: clientRects[i].bottom,
            left: clientRects[i].left,
            right: clientRects[i].right,
            height: clientRects[i].height,
            width: clientRects[i].width
          };
          highlights.push(highlightLocation);
        }
        console.log('this.state.otherUsers ', this.state.otherUsers);
        console.log(
          'stringified other users ',
          JSON.stringify(this.state.otherUsers)
        );
        console.log(
          'stringified then parsed other users ',
          JSON.parse(JSON.stringify(this.state.otherUsers))
        );
        let tempOtherUsers = JSON.parse(JSON.stringify(this.state.otherUsers));
        tempOtherUsers[data.color] = {
          username: data.username,
          color: data.color,
          cursorLocation,
          highlights
        };
        this.setState({ otherUsers: tempOtherUsers });
      }
      editorState = EditorState.forceSelection(
        editorState,
        currentSelectionState
      );

      this.setState({ editorState });
    });

    this.props.socket.on('updateName', data => {
      this.setState({ name: data.name });
    });

    this.props.socket.on('userLeave', data => {
      let tempOtherUsers = JSON.parse(JSON.stringify(this.state.otherUsers));
      delete tempOtherUsers[data.color];
      this.setState({ otherUsers: tempOtherUsers });
    });
  }

  //lifecycle methods
  async componentDidMount() {
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

    let stringifiedContentState = this.createStringifiedContentStateFromEditorState(
      editorState
    );

    this.props.socket.emit('changeEditorState', {
      docId: this.state.id,
      contentState: stringifiedContentState,
      selectionState: editorState.getSelection(),
      color: this.state.color,
      username: 'admin'
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
    console.log('CLICKED SAVE DOC ');
    console.log('this.state after save click ', this.state);
    console.log('the doc content in raw form ---> ', rawJson);
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
            {Object.keys(this.state.otherUsers).map(user => (
              <Cursor key={user} user={this.state.otherUsers[user]} />
            ))}
            <Editor
              editorState={this.state.editorState}
              customStyleMap={customStyleMap}
              blockStyleFn={this.myBlockStyleFn}
              blockRenderMap={this.extendedBlockRenderMap}
              ref="editor"
              onChange={state => this.onChange(state)}
              spellCheck={true}
              onTab={e => this.onTabKey(e)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default DocumentEditor;
