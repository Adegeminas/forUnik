import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import HouseViewerPeriodsPeriod from './HouseViewerPeriodsPeriod';
import HouseViewerPeriodsAdder from './HouseViewerPeriodsAdder';

class HouseViewerPeriods extends Component{

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  render() {
    let { house, socket } = this.props;

    if (house) {
      house.data = house.data.sort((a,b) => {
        return (
          (a.month.split('-')[1] > b.month.split('-')[1]) ||
          (a.month.split('-')[1] === b.month.split('-')[1] && a.month.split('-')[0] > b.month.split('-')[0])
        );
      });
    }

    const body = house && (house.data.length > 0) &&
      <div>
        <legend> Отчетные периоды </legend>
        <table>
          <tr>
            <td>
              Период
            </td>
            <td>
              Продано энергосбережение
            </td>
            <td>
              Прибор работал
            </td>
            <td>
              Управляющая компания
            </td>
            <td>
              Объём по данным РЦ без вычета ГВС
            </td>
            <td>
              Объём по данным РЦ с вычетом ГВС
            </td>
            <td>
              Объём по первичным данным ОДПУ без вычета ГВС
            </td>
            <td>
              Объём при неработающем приборе учёта
            </td>
            <td>
              Тариф
            </td>
            <td>
              Действия
            </td>
          </tr>

          { house.data.map( period => <HouseViewerPeriodsPeriod
            period = { period }
            socket = { socket }
            house = { house }
          />) }

        </table>
      </div>;

    const bodyWithoutPeriods = house && (house.data.length === 0) &&
      <div>
        <legend> Отчетные периоды </legend>
        Отчетные периоды не заполнены
      </div>;

    return (
      <div>
        { body }
        { bodyWithoutPeriods }
        <HouseViewerPeriodsAdder
          house = { house }
          socket = { socket }
          isOpen = { this.state.isOpen }
          switchOpen = { this.switchAdderOpenState.bind(this) }
        />
      </div>
    );
  }

  switchAdderOpenState() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }
}

export default HouseViewerPeriods;
