import React from 'react';
import { GithubPicker } from 'react-color';
import { Dropdown, Button, NavItem } from 'react-materialize';

class ColorDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pickerOpen: false
    };
  }

  openColorPicker() {}

  closeColorPicker() {}

  render() {
    return (
      // <Dropdown trigger={<Button>Drop me!</Button>}>
      //   <GithubPicker />
      // </Dropdown>
    );
  }
}

export default ColorDropdown;
