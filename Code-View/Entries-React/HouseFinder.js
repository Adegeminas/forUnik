import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class HouseFinder extends Component{

  constructor(props) {
    super(props);

    this.initialState = {
      town: "Пермь",
      streetType: "улица",
      streetName: "",
      houseNumber: "",
    };

    this.state = this.initialState;
  }

  render() {

    const { isOpen, switchOpen } = this.props;

    const form = isOpen &&
     <div>
       <legend>Поиск дома</legend>
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
       </table>
       <button onClick = { this.handleFind.bind(this) } > Найти </button>
       <button onClick = { switchOpen } > Отмена </button>
     </div>;

    return (
      <div>
        <button className = "mainbutton" onClick = { switchOpen } > Найти дом </button>
        { form }
      </div>
    );
  }

  handleFind() {
    const flag =
      this.state.town.length &&
      this.state.streetName.length &&
      this.state.houseNumber.length;

    if (flag) {
      let house = {
        address: this.state.town + ',' +
                 this.state.streetType + ',' +
                 this.state.streetName + ',' +
                 this.state.houseNumber
      };
      this.props.proceed(house);
      this.setState(this.initialState);
      this.props.switchOpen();
    }
  }
}

export default HouseFinder;
