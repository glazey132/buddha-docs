//packages
const React = require('react');
import { Button } from 'react-materialize';

class StyleButton extends React.Component {
  super(props);
  this.state = {
    active: false
  }

  render() {
    return (
      <Button onClick={(e) => this.props.onToggle(e, this.props.style)} waves='light'>button<Icon left>cloud</Icon></Button>
    );
  }
}

export default StyleButton;
