//packages
import React from 'react';
import { Icon, Button } from 'react-materialize';
import Popover from 'material-ui/Popover';
const FONT_SIZES = [
  { label: 'Small', style: 'SMALL' },
  { label: 'Normal', style: 'NORMAL' },
  { label: 'Large', style: 'LARGE' }
];

class FontSizeDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSize: 'Normal',
      sizePickerOpen: false,
      sizePickerAnchor: null
    };
  }

  openSizePicker(e) {
    this.setState({
      sizePickerOpen: true,
      sizePickerAnchor: e.target
    });
  }

  closeSizePicker() {
    this.setState({
      sizePickerOpen: false,
      sizePickerAnchor: null
    });
  }

  handleClick(e, style, label) {
    e.preventDefault();
    console.log('handle click in font pick ', style, label);
    this.props.onToggle(null, style);
    this.setState({
      selectedSize: label
    });
  }

  render() {
    return (
      <div>
        <Button
          icon="format_color_text"
          onClick={e => this.openSizePicker(e)}
        />
        <Popover
          anchorEl={this.state.sizePickerAnchor}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'left', vertial: 'top' }}
          open={this.state.sizePickerOpen}
          onRequestClose={() => this.closeSizePicker()}
          style={{ width: '5em' }}
        >
          {FONT_SIZES.map(style => {
            if (style.label === 'Small') {
              return (
                <div
                  key={style.label}
                  onMouseDown={e =>
                    this.handleClick(e, style.style, style.label)
                  }
                  style={{ fontSize: '10px' }}
                >
                  <span style={{ fontSize: '10px' }}>{style.label}</span>
                </div>
              );
            } else if (style.label === 'Large') {
              return (
                <div
                  key={style.label}
                  onMouseDown={e =>
                    this.handleClick(e, style.style, style.label)
                  }
                  style={{ fontSize: '20px' }}
                >
                  <span style={{ fontSize: '20px' }}>{style.label}</span>
                </div>
              );
            }
            return (
              <div
                key={style.label}
                onMouseDown={e => this.handleClick(e, style.style, style.label)}
                style={{ fontSize: '15px' }}
              >
                <span style={{ fontSize: '15px' }}>{style.label}</span>
              </div>
            );
          })}
        </Popover>
      </div>
    );
  }
}

export default FontSizeDropdown;
