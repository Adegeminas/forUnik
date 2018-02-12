import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class RequestOneHouse extends Component {

  constructor(props) {
    super(props);

    this.initialState = {
      town: 'Пермь',
      streetType: 'улица',
      streetName: '',
      houseNumber: '',
      startYear: '2015',
      startMonth: '01',
      endYear: '2018',
      endMonth: '12',
      kotel: 'false',
      method: 'РЦ',
      useR: 'false',
    };

    this.state = this.initialState;
  }

  render() {
    const { isOpen, switchOpen, socket } = this.props;
    const form = isOpen &&
      <div>
        <h3> Адрес </h3>
        <table>
          <tr>
            <td style= {{ width: 200 + 'px' }} > Город </td>
            <td style= {{ width: 150 + 'px' }} >
              <input
                 className = {this.state.town.length ? 'ffi' : 'nffi' }
                 value = { this.state.town }
                 onChange = { (event) => this.setState({
                   town: event.target.value,
                 }) }
               />
            </td></tr>
          <tr>
            <td>
              Тип улицы
            </td>
            <td>
               <select
                 style = {{ width: 100 +'%' }}
                 value = { this.state.streetType }
                 onChange = { (event) => this.setState({
                   streetType: event.target.value,
                 })}>

                 <option value="улица"> улица </option>
                 <option value="проспект"> проспект </option>
                 <option value="проезд"> проезд </option>
                 <option value="аллея"> аллея </option>
                 <option value="прощадь"> площадь </option>
                 <option value="переулок"> переулок </option>
                 <option value="линия"> линия </option>
               </select>
            </td></tr>
          <tr>
            <td>
              Название улицы
            </td>
            <td>
              <input
                 list = "streetList1"
                 className = { this.state.streetName.length ? 'ffi' : 'nffi' }
                 value = { this.state.streetName }
                 onChange = { (event) => this.setState({
                   streetName: event.target.value,
                 }) }
              />
            </td></tr>
          <tr>
            <td>
              Номер дома
            </td>
            <td>
              <input
                className = { this.state.houseNumber.length ? 'ffi' : 'nffi' }
                value = { this.state.houseNumber }
                onChange = { (event) => this.setState({
                  houseNumber: event.target.value,
                }) }
              />
            </td></tr></table>

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
                startYear: event.target.value,
              })}>
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
                startMonth: event.target.value,
              })}>
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
                endYear: event.target.value,
              })}>
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
                endMonth: event.target.value,
              })}>
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
                kotel: event.target.value,
              })}>
                <option value="false">Нет</option>
                <option value="true">Да</option>
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
                method: event.target.value,
              })}>
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
                useR: event.target.value,
              })}>
                <option value="true">Да</option>
                <option value="false">Нет</option>
              </select>
            </td>
          </tr>
        </table>
        <button onClick = { this.requestProceed.bind(this) }> Рассчитать </button>
      </div>;

    return (
      <div>
        <button
          className = "mainbutton"
          onClick = { switchOpen }
        > Новый отчет по одному дому </button>
        { form }
      </div>
    );
  }

  requestProceed() {
    let flag = this.state.town.length > 0 &&
               this.state.streetName.length > 0 &&
               this.state.houseNumber.length > 0;

    if (!flag) {

      alert('Заполните все поля!');

    } else {

      let request = {
        address: this.state.town + ',' +
                 this.state.streetType + ',' +
                 this.state.streetName + ',' +
                 this.state.houseNumber,
        startPeriod: this.state.startMonth + '-' + this.state.startYear,
        endPeriod: this.state.endMonth + '-' + this.state.endYear,
        kotel: this.state.kotel,
        method: this.state.method,
        useR: this.state.useR,
        header: 'Адрес: ' + this.state.town + ',' +
                 this.state.streetType + ',' +
                 this.state.streetName + ',' +
                 this.state.houseNumber,
      };

      this.props.socket.emit('oneHouseRequest', request);
      this.props.switchOpen();
    }
  }
}

export default RequestOneHouse;
