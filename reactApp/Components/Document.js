const React = require('react');
import {
  Editor,
  EditorState,
  RichUtils,
  DefaultDraftBlockRenderMap,
  convertToRaw,
  convertFromRaw,
  SelectionState,
  Modifier
} from 'draft-js';
const { Link } = require('react-router-dom');
import * as colors from 'material-ui/styles/colors';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { CirclePicker } from 'react-color';
import axios from 'axios';
import { Map } from 'immutable';
import io from 'socket.io-client';

const myBlockTypes = DefaultDraftBlockRenderMap.merge(
  new Map({
    center: {
      wrapper: <div className="center-align" />
    },
    right: {
      wrapper: <div className="right-align" />
    },
    left: {
      wrapper: <div className="left-align" />
    },
    times: {
      wrapper: <div className="times-font" />
    },
    kavivanar: {
      wrapper: <div className="kavivanar-font" />
    },
    crimsontext: {
      wrapper: <div className="crimsontext-font" />
    },
    bungeeinline: {
      wrapper: <div className="bungeeinline-font" />
    },
    redFont: {
      wrapper: <div className="red-font" />
    },
    orangeFont: {
      wrapper: <div className="orange-font" />
    },
    yellowFont: {
      wrapper: <div className="yellow-font" />
    },
    greenFont: {
      wrapper: <div className="green-font" />
    },
    blueFont: {
      wrapper: <div className="blue-font" />
    },
    purpleFont: {
      wrapper: <div className="purple-font" />
    },
    blackFont: {
      wrapper: <div className="black-font" />
    },
    orangeBackground: {
      wrapper: <div className="orange-background" />
    },
    yellowBackground: {
      wrapper: <div className="yellow-background" />
    },
    greenBackground: {
      wrapper: <div className="green-background" />
    },
    purpleBackground: {
      wrapper: <div className="purple-background" />
    },
    whiteBackground: {
      wrapper: <div className="white-background" />
    },
    size12: {
      wrapper: <div className="size12" />
    },
    size24: {
      wrapper: <div className="size24" />
    },
    size36: {
      wrapper: <div className="size36" />
    },
    size48: {
      wrapper: <div className="size48" />
    },
    size60: {
      wrapper: <div className="size60" />
    },
    size72: {
      wrapper: <div className="size72" />
    },
    size84: {
      wrapper: <div className="size84" />
    },
    size96: {
      wrapper: <div className="size96" />
    },
    size108: {
      wrapper: <div className="size108" />
    }
  })
);

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
      console.log('here is the id in state ', this.state);
      this.state.socket.emit('join', this.state.id);
    });
    //axios get doc
    axios
      .get('http://localhost:3000/editDocument/' + this.state.id)
      .then(response => {
        console.log(
          'got a document payload on page load. response: ',
          response.data
        );
        this.setState({
          title: response.data.doc.title,
          editorState: response.data.doc.editorRaw
            ? EditorState.createWithContent(
                convertFromRaw(JSON.parse(response.data.editorRaw))
              )
            : this.state.editorState,
          currentSelection: response.data.doc.editorRaw
            ? EditorState.createWithContent(
                convertFromRaw(JSON.parse(response.data.editorRaw))
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

class Head extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}
      >
        <Link onClick={this.props.exitDoc} to="/userDocs">
          <p>hi</p>
        </Link>
        <div>
          <h3>{!this.props.loading && <b>{this.props.title}</b>}</h3>
          <p>ID: {this.props.docId}</p>
        </div>
        <a onClick={this.props.saveFn}>
          <p>hi</p>
        </a>
      </div>
    );
  }
}

class DocumentEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontSize: 12,
      location: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: 0,
        width: 0
      },
      display: false,
      color: 'white',
      editorState: EditorState.createEmpty(),
      inlineStyles: {},
      id: '',
      font: '',
      fontColor: '',
      backgroundColor: ''
    };
    this.onChange = editorState => this.setState({ editorState });
  }

  //lifecycle methods
  componentDidMount() {
    console.log('compdidmount here is this.props ', this.props);
    this.props.socket.on('aftercolor', obj => {
      let selectionState = SelectionState.createEmpty();
      selectionState = selectionState.merge({
        anchorOffset: obj.anchorOffset,
        focusOffset: obj.focusOffset,
        focusKey: obj.focusKey,
        anchorKey: obj.anchorKey,
        isBackward: obj.isBackward
      });
      const originalSelection = this.props.currentSelection;
      this.props.setStateFunction(
        EditorState.forceSelection(this.props.editorState, selectionState)
      );
      const coords = window
        .getSelection()
        .getRangeAt(0)
        .getBoundingClientRect();
      this.props.setStateFunction(
        EditorState.forceSelection(this.props.editorState, originalSelection)
      );
      if (obj.isCollapsed) {
        this.setState({
          location: {
            top: coords.top,
            bottom: coords.bottom,
            left: coords.left,
            right: coords.right,
            height: coords.height,
            width: coords.height / 16
          },
          color: obj.color,
          display: true
        });
      } else {
        this.setState({
          location: {
            top: coords.top,
            bottom: coords.bottom,
            left: coords.left,
            right: coords.right,
            height: coords.height,
            width: coords.width
          },
          color: obj.color,
          display: true
        });
      }
    });
  }

  //BUTTON JSX AND ASSOCIATED FUNCTIONS

  //toolbar button jsx
  formatButton({ icon, style, block }) {
    return (
      <RaisedButton
        backgroundColor={
          this.state.editorState.getCurrentInlineStyle().has(style)
            ? colors.orange800
            : colors.orange200
        }
        onMouseDown={e => this.toggleFormat(e, style, block)}
        icon={<FontIcon className="material-icons">{icon}</FontIcon>}
      />
    );
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
      console.log('block looks to be true');
      this.setState({
        editorState: RichUtils.toggleBlockType(this.state.editorState, style)
      });
    } else {
      this.setState({
        editorState: RichUtils.toggleInlineStyle(this.state.editorState, style)
      });
    }
  }

  //save button jsx
  saveButton() {
    return (
      <RaisedButton
        backgroundColor={colors.orange200}
        onMouseDown={() => this.saveDoc()}
        icon={<FontIcon className="material-icons">beenhere</FontIcon>}
      />
    );
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
      .post('http://localhost:3000/saveDoc/', {
        docid: this.state.id,
        title: this.state.title,
        contentState: rawJson
      })
      .then(resp => {
        console.log('~`* Successfully saved doc data *`~', resp);
      })
      .catch(error => {
        console.log('Error saving doc ', error);
      });
  }

  //navigate back button function
  navigateBack() {
    this.props.props.history.goBack();
  }

  //font select function
  _onFont(event, index, value) {
    const fontType = value;
    console.log(
      '_onFontFunction functioning ** ---> event ---> ',
      event,
      index,
      value
    );
    this.setState({
      font: value
    });

    switch (value) {
      case 'times new roman':
        this.toggleFormat(event, 'times', true);
        break;
      case 'kavivanar':
        this.toggleFormat(event, 'kavivanar', true);
        break;
      case 'crimsontext':
        this.toggleFormat(event, 'crimsontext', true);
        break;
      case 'bungeeinline':
        this.toggleFormat(event, 'bungeeinline', true);
        break;
      default:
        this.toggleFormat(event, (style: 'times-new-roman'), (block: true));
    }
  }

  //font size function
  _onFontSize(event, index, value) {
    const fontSize = value;
    console.log('_onFontSize functioning **', event, index, value);
    this.setState({
      fontSize: value
    });

    switch (value) {
      case 12:
        this.toggleFormat(event, 'size12', true);
        break;
      case 24:
        this.toggleFormat(event, 'size24', true);
        break;
      case 36:
        this.toggleFormat(event, 'size36', true);
        break;
      case 48:
        this.toggleFormat(event, 'size48', true);
        break;
      case 60:
        this.toggleFormat(event, 'size60', true);
        break;
      case 72:
        this.toggleFormat(event, 'size72', true);
        break;
      default:
        this.toggleFormat(event, 'size12', true);
    }
  }

  //font color function
  _onFontColor(event, index, value) {
    const fontColor = value;
    console.log('_onFontColor functioning **', event, index, value);
    this.setState({
      fontColor: value
    });

    switch (value) {
      case 'red':
        this.toggleFormat(event, 'redFont', true);
        break;
      case 'orange':
        this.toggleFormat(event, 'orangeFont', true);
        break;
      case 'yellow':
        this.toggleFormat(event, 'yellowFont', true);
        break;
      case 'green':
        this.toggleFormat(event, 'greenFont', true);
        break;
      case 'blue':
        this.toggleFormat(event, 'blueFont', true);
        break;
      case 'purple':
        this.toggleFormat(event, 'purpleFont', true);
        break;
      case 'black':
        this.toggleFormat(event, 'blackFont', true);
        break;
      default:
        this.toggleFormat(event, 'blackFont', true);
    }
  }

  //font background color function
  _onFontBackgroundColor(event, index, value) {
    const backgroundColor = value;
    console.log('_onFontBacgroundColor functioning **', event, index, value);
    this.setState({
      backgroundColor: value
    });

    switch (value) {
      case 'orange':
        this.toggleFormat(event, 'orangeBackground', true);
        break;
      case 'yellow':
        this.toggleFormat(event, 'yellowBackground', true);
        break;
      case 'green':
        this.toggleFormat(event, 'greenBackground', true);
        break;
      case 'purple':
        this.toggleFormat(event, 'purpleBackground', true);
        break;
      case 'white':
        this.toggleFormat(event, 'whiteBackground', true);
        break;
      default:
        this.toggleFormat(event, 'whiteBackground', true);
    }
  }

  render() {
    return (
      <div className="page-container">
        <div className="document-header">
          <button
            name="backbutton"
            className="back-to-documents-button"
            onClick={() => this.navigateBack()}
          >
            Back to Documents
          </button>
          <h6 className="document-id">
            Share this ID to Collab: {this.props.docId}
          </h6>
        </div>
        <AppBar
          title={this.props.title}
          iconElementLeft={
            <IconButton>
              <NavigationClose />
            </IconButton>
          }
          iconElementRight={<FlatButton label="Save" />}
        />
        <div className="toolbar">
          <div style={{ display: 'flex' }}>
            <SelectField
              autoWidth={true}
              floatingLabelText="font"
              floatingLabelStyle={{ margin: '5px' }}
              value={this.state.font}
              onChange={(event, index, value) =>
                this._onFont(event, index, value)
              }
              style={{
                width: '140px',
                margin: '5px',
                textAlign: 'left',
                flex: 1
              }}
            >
              <MenuItem
                value={'times new roman'}
                primaryText="Times New Roman"
              />
              <MenuItem value={'kavivanar'} primaryText="Kavivanar" />
              <MenuItem value={'crimsontext'} primaryText="Crimson Text" />
              <MenuItem value={'bungeeinline'} primaryText="Bungee Inline" />
            </SelectField>
            <br />
            <SelectField
              autoWidth={true}
              floatingLabelText="font size"
              value={this.state.fontSize}
              onChange={(event, index, value) =>
                this._onFontSize(event, index, value)
              }
              style={{
                width: '140px',
                margin: '5px',
                textAlign: 'left',
                flex: 1
              }}
            >
              <MenuItem value={12} primaryText="12" />
              <MenuItem value={24} primaryText="24" />
              <MenuItem value={36} primaryText="36" />
              <MenuItem value={48} primaryText="48" />
              <MenuItem value={60} primaryText="60" />
              <MenuItem value={72} primaryText="72" />
            </SelectField>
            <br />
            <SelectField
              autoWidth={true}
              floatingLabelText="font color"
              value={this.state.fontColor}
              onChange={(event, index, value) =>
                this._onFontColor(event, index, value)
              }
              style={{
                width: '140px',
                margin: '5px',
                textAlign: 'left',
                flex: 1
              }}
            >
              <MenuItem value={'red'} primaryText="red" />
              <MenuItem value={'orange'} primaryText="orange" />
              <MenuItem value={'yellow'} primaryText="yellow" />
              <MenuItem value={'green'} primaryText="green" />
              <MenuItem value={'blue'} primaryText="blue" />
              <MenuItem value={'purple'} primaryText="purple" />
              <MenuItem value={'black'} primaryText="black" />
            </SelectField>
            <br />
            <SelectField
              autoWidth={true}
              floatingLabelText="background color"
              value={this.state.backgroundColor}
              onChange={(event, index, value) =>
                this._onFontBackgroundColor(event, index, value)
              }
              style={{
                width: '140px',
                margin: '5px',
                textAlign: 'left',
                flex: 1
              }}
            >
              <MenuItem value={'orange'} primaryText="orange" />
              <MenuItem value={'yellow'} primaryText="yellow" />
              <MenuItem value={'green'} primaryText="green" />
              <MenuItem value={'purple'} primaryText="purple" />
              <MenuItem value={'white'} primaryText="white" />
            </SelectField>
            <br />
          </div>
          {this.formatButton({ icon: 'format_bold', style: 'BOLD' })}
          {this.formatButton({ icon: 'format_italic', style: 'ITALIC' })}
          {this.formatButton({ icon: 'format_underline', style: 'UNDERLINE' })}
          {this.formatButton({
            icon: 'format_list_numbered',
            style: 'ordered-list-item',
            block: true
          })}
          {this.formatButton({
            icon: 'format_align_left',
            style: 'left',
            block: true
          })}
          {this.formatButton({
            icon: 'format_align_center',
            style: 'center',
            block: true
          })}
          {this.formatButton({
            icon: 'format_align_right',
            style: 'right',
            block: true
          })}
          {this.saveButton()}
        </div>
        <br />
        <div className="editor-container">
          <Editor
            ref="editor"
            className="editor-page"
            blockRenderMap={myBlockTypes}
            customStyleMap={this.state.inlineStyles}
            onChange={this.onChange}
            editorState={this.state.editorState}
          />
        </div>
      </div>
    );
  }
}

module.exports = { DocumentContainer };
