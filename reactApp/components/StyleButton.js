//packages
const React = require('react');
import { Button } from 'react-materialize';

class StyleButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false
    };
  }

  render() {
    return (
      <Button
        onClick={e => this.props.onToggle(e, this.props.style)}
        waves="light"
        icon={`${this.props.icon}`}
      />
    );
  }
}

export default StyleButton;
