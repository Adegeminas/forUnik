import React, {Component} from 'react';
import HouseViewerHeader from './HouseViewerHeader';
import HouseViewerEditor from './HouseViewerEditor';
import HouseViewerPeriods from './HouseViewerPeriods';

class HouseViewer extends Component {
  constructor(props) {
    super(props);

    this.updateProceed = props.updateProceed;
    this.deleteProceed = props.deleteProceed;

    this.state = {
      houseEditorisOpen: false
    };
  }

  render() {
    const { house, socket } = this.props;

    return (
      <div>
        <HouseViewerHeader
          house = { house }
        />
        <HouseViewerEditor
          house = { house }
          updateProceed = { (request, houseForEdit) => socket.emit('editHouse', request, houseForEdit) }
          deleteProceed = { (address) => socket.emit('deleteHouse', address) }
        />
        <HouseViewerPeriods
          house = { house }
          socket = { socket }
        />
      </div>
    );
  }
}

export default HouseViewer;
