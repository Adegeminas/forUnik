import React from 'react';
import ReactDOM from 'react-dom';
import Cataloger from '../Entries-React/Cataloger';
import RequestOneHouse from './RequestOneHouse';
import RequestCompany from './RequestCompany';
import RequestAllHouses from './RequestAllHouses';
import ReportViewer from './ReportViewer';

class TestApp extends React.Component {
  constructor(props) {
    super(props);

    const { socket } = props;
    const app = this;

    this.state = {
      currentResult: null,
      catalogue: null,
      RequestOneHouseOpen: false,
      RequestCompanyOpen: false,
      RequestAllHousesOpen: false
    };

    socket
      .on('connect', () => {
        socket.emit('getCatalogue');
      })
      .on('initConnection', (handshake) => {
        socket.handshake = handshake;
        if (!socket.handshake.user) {
          location.href = '/';
          return;
        }
      })
      .on('disconnect', () => {
        location.href = '/';
      })
      .on('logout', () => {
        // if (text) alert(text);
        location.href = '/';
      })
      .on('error', (reason) => {
        if (reason === 'handshake unauthorized') {
          // alert('вы вышли из сайта');
        } else {
          setTimeout(() => {
            socket.socket.connect();
          }, 500);
        }
      })
      .on('getCatalogueResult', (cat) => {
        app.setState({
          catalogue: cat
        });
      })
      .on('oneHouseResponse', (result) => {
        app.setState({
          currentResult: result,
          RequestOneHouseOpen: false
        });
      })
      .on('ukResponse', (result) => {
        app.setState({
          currentResult: result,
          RequestOneHouseOpen: false
        });
      })
      .on('allHousesResponse', (result) => {
        app.setState({
          currentResult: result,
          RequestOneHouseOpen: false
        });
      });
  }
  switchRequestOneHouseOpenState() {
    this.setState({
      currentResult: null,
      RequestOneHouseOpen: !this.state.RequestOneHouseOpen,
      RequestCompanyOpen: false,
      RequestAllHousesOpen: false
    });
  }
  switchRequestCompanyOpenState() {
    this.setState({
      currentResult: null,
      RequestCompanyOpen: !this.state.RequestCompanyOpen,
      RequestOneHouseOpen: false,
      RequestAllHousesOpen: false
    });
  }
  switchRequestAllHousesOpenState() {
    this.setState({
      currentResult: null,
      RequestAllHousesOpen: !this.state.RequestAllHousesOpen,
      RequestOneHouseOpen: false,
      RequestCompanyOpen: false
    });
  }

  render() {
    const { socket } = this.props;

    return (
      <div>
        <Cataloger
          catalogue = { this.state.catalogue }
        />
        <RequestOneHouse
          isOpen = { this.state.RequestOneHouseOpen }
          switchOpen = { this.switchRequestOneHouseOpenState.bind(this) }
          socket = { socket }
        />
        <RequestCompany
          isOpen = { this.state.RequestCompanyOpen }
          switchOpen = { this.switchRequestCompanyOpenState.bind(this) }
          socket = { socket }
        />
        <RequestAllHouses
          isOpen = { this.state.RequestAllHousesOpen }
          switchOpen = { this.switchRequestAllHousesOpenState.bind(this) }
          socket = { socket }
        />
        <ReportViewer
          report = { this.state.currentResult }
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
