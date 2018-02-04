import React from 'react';
import ReactDOM from 'react-dom';
import HouseAdder from './HouseAdder'
import HouseFinder from './HouseFinder'

class TestApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      adderOpen: false,
      finderOpen: false,
    };
  }


  render() {
    return (
      <div>
        <HouseAdder
          isOpen = {this.state.adderOpen}
          switchOpen = {this.switchAdderOpenState.bind(this)}
        />
        <HouseFinder
          isOpen = {this.state.finderOpen}
          switchOpen = {this.switchFinderOpenState.bind(this)}
        />
      </div>
    )
  }

  switchAdderOpenState() {
    this.setState({
      adderOpen: !this.state.adderOpen,
      finderOpen: false,
    })
  }
  switchFinderOpenState() {
    this.setState({
      adderOpen: false,
      finderOpen: !this.state.finderOpen,
    })
  }
}

ReactDOM.render(
  <TestApp />,
  document.getElementById('root')
);
