import React from 'react';
import { GithubPicker } from 'react-color';
import { Button } from 'react-materialize';
import Popover from 'material-ui/Popover';

class ColorDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colorPickerOpen: false,
      colorPickerAnchor: null
    };
  }

  openColorPicker(e) {
    this.setState({
      colorPickerOpen: true,
      colorPickerAnchor: e.target
    });
  }

  closeColorPicker() {
    this.setState({
      colorPickerOpen: false,
      colorPickerAnchor: null
    });
  }

  render() {
    return (
      <div>
        <Button
          icon="format_color_text"
          onClick={e => this.openColorPicker(e)}
        />
        <Popover
          anchorEl={this.state.colorPickerAnchor}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'left', vertial: 'top' }}
          open={this.state.colorPickerOpen}
          onRequestClose={() => this.closeColorPicker()}
        >
          <GithubPicker
            onChangeComplete={color => this.props.onToggle(null, color.hex)}
          />
        </Popover>
      </div>
    );
  }
}

export default ColorDropdown;
