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
        <table>
        <tr>
          <td>
            Адрес дома
          </td>
          <td>
            Последний заполненный месяц
          </td>
        </tr>
        {
          this.props.houses.map((house) =>
            (
              <tr onClick = { clickProceed(house) }>
                <td>
                    { house.address.split(',')[2] + ' ' + house.address.split(',')[3] }
                </td>
                <td>
                    { house.data.length > 0 ? house.data[0].month : '---' }
                </td>
              </tr>
            )
          )
        }
        </table>
      </div>;

    return (
      <div>
        { housesView }
      </div>
    );
  }
}

export default BaseViewer;
