var React = require('react');
import { RichUtils, DefaultDraftBlockRenderMap } from 'draft-js';
import { Map } from 'immutable';
import '../../css/Toolbar.css';

const myBlockTypes = DefaultDraftBlockRenderMap.merge(
  new Map({
    center: {
      wrapper: <div className="center-align" />
    },
    right: {
      wrapper: <div className="right-align" />
    }
  })
);

class StyleToolbar extends React.Component {
  constructor(props) {
    super(props);
  }

  //format button helper
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

  render() {
    return (
      <div className="toolbar">
        {this.formatButton({ icon: 'format_bold', style: 'BOLD' })}
        {this.formatButton({ icon: 'format_italic', style: 'ITALIC' })}
        {this.formatButton({ icon: 'format_underline', style: 'UNDERLINE' })}
        {this.colorPicker()}
        {this.formatButton({
          icon: 'format_list_numbered',
          style: 'ordered-list-item',
          block: true
        })}
        {this.formatButton({
          icon: 'format_align_left',
          style: 'unstyled',
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
        {this.formatButton({
          icon: 'format_align_right',
          style: 'right',
          block: true
        })}
        {this.increaseFontSize(false)}
        {this.increaseFontSize(true)}
      </div>
    );
  }
}

export default StyleToolbar;
