import React from 'react';
import ReactDOM from 'react-dom';
import HouseAdder from './HouseAdder';
import HouseFinder from './HouseFinder';
import Cataloger from './Cataloger';
import HouseViewer from './HouseViewer';

let socket = io.connect();

class TestApp extends React.Component {
  constructor(props) {
    super(props);

    let { socket } = props;
    let app = this;

    this.state = {
      adderOpen: false,
      finderOpen: false,
      catalogue: null,
      currentHouse: null,
    };

    socket
      .on('connect', function() {
        socket.emit('getCatalogue');
      })
      .on('initConnection', function(handshake) {
        socket.handshake = handshake;
        if (!socket.handshake.user) {
          location.href = "/";
          return;
        }
      })
      .on('disconnect', function() {
        location.href = "/";
       })
      .on('logout', function(text) {
        if (text) alert(text);
        location.href = "/";
      })
      .on('error', function(reason) {
        if (reason == "handshake unauthorized") {
          alert("вы вышли из сайта");
        } else {
          setTimeout(function() {
            socket.socket.connect();
          }, 500);
        }
      })
      .on('getCatalogueResult', function(catalogue) {
        app.setState({
          catalogue: catalogue,
        });
      })
      .on('addNewHouseResult', function(result) {
        if (result) {
          socket.emit('getCatalogue');
        } else {
          alert('Неудача');
        }
      })
      .on('findOneHouseResult', function(result) {
        app.setState({
          currentHouse: result,
        });
      })
      .on('addNewPeriodResult', function([result, text]) {
        if (result) {
          app.setState({
            currentHouse: result,
          });
        } else {
          alert('Неудача', text);
        }
      })
      .on('addNewPeriodResultWithContinue', function([result, text, options]) {
        if (result) {
          app.setState({
            currentHouse: result,
          });
        } else {
          alert('Неудача', text);
        }
      });
  }

  render() {
    return (
      <div>
        <Cataloger
          catalogue = { this.state.catalogue }
        />
        <HouseAdder
          isOpen = { this.state.adderOpen }
          switchOpen = { this.switchAdderOpenState.bind(this) }
          proceed = { (house) => socket.emit('addNewHouse', house) }
        />
        <HouseFinder
          isOpen = { this.state.finderOpen }
          switchOpen = { this.switchFinderOpenState.bind(this) }
          proceed = { (house) => socket.emit('findOneHouse', house) }
        />
        <HouseViewer
          house = { this.state.currentHouse }
          updateProceed = { (request, house) => socket.emit('editHouse', request, house) }
          deleteProceed = { (address) => socket.emit('deleteHouse', address) }
          socket = { socket }
        />
      </div>
    );
  }

  switchAdderOpenState() {
    this.setState({
      adderOpen: !this.state.adderOpen,
      finderOpen: false,
      currentHouse: null,
    });
  }
  switchFinderOpenState() {
    this.setState({
      adderOpen: false,
      finderOpen: !this.state.finderOpen,
      currentHouse: null,
    });
  }
}

ReactDOM.render(
  <TestApp socket = { socket } />,
  document.getElementById('root')
);
