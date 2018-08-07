//packages
const React = require('react');
import { Button } from 'react-materialize';
import '../../css/StyleButton.css';

class StyleButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false
    };
  }

  render() {
    let color;
    if (this.props.active) {
      color = 'orange';
    } else {
      color = '#FF9800';
    }
    return (
      <Button
        style={{ backgroundColor: `${color}` }}
        onClick={e => this.props.onToggle(e, this.props.style)}
        waves="orange"
        icon={`${this.props.icon}`}
      />
    );
  }
}

export default StyleButton;
