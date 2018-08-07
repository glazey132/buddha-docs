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

    if (this.props.icon === 'save') {
      return (
        <Button
          style={{ backgroundColor: `${color}` }}
          onClick={() => this.props.onSave()}
          waves="orange"
          icon={`${this.props.icon}`}
        />
      );
    } else if (this.props.icon === 'screen_share') {
      return (
        <Button
          style={{ backgroundColor: `${color}` }}
          onClick={() => this.props.onShare()}
          waves="orange"
          icon={`${this.props.icon}`}
        />
      );
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
