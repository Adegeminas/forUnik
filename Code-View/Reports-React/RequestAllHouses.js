import React, {Component} from 'react';

class RequestAllHouses extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      startYear: '2015',
      startMonth: '01',
      endYear: '2018',
      endMonth: '12',
      kotel: 'false',
      method: 'РЦ',
      useR: 'false'
    };

    this.state = this.initialState;
  }

  requestProceed() {
    const request = {
      startPeriod: this.state.startMonth + '-' + this.state.startYear,
      endPeriod: this.state.endMonth + '-' + this.state.endYear,
      kotel: this.state.kotel,
      method: this.state.method,
      useR: this.state.useR,
      header: 'Все дома'
    };

    this.props.socket.emit('allHousesRequest', request);
    this.props.switchOpen();
  }

  render() {
    const { isOpen, switchOpen } = this.props;
    const form = isOpen &&
      <div>
        <h3> Отчетный период </h3>
        <h4> Начало: </h4>
        <table>
          <tr>
            <td>
              Год
            </td>
            <td>
              <select
                value = { this.state.startYear }
                onChange = { (event) => this.setState({
                  startYear: event.target.value
                })}
              >
                <option>2015</option>
                <option>2016</option>
                <option>2017</option>
                <option>2018</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              Месяц
            </td>
            <td>
              <select
                value = { this.state.startMonth }
                onChange = { (event) => this.setState({
                  startMonth: event.target.value
                })}
              >
                <option>01</option>
                <option>02</option>
                <option>03</option>
                <option>04</option>
                <option>05</option>
                <option>10</option>
                <option>11</option>
                <option>12</option>
              </select>
            </td></tr></table>
        <h4> Конец: </h4>
        <table>
          <tr>
            <td>
              Год
            </td>
            <td>
              <select
                value = { this.state.endYear }
                onChange = { (event) => this.setState({
                  endYear: event.target.value
                })}
              >
                <option>2018</option>
                <option>2017</option>
                <option>2016</option>
                <option>2015</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              Месяц
            </td>
            <td>
              <select
                value = { this.state.endMonth }
                onChange = { (event) => this.setState({
                  endMonth: event.target.value
                })}
              >
                <option>01</option>
                <option>02</option>
                <option>03</option>
                <option>04</option>
                <option>05</option>
                <option>10</option>
                <option>11</option>
                <option>12</option>
              </select>
            </td></tr></table>

        <h3>Приоритеты</h3>
        <table>
          <tr>
            <td>
              Котловой метод
            </td>
            <td>
              <select
                value = { this.state.kotel }
                onChange = { (event) => this.setState({
                  kotel: event.target.value
                })}
              >
                <option value = 'false'>Нет</option>
                <option value = 'true'>Да</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              Показания
            </td>
            <td>
              <select
                value = { this.state.method }
                onChange = { (event) => this.setState({
                  method: event.target.value
                })}
              >
                <option>РЦ</option>
                <option>ОДПУ</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              Учесть периоды отсутствия ОДПУ
            </td>
            <td>
              <select
                value = { this.state.useR }
                onChange = { (event) => this.setState({
                  useR: event.target.value
                })}
              >
                <option value='true'>Да</option>
                <option value='false'>Нет</option>
              </select>
            </td>
          </tr>
        </table>
        <button onClick = { this.requestProceed.bind(this) }> Рассчитать </button>
      </div>;

    return (
      <div>
        <button
          className = 'mainbutton'
          onClick = { switchOpen }
        > Новый отчет по всем домам </button>
        { form }
      </div>
    );
  }
}

export default RequestAllHouses;
