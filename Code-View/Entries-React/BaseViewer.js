import React, { Component } from 'react';
import CompanyViewer from './CompanyViewer';

class BaseViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    const { clickProceed } = this.props;

    const sortedHousesView = this.props.sortedHouses &&
      <div>
        {
          Object.keys(this.props.sortedHouses).map((key) => (
            <CompanyViewer
              companyName = { key }
              companyHouses = { this.props.sortedHouses[key] }
              clickProceed = { this.props.clickProceed }
            />
          ))
        }
      </div>

    return (
      <div>
        { sortedHousesView }
      </div>
    );
  }
}

export default BaseViewer;
