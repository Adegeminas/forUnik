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
    const variants = true &&
      <datalist id='basicVariants'>
        <option>Предыдущий год</option>
        <option>Предыдущие 2 года</option>
        <option>Предыдущие 3 года</option>
        <option>2015</option>
        <option>2015,2016</option>
        <option>2016</option>
        <option>2016,2017</option>
        <option>2017</option>
        <option>2015,2016,2017</option>
        <option>2018</option>
        <option>2017,2018</option>
        <option>2016,2017,2018</option>
        <option>2015,2016,2017,2018</option>
      </datalist>;

    return (
      <div>
        { streets }
        { companies }
        { variants }
      </div>
    );
  }
}

export default Cataloger;
