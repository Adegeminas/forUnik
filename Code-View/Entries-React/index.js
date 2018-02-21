import React from 'react';
import ReactDOM from 'react-dom';
import HouseAdder from './HouseAdder';
import HouseFinder from './HouseFinder';
import Cataloger from './Cataloger';
import HouseViewer from './HouseViewer';

class TestApp extends React.Component {
  constructor(props) {
    super(props);

    const { socket } = props;
    const app = this;

    this.state = {
      adderOpen: false,
      finderOpen: false,
      catalogue: null,
      currentHouse: null
    };

    socket
      .on('connect', function () {
        socket.emit('getCatalogue');
      })
      .on('initConnection', function (handshake) {
        socket.handshake = handshake;
        if (!socket.handshake.user) {
          location.href = '/';
          return;
        }
      })
      .on('disconnect', function () {
        location.href = '/';
      })
      .on('logout', function () {
        location.href = '/';
      })
      .on('error', function (reason) {
        if (reason === 'handshake unauthorized') {
          // alert('вы вышли из сайта');
        } else {
          setTimeout(function () {
            socket.socket.connect();
          }, 500);
        }
      })
      .on('getCatalogueResult', function (_catalogue) {
        app.setState({
          catalogue: _catalogue
        });
      })
      .on('createHouseResult', function (/* result */) {
        socket.emit('getCatalogue');
      })
      .on('readHouseResult', function (result) {
        app.setState({
          currentHouse: result
        });
      })
      .on('createPeriodResult', function ([ result ]) {
        if (result) {
          app.setState({
            currentHouse: result
          });
        }
        socket.emit('getCatalogue');
      });
  }

  switchAdderOpenState() {
    this.setState({
      adderOpen: !this.state.adderOpen,
      finderOpen: false,
      currentHouse: null
    });
  }
  switchFinderOpenState() {
    this.setState({
      adderOpen: false,
      finderOpen: !this.state.finderOpen,
      currentHouse: null
    });
  }

  render() {
    const { socket } = this.props;

    return (
      <div>
        <Cataloger
          catalogue = { this.state.catalogue }
        />
        <HouseAdder
          isOpen = { this.state.adderOpen }
          switchOpen = { this.switchAdderOpenState.bind(this) }
          proceed = { (house) => socket.emit('createHouse', house) }
        />
        <HouseFinder
          isOpen = { this.state.finderOpen }
          switchOpen = { this.switchFinderOpenState.bind(this) }
          proceed = { (house) => socket.emit('readHouse', house) }
        />
        <HouseViewer
          house = { this.state.currentHouse }
          updateProceed = { (request, house) => socket.emit('updateHouse', request, house) }
          deleteProceed = { (address) => socket.emit('deleteHouse', address) }
          socket = { socket }
        />
      </div>
    );
  }
}

const _socket = io.connect();

ReactDOM.render(
  <TestApp socket = { _socket } />,
  document.getElementById('root')
);
