import React from 'react';
import ReactDOM from 'react-dom';
import Cataloger from '../Entries-React/Cataloger'
import RequestOneHouse from './RequestOneHouse'
import RequestCompany from './RequestCompany'
import RequestAllHouses from './RequestAllHouses'
import ReportViewer from './ReportViewer'

let socket = io.connect();

class TestApp extends React.Component {
  constructor(props) {
    super(props);

    let { socket } = props;
    let app = this;

    this.state = {
      currentResult: null,
      catalogue: null,
      RequestOneHouseOpen: false,
      RequestCompanyOpen: false,
      RequestAllHousesOpen: false,
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
        })
      })
      .on('oneHouseResponse', function(result) {
        app.setState({
          currentResult: result,
          RequestOneHouseOpen: false,
        })
      })
      .on('ukResponse', function(result) {
        app.setState({
          currentResult: result,
          RequestOneHouseOpen: false,
        })
      })
      .on('allHousesResponse', function(result) {
        app.setState({
          currentResult: result,
          RequestOneHouseOpen: false,
        })
      })
  }

  render() {

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
    )
  }

  switchRequestOneHouseOpenState() {
    this.setState({
      currentResult: null,
      RequestOneHouseOpen: !this.state.RequestOneHouseOpen,
      RequestCompanyOpen: false,
      RequestAllHousesOpen: false,
    })
  }
  switchRequestCompanyOpenState() {
    this.setState({
      currentResult: null,
      RequestCompanyOpen: !this.state.RequestCompanyOpen,
      RequestOneHouseOpen: false,
      RequestAllHousesOpen: false,
    })
  }
  switchRequestAllHousesOpenState() {
    this.setState({
      currentResult: null,
      RequestAllHousesOpen: !this.state.RequestAllHousesOpen,
      RequestOneHouseOpen: false,
      RequestCompanyOpen: false,
    })
  }
}

ReactDOM.render(
  <TestApp socket = { socket } />,
  document.getElementById('root')
);
