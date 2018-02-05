import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class HouseViewerPeriods extends Component{

  constructor(props) {
    super(props);
  }

  render() {
    const { house } = this.props;
    const body = house &&
      <div>
        <legend> Периоды </legend>
      </div>

    return (
      <div>
        { body }
      </div>
    )
  }
}

export default HouseViewerPeriods
