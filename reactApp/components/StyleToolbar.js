//packages
import React from 'react';
import { RichUtils, DefaultDraftBlockRenderMap } from 'draft-js';
import { Map } from 'immutable';
import { Row, Col } from 'react-materialize';

//style assets
import INLINE_STYLES from '../assets/inlineStyles';
import BLOCK_TYPES from '../assets/blockTypes';
import '../../css/Toolbar.css';

//imported components
import StyleButton from './StyleButton';

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
      <Row>
        {INLINE_STYLES.map(type => (
          <StyleButton
            key={type.style}
            style={type.style}
            icon={type.icon}
            onToggle={(e, style) => this.props.onToggleInlineStyle(e, style)}
          />
        ))}
        {BLOCK_TYPES.map(type => (
          <StyleButton
            key={type.style}
            style={type.style}
            icon={type.icon}
            onToggle={(e, style) => this.props.onToggleBlockType(e, style)}
          />
        ))}
      </Row>
    );
  }
}

export default StyleToolbar;
