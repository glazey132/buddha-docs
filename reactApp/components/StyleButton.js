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
    let color;
    if (this.props.active === true) {
      color = '#FF9800';
    } else {
      color = '#26a69a';
    }

    if (this.props.icon === 'save') {
      return (
        <Button
          style={{ backgroundColor: '#26a69a' }}
          onClick={() => this.props.onSave()}
          waves="light"
          icon={`${this.props.icon}`}
        />
      );
    } else if (this.props.icon === 'screen_share') {
      return (
        <Button
          style={{ backgroundColor: '#26a69a' }}
          onClick={() => this.props.onShare()}
          waves="light"
          icon={`${this.props.icon}`}
        />
      );
    } else {
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
}

export default StyleButton;
