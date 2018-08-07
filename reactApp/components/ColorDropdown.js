import React from 'react';
import { GithubPicker } from 'react-color';

class ColorDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <GithubPicker />;
  }
}

export default ColorDropdown;
