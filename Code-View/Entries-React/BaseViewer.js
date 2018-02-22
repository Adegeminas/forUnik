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
          this.props.houses.map((house) =>
            (
              <b onClick = { clickProceed(house) } >
                {' <' + house.address.split(',')[2] + ' ' + house.address.split(',')[3] + '> '}
              </b>
            )
          )
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
