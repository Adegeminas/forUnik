import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class HouseViewerPeriodsPeriod extends Component{

  constructor(props) {
    super(props);
  }

  render() {
    const { period, socket, address } = this.props;

    return (
      <tr>
        <td>
          { period.month }
        </td>
        <td>
          { period.isBasic ? 'Нет' : 'Да'}
        </td>
        <td>
          { period.shouldCount ? 'Да' : 'Нет'}
        </td>
        <td>
          { period.company }
        </td>
        <td>
          { period.O ? period.O : '---' }
        </td>
        <td>
          { period.P ? period.P : '---'}
        </td>
        <td>
          { period.Q ? period.Q : '---'}
        </td>
        <td>
          { period.R ? period.R : '---'}
        </td>
        <td>
          { period.tarif }
        </td>
        <td>
          <button> Редактировать </button>
          <button onClick = { () => {
            socket.emit('deletePeriod', period.month + '/' + address);
          } }> Удалить </button>
        </td>
      </tr>
    )
  }
}

export default HouseViewerPeriodsPeriod
