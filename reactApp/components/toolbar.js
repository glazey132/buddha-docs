var React = require('react');
import {
  RichUtils,
  DefaultDraftBlockRenderMap
} from 'draft-js';
import * as colors from 'material-ui/styles/colors';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import { CirclePicker } from 'react-color';
import { Map } from 'immutable';

const myBlockTypes = DefaultDraftBlockRenderMap.merge(new Map({
  center: {
    wrapper: <div className='center-align'/>
  },
  right: {
    wrapper: <div className="right-align"/>
  }
}));

class TextToolBox extends React.Component {
  constructor(props) {
    super(props);
  }
  
  //format button helper
  formatButton({icon, style, block}){
    return (
      <RaisedButton
        backgroundColor={
          this.state.editorState.getCurrentInlineStyle().has(style) ?
          colors.orange800 :
          colors.orange200
        }
        onMouseDown={(e) => this.toggleFormat(e, style, block)}
        icon={<FontIcon className="material-icons">{icon}</FontIcon>}
      />
    );
  }

  //Color picker helper functions
  openColorPicker(e) {
    this.setState({
      colorPickerOpen: true,
      colorPickerButton: e.target
    })
  }

  closeColorPicker(e) {
    this.setState({
      colorPickerOpen: false
    });
  }

  colorPicker() {
    return (
      <div style={{display: 'inline-block'}}>
        <RaisedButton
          backgroundColor={colors.orange200}
          icon={<FontIcon className="material-icons">format_color_text</FontIcon>}
          onClick={this.openColorPicker.bind(this)}
        />
         <Popover
            open={this.state.colorPickerOpen}
            anchorEl={this.state.colorPickerButton}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.closeColorPicker.bind(this)}
          >
          <CirclePicker onChangeComplete={this.formatColor.bind(this)}/>
        </Popover>
      </div>
    );
  }

  render() {
    return (
      <div className="toolbar">
        {this.formatButton({icon: 'format_bold', style: 'BOLD'})}
        {this.formatButton({icon: 'format_italic', style: 'ITALIC'})}
        {this.formatButton({icon: 'format_underline', style: 'UNDERLINE'})}
        {this.colorPicker()}
        {this.formatButton({icon: 'format_list_numbered', style: 'ordered-list-item', block: true})}
        {this.formatButton({icon: 'format_align_left', style: 'unstyled', block: true})}
        {this.formatButton({icon: 'format_align_center', style: 'center', block: true})}
        {this.formatButton({icon: 'format_align_right', style: 'right', block: true})}
        {this.formatButton({icon: 'format_align_right', style: 'right', block: true})}
        {this.increaseFontSize(false)}
        {this.increaseFontSize(true)}
      </div>
    );
  }
}




export default TextToolBox;
