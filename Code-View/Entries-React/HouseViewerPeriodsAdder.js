import React, {Component} from 'react';

function nextPeriod(period) {
  const [month, year] = period.split('-');

  switch (month) {
    case '01': return `02-${year}`;
    case '02': return `03-${year}`;
    case '03': return `04-${year}`;
    case '04': return `05-${year}`;
    case '05': return `10-${year}`;
    case '10': return `11-${year}`;
    case '11': return `12-${year}`;
    default  : return `01-${(Number(year) + 1) + ''}`;
  }
}

class HouseViewerPeriodsAdder extends Component {
  constructor(props) {
    super(props);

    const lastMonth = props.house && props.house.data[this.props.house.data.length - 1];

    this.initialState = lastMonth ? {
      year: nextPeriod(lastMonth).split('-')[1],
      month: nextPeriod(lastMonth).split('-')[0],
      isBasic: String(lastMonth.isBasic),
      shouldCount: String(lastMonth.shouldCount),
      company: lastMonth.company,
      O: '',
      P: '',
      Q: '',
      R: '',
      tarif: lastMonth.tarif
    } : {
      year: '2015',
      month: '01',
      isBasic: 'false',
      shouldCount: 'false',
      company: '',
      O: '',
      P: '',
      Q: '',
      R: '',
      tarif: ''
    };

    this.state = this.initialState;
  }

  componentWillReceiveProps(props) {
    if (props.house  && !props.house.data.length) {
      this.setState(this.initialState);
      return;
    }

    if (!props.house  || !props.house.data.length) {
      return;
    }

    const lastMonth = props.house.data[props.house.data.length - 1];

    this.setState({
      year: nextPeriod(lastMonth.month).split('-')[1],
      month: nextPeriod(lastMonth.month).split('-')[0],
      isBasic: String(lastMonth.isBasic),
      shouldCount: String(lastMonth.shouldCount),
      company: lastMonth.company,
      O: '',
      P: '',
      Q: '',
      R: '',
      tarif: String(lastMonth.tarif)
    });

    if (this.textInput) this.textInput.focus();
  }

  saveProceed() {
    const flag =
      (this.state.O.length ||
      this.state.P.length ||
      this.state.Q.length ||
      this.state.R.length) &&
      this.state.company.length &&
      this.state.tarif.length;

    if (flag) {
      const newPeriod = {
        month: this.state.month + '-' + this.state.year,
        isBasic: this.state.isBasic,
        shouldCount: this.state.shouldCount,
        company: this.state.company,
        O: this.state.O.replace(',', '.'),
        P: this.state.P.replace(',', '.'),
        Q: this.state.Q.replace(',', '.'),
        R: this.state.R.replace(',', '.'),
        tarif: this.state.tarif.replace(',', '.')
      };

      this.props.socket.emit('addNewPeriod', this.props.house, newPeriod);
      this.props.switchOpen();
    }
  }

  continueProceed() {
    const flag =
      (this.state.O.length ||
      this.state.P.length ||
      this.state.Q.length ||
      this.state.R.length) &&
      this.state.company.length &&
      this.state.tarif.length;

    if (flag) {
      const newPeriod = {
        month: this.state.month + '-' + this.state.year,
        isBasic: this.state.isBasic,
        shouldCount: this.state.shouldCount,
        company: this.state.company,
        O: this.state.O.replace(',', '.'),
        P: this.state.P.replace(',', '.'),
        Q: this.state.Q.replace(',', '.'),
        R: this.state.R.replace(',', '.'),
        tarif: this.state.tarif.replace(',', '.')
      };

      this.props.socket.emit('addNewPeriodAndContinue', this.props.house, newPeriod);
    }
  }

  render() {
    const { house, isOpen, switchOpen} = this.props;

    const button = house &&
      <button onClick = { switchOpen } > Добавить отчетный период </button>;

    const form = isOpen && house &&
      <div>
        <legend>Добавление нового отчетного периода</legend>
        <table>
          <tr>
            <td style= {{ width: 300 + 'px' }} > Год </td>
            <td style= {{ width: 150 + 'px' }} >
              <select
                style = {{ width: 100 + '%' }}
                value = { this.state.year }
                onChange = { (event) => this.setState({
                  year: event.target.value
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
                value = { this.state.month }
                onChange = { (event) => this.setState({
                  month: event.target.value
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
            </td>
          </tr>
          <tr>
            <td>
              Продано энергосбережение
            </td>
            <td>
              <select name='isBasic'
                value = { this.state.isBasic }
                onChange = { (event) => this.setState({
                  isBasic: event.target.value
                })}
              >
                <option value = 'true'> Нет </option>
                <option value = 'false'> Да </option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              Прибор учета работал
            </td>
            <td>
              <select name='shouldCount'
                value = { this.state.shouldCount }
                onChange = { (event) => this.setState({
                  shouldCount: event.target.value
                })}
              >
                <option value = 'true'> Да </option>
                <option value = 'false'> Нет </option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              УК
            </td>
            <td>
              <input
                list='companiesList1'
                className = {this.state.company.length ? 'ffi' : 'nffi' }
                value = { this.state.company }
                onChange = { (event) => this.setState({
                  company: event.target.value
                }) }
              />
            </td>
          </tr>
          <tr>
            <td>
              { house.sameCounter ? 'Данные РЦ без вычета ГВС' : 'Данные РЦ' }
            </td>
            <td>
              <input
                ref = { input => {
                  this.textInput = input;
                }}
                className = {this.state.O.length ? 'ffi' : 'sffi' }
                value = { this.state.O }
                onChange = { (event) => this.setState({
                  O: event.target.value
                }) }
              />
            </td>
          </tr>

          { house.sameCounter ? (
            <tr>
              <td>
                Данные РЦ с вычетом ГВС
              </td>
              <td>
                <input
                  className = {this.state.P.length ? 'ffi' : 'sffi' }
                  value = { this.state.P }
                  onChange = { (event) => this.setState({
                    P: event.target.value
                  }) }
                />
              </td>
            </tr>
          ) : null}

          <tr>
            <td>
              Данные ОДПУ без вычета ГВС
            </td>
            <td>
              <input
                className = {this.state.Q.length ? 'ffi' : 'sffi' }
                value = { this.state.Q }
                onChange = { (event) => this.setState({
                  Q: event.target.value
                }) }
              />
            </td>
          </tr>

          { this.state.shouldCount === 'false' ? (
            <tr>
              <td>
                Данные по среднему
              </td>
              <td>
                <input
                  className = {this.state.R.length ? 'ffi' : 'sffi' }
                  value = { this.state.R }
                  onChange = { (event) => this.setState({
                    R: event.target.value
                  }) }
                />
              </td>
            </tr>
          ) : null}

          <tr>
            <td>
              Тариф
            </td>
            <td>
              <input
                className = {this.state.tarif.length ? 'ffi' : 'nffi' }
                value = { this.state.tarif }
                onChange = { (event) => this.setState({
                  tarif: event.target.value
                }) }
              />
            </td>
          </tr>
        </table>

        <button onClick = { this.saveProceed.bind(this) }> Сохранить </button>
        <button onClick = { this.continueProceed.bind(this) }> Сохранить и перейти к следующему месяцу</button>
      </div>;

    return (
      <div>
        { button }
        { form }
      </div>
    );
  }
}

export default HouseViewerPeriodsAdder;
