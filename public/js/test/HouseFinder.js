import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class HouseFinder extends Component{

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
        <button className = "mainbutton" onClick = { switchOpen } > Найти дом </button>
        { form }
      </div>
    )
  }

  openForm = () => {
    // this.setState({
    //   isOpen: !this.state.isOpen
    // });
  }
}

export default HouseFinder;
