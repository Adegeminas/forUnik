import React, { Component } from 'react';

class BaseViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      someprop: false
    };
  }

  render() {
    const { clickProceed } = this.props;

    const housesView = this.props.houses &&
      <div>
        {
          this.props.houses.map((house) => <p onClick = { clickProceed(house) } > { house.address } </p>)
        }
      </div>;

    return (
      <div>
        { housesView }
      </div>
    );
  }
}

export default BaseViewer;
