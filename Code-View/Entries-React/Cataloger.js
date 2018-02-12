import React, { Component } from 'react';

class Cataloger extends Component {
  render() {
    const { catalogue } = this.props;
    const streets = catalogue && catalogue.streets &&
      <datalist id='streetList1'>
        { catalogue.streets.map((street) => <option value = { street } > { street } </option>) }
      </datalist>;
    const companies = catalogue && catalogue.companies &&
      <datalist id='companiesList1'>
        { catalogue.companies.map((company) => <option value = { company } > { company } </option>) }
      </datalist>;

    return (
      <div>
        { streets }
        { companies }
      </div>
    );
  }
}

export default Cataloger;
