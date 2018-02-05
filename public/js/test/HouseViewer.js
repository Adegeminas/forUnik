import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import HouseViewerHeader from './HouseViewerHeader';
import HouseViewerEditor from './HouseViewerEditor';
import HouseViewerPeriods from './HouseViewerPeriods';

class HouseViewer extends Component{

  constructor(props) {
    super(props);

    this.state = {
      houseEditorisOpen: false,
    }
  }

  render() {
    const { house } = this.props;

    return (
      <div>
        <HouseViewerHeader
          house = { house }
        />
        <HouseViewerEditor
          house = { house }
        />
        <HouseViewerPeriods
          house = { house }
        />
      </div>
    )
  }
}

export default HouseViewer
