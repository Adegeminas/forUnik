import React from 'react';
import ReactDOM from 'react-dom';
import HouseAdder from './HouseAdder';
import HouseFinder from './HouseFinder';
import Cataloger from './Cataloger';
import BaseViewer from './BaseViewer';
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
      currentHouse: null,
      houses: false,
      sortedHouses: false,
    };

    socket
      .on('connect', function () {
        socket.emit('getCatalogue');
        socket.emit('getAllHouses');
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
      .on('getAllHousesResult', function (_houses) {
        let sortedHouses = {
          noUk: [],
        };

        _houses.forEach((house) => {

          if (house.data.length === 0) {
            sortedHouses.noUk.push(house);
            return;
          }

          let uk = house.data.sort((a, b) => {
            return (
              (a.month.split('-')[1] > b.month.split('-')[1]) ||
              (a.month.split('-')[1] === b.month.split('-')[1] && a.month.split('-')[0] > b.month.split('-')[0])
            );
          })[house.data.length - 1].company;

          if (sortedHouses[uk]) {
            sortedHouses[uk].push(house);
          } else {
            sortedHouses[uk] = [ house ];
          }

        });

        app.setState({
          houses: _houses,
          sortedHouses: sortedHouses
        });
      })
      .on('createHouseResult', function (/* result */) {
        socket.emit('getCatalogue');
        socket.emit('getAllHouses');
      })
      .on('readHouseResult', function (result) {
        socket.emit('getCatalogue');
        socket.emit('getAllHouses');
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
        socket.emit('getAllHouses');
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

  clickProceed(house) {
    return () => {
      this.setState({
        currentHouse: house
      });
    };
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
        <BaseViewer
          clickProceed = { this.clickProceed.bind(this) }
          houses = { this.state.houses }
          sortedHouses = { this.state.sortedHouses }
          clickProceed = { this.clickProceed.bind(this) }
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

const _socket = window.io.connect();

ReactDOM.render(
  <TestApp socket = { _socket } />,
  document.getElementById('root')
);

// <HouseFinder
//   isOpen = { this.state.finderOpen }
//   switchOpen = { this.switchFinderOpenState.bind(this) }
//   proceed = { (house) => socket.emit('readHouse', house) }
// />
