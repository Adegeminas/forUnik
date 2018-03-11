import React, { Component } from 'react';

class CompanyViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  render() {
    const companyViewInner = this.state.isOpen &&
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
          this.props.companyHouses.map((house) =>
            (
              <tr
                onClick = { this.props.clickProceed(house) }
                className = 'clickable'
              >
                <td style = {{
                  width: 300,
                  textAlign: 'left'
                }}>
                    { house.address.split(',')[2] + ' ' + house.address.split(',')[3] }
                </td>
                <td>
                    { house.data.length > 0 ? house.data.sort((a, b) => {
                      return (
                        (a.month.split('-')[1] > b.month.split('-')[1]) ||
                        (a.month.split('-')[1] === b.month.split('-')[1] && a.month.split('-')[0] > b.month.split('-')[0])
                      );
                    })[house.data.length - 1].month : '---' }
                </td>
              </tr>
            )
          )
        }
      </table>
    const companyView = this.props.companyName && this.props.companyHouses &&
      <div
        className = 'clickable'
        style = {{
          margin: 3
        }}
        onClick = { () => {
          this.setState({
            isOpen: !this.state.isOpen
          })
        }}
      >
        Управляющая компания: { this.props.companyName === 'noUk' ? 'отсутствует' : this.props.companyName }
        { companyViewInner }
      </div>


    return (
      <div>
        { companyView }
      </div>
    );
  }
}

export default CompanyViewer;
