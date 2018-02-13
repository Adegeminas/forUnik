import React, {Component} from 'react';

function periodToHTML(period) {
  return (
    <tr>
      <td>
        { period.month }
      </td>
      <td>
        { period.shouldCount ? 'Да' : 'Нет' }
      </td>
      <td>
        { period.company }
      </td>
      <td>
        { period.O ? period.O : '---' }
      </td>
      <td>
        { period.P ? period.P : '---' }
      </td>
      <td>
        { period.Q ? period.Q : '---' }
      </td>
      <td>
        { period.R ? period.R : '---' }
      </td>
    </tr>
  );
}

function oneHouseRequestResultToHTML(result, error) {
  if (!result) {
    return (
      <div>
        { error }
      </div>
    );
  }

  return (
    <div
      style = {{
        border: '3px dotted black',
        padding: '10px'
      }}
    >
      <legend> {result.purposeMonth.month} Контрольные значения: {result.purposeMonth.basicMonths} </legend>
      <legend>Использованы отчетные периоды:</legend>
      <table>
        <tr>
          <td>
            Период
          </td>
          <td>
            Прибор работал
          </td>
          <td>
            УК
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
        </tr>
        { result.basicMonths.map(month => periodToHTML(month)) }
      </table>

      <legend>Результаты энергосбережения:</legend>
      <h4>Контрольное значение потребления: { result.basicAmount.toFixed(2) } Гкал</h4>
      <h4>Отчетное значение потребления: { result.purposeAmount.toFixed(2) } Гкал</h4>

      <h4>
        Экономия составила:
        { result.gigsEconomy.toFixed(2)} Гкал /
        { result.rublesEconomy.toFixed(2) } рублей /
        { result.procentEconomy.toFixed(2) } процентов
      </h4>

      <h4>Экономия на квадратный метр: { result.economyPerMeter.toFixed(2) } рублей</h4>

      <h4>
        Итого в счет оплаты энергосбережения:
        { result.profit.toFixed(2) } рублей или
        { result.profitPerMeter.toFixed(2) } рублей/кв.м
      </h4>

      <legend>Показатели при отсутствии экономии (справочно):</legend>
      <h4> Экономия: { result.realGigsEconomy.toFixed(2) } Гкал </h4>
    </div>
  );
}

class ReportViewerHouse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  changeState() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    const body = this.state.isOpen &&
      this.props.report.map(period => oneHouseRequestResultToHTML(period));

    return (
      <div>
        <h3 onClick = { this.changeState.bind(this) } > { this.props.report[0].house.address } </h3>
        { body }
      </div>
    );
  }
}

export default ReportViewerHouse;
