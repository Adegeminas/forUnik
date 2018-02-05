import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class HouseAdder extends Component {

  constructor(props) {
    super(props);

    this.initialState = {
      town: "Пермь",
      streetType: "улица",
      streetName: "",
      houseNumber: "",
      square: "",
      sameCounter: "false",
      RC1: "ИРЦ",
      RC2: "ИРЦ",
    };

    this.state = this.initialState;
  }

  render() {
    const { isOpen, switchOpen } = this.props;

    const form = isOpen &&
     <div>
      <legend>Добавление нового дома</legend>
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
             </td>
           </tr>
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
             </td>
           </tr>
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
             </td>
           </tr>
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
             </td>
           </tr>
           <tr>
             <td>
               Площадь
             </td>
             <td>
               <input
                 className = { this.state.square.length ? 'ffi' : 'nffi' }
                 value = { this.state.square }
                 onChange = { (event) => this.setState({
                   square: event.target.value,
                 }) }
               />
             </td>
           </tr>
           <tr>
             <td>
               Общий счетчик тепла и ГВС
             </td>
             <td>
               <select
                  style = {{ width: 100 + '%' }}
                  value = { this.state.sameCounter }
                  onChange = { (event) => this.setState({
                    sameCounter: event.target.value,
                })}>
                  <option value="false">Нет</option>
                  <option value="true">Да</option>
               </select>
             </td>
           </tr>
           <tr>
             <td>
               РЦ тепло
             </td>
             <td>
               <input
                 className = { this.state.RC1.length ? 'ffi' : 'nffi' }
                 value = { this.state.RC1 }
                 onChange = { (event) => this.setState({
                   RC1: event.target.value,
                 }) }
               />
             </td>
           </tr>
           <tr>
             <td>
               РЦ энергосбережение
             </td>
             <td>
               <input
                 className = { this.state.RC2.length ? 'ffi' : 'nffi' }
                 value = { this.state.RC2 }
                 onChange = { (event) => this.setState({
                   RC2: event.target.value,
                 }) }
               />
             </td>
           </tr>
         </table>
       <button onClick = { this.handleSave.bind(this) } > Сохранить </button>
       <button onClick = { switchOpen } > Отмена </button>
     </div>

    return (
      <div>
        <button className = "mainbutton" onClick = { switchOpen } > Добавить новый дом </button>
        { form }
      </div>
    )
  }

  handleSave() {
    const flag =
      this.state.town.length &&
      this.state.streetName.length &&
      this.state.houseNumber.length &&
      this.state.square.length &&
      this.state.RC1.length &&
      this.state.RC2.length;

    if (flag) {
      let house = {
        address: this.state.town + ',' +
                 this.state.streetType + ',' +
                 this.state.streetName + ',' +
                 this.state.houseNumber,
        square: this.state.square,
        sameCounter: this.state.sameCounter,
        RC1: this.state.RC1,
        RC2: this.state.RC2,
      };
      this.props.proceed(house);
      this.setState(this.initialState);
      this.props.switchOpen();
    }
  }
}

export default HouseAdder;
