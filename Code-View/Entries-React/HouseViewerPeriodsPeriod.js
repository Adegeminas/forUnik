import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class HouseViewerPeriodsPeriod extends Component{

  constructor(props) {
    super(props);

    this.initialState = {
      editOpen: false,
      sameCounter: props.house.sameCounter,
      isBasic:  String(props.period.isBasic),
      shouldCount: String(props.period.shouldCount),
      company: props.period.company,
      O: props.period.O ? String(props.period.O) : '',
      P: props.period.P ? String(props.period.P) : '',
      Q: props.period.Q ? String(props.period.Q) : '',
      R: props.period.R ? String(props.period.R) : '',
      tarif: String(props.period.tarif),
    }

    this.state = this.initialState;
  }

  componentWillReceiveProps(props) {
    this.state = {
      editOpen: false,
      sameCounter: props.house.sameCounter,
      isBasic:  String(props.period.isBasic),
      shouldCount: String(props.period.shouldCount),
      company: props.period.company,
      O: props.period.O ? String(props.period.O) : '',
      P: props.period.P ? String(props.period.P) : '',
      Q: props.period.Q ? String(props.period.Q) : '',
      R: props.period.R ? String(props.period.R) : '',
      tarif: String(props.period.tarif),
    }
  }


  render() {
    const { period, socket, house } = this.props;

    return (
      <tr>
        <td>
          { period.month }
        </td>
        <td>
          { this.state.editOpen
            ?
              <select
                className = { "smallInput" }
                name="isBasic"
                value = { this.state.isBasic }
                onChange = { (event) => this.setState({
                  isBasic: event.target.value,
                })}>
                  <option value="true">Нет</option>
                  <option value="false">Да</option>
              </select>
            :
              period.isBasic ? 'Нет' : 'Да'
          }
        </td>
        <td>
          { this.state.editOpen
            ?
              <select
                className = { "smallInput" }
                name="shouldCount"
                value = { this.state.shouldCount }
                onChange = { (event) => this.setState({
                  shouldCount: event.target.value,
                })}
              >
                <option value="true">Да</option>
                <option value="false">Нет</option>
              </select>
            :
              period.shouldCount ? 'Да' : 'Нет'
          }
        </td>
        <td>
          { this.state.editOpen
            ?
              <input
                 list="companiesList1"
                 className = {this.state.company.length ? 'ffi smallInput' : 'nffi smallInput' }
                 value = { this.state.company }
                 onChange = { (event) => this.setState({
                   company: event.target.value,
                 }) }
               />
            :
              period.company
          }
        </td>
        <td>
          { this.state.editOpen
            ?
              <input
                 className = {this.state.O.length ? 'ffi smallInput' : 'sffi smallInput' }
                 value = { this.state.O }
                 onChange = {
                   (event) => {
                     !this.state.sameCounter
                     ?
                       this.setState({
                         O: event.target.value,
                         P: event.target.value,
                       })
                     :
                       this.setState({
                         O: event.target.value,
                       })
                   }
                 }
               />
            :
              period.O ? period.O : '---'
          }
        </td>
        <td>
          { this.state.editOpen && this.state.sameCounter
            ?
              <input
                 className = {this.state.P.length ? 'ffi smallInput' : 'sffi smallInput' }
                 value = { this.state.P }
                 onChange = { (event) => this.setState({
                   P: event.target.value,
                 }) }
               />
            :
              this.state.P ? this.state.P : '---'
          }
        </td>
        <td>
          { this.state.editOpen
            ?
              <input
                 className = {this.state.Q.length ? 'ffi smallInput' : 'sffi smallInput' }
                 value = { this.state.Q }
                 onChange = { (event) => this.setState({
                   Q: event.target.value,
                 }) }
               />
            :
              period.Q ? period.Q : '---'
          }
        </td>
        <td>
          { this.state.editOpen && (this.state.shouldCount === 'false')
            ?
              <input
                 className = {this.state.R.length ? 'ffi smallInput' : 'sffi smallInput' }
                 value = { this.state.R }
                 onChange = { (event) => this.setState({
                   R: event.target.value,
                 }) }
               />
            :
              period.R ? period.R : '---'
          }
        </td>
        <td>
          { this.state.editOpen
            ?
              <input
                 className = {this.state.tarif.length ? 'ffi smallInput' : 'nffi smallInput' }
                 value = { this.state.tarif }
                 onChange = { (event) => this.setState({
                   tarif: event.target.value,
                 }) }
               />
            :
              period.tarif
          }
        </td>
        <td>
          { this.state.editOpen
            ?
              <div>
                <button
                  className = 'minibutton'
                  onClick = { this.proceedCancel.bind(this) }

                > Отмена </button>

                <button
                  className = 'minibutton'
                  onClick = { this.proceedSave.bind(this) }

                > Сохранить </button>
              </div>
            :
              <div>
                <button
                  className = 'minibutton'
                  onClick = { this.switchEditState.bind(this) }

                > Редактировать </button>
                <button className = 'minibutton red' onClick = { () => {
                  socket.emit('deletePeriod', period.month + '/' + house.address);
                } }> Удалить </button>
              </div>
          }
        </td>
      </tr>
    )
  }

  switchEditState() {
    this.setState({
      editOpen: !this.state.editOpen,
    })
  }

  proceedCancel() {
    this.setState({
      editOpen: false,
    })
  }

  proceedSave() {
    const flag =
      (this.state.O.length ||
      this.state.P.length ||
      this.state.Q.length ||
      this.state.R.length) &&
      this.state.company.length &&
      this.state.tarif.length;

    if (flag) {
      let newPeriod = {
        month: this.props.period.month,
        isBasic: this.state.isBasic,
        shouldCount: this.state.shouldCount,
        company: this.state.company,
        O: this.state.O.replace(',','.'),
        P: this.state.P.replace(',','.'),
        Q: this.state.Q.replace(',','.'),
        R: this.state.R.replace(',','.'),
        tarif: this.state.tarif.replace(',','.'),
      };

      this.props.socket.emit('updatePeriod', this.props.house.address, newPeriod);

      this.setState({
        editOpen: !this.state.editOpen,
      })
    }
  }
}

export default HouseViewerPeriodsPeriod
