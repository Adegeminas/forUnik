import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class HouseAdder extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { isOpen, switchOpen } = this.props;

    const form = isOpen &&
     <div>
        Form
     </div>

    return (
      <div>
        <button className = "mainbutton" onClick = { switchOpen } > Добавить новый дом </button>
        { form }
      </div>
    )
  }
}

export default HouseAdder;
