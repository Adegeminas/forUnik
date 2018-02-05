import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class HouseViewerEditor extends Component{

  constructor(props) {
    super(props);

    let house = props.house;

    this.state = {
      isOpen: false,
    }
  }

  render() {
    const { house } = this.props;

    const editMenu = this.state.isOpen &&
      <div>
        <input
          value = { this.state.square }
          onChange = { (event) => this.setState({
            square: event.target.value,
          }) }
        />
      </div>

    const body = house &&
      <div>
        <button onClick = { this.handleOpen.bind(this)  } > Редактировать дом </button>
        { editMenu }
      </div>

    return (
      <div>
        { body }
      </div>
    )
  }

  handleOpen() {
    this.setState({
      isOpen: !this.state.isOpen,
    })
  }
}

export default HouseViewerEditor

// <table>
//   <tr>
//     <td>
//       Площадь
//     </td>
//     <td>
//       <input
//         className = { this.state.square.length ? 'ffi' : 'nffi' }
//         value = { this.state.square }
//         onChange = { (event) => this.setState({
//           square: event.target.value,
//         }) }
//       />
//     </td>
//   </tr>
//   <tr>
//     <td>
//       Общий счетчик тепла и ГВС
//     </td>
//     <td>
//       <select
//          style = {{ width: 100 + '%' }}
//          value = { this.state.sameCounter }
//          onChange = { (event) => this.setState({
//            sameCounter: event.target.value,
//        })}>
//          <option value="false">Нет</option>
//          <option value="true">Да</option>
//       </select>
//     </td>
//   </tr>
//   <tr>
//     <td>
//       РЦ тепло
//     </td>
//     <td>
//       <input
//         className = { this.state.RC1.length ? 'ffi' : 'nffi' }
//         value = { this.state.RC1 }
//         onChange = { (event) => this.setState({
//           RC1: event.target.value,
//         }) }
//       />
//     </td>
//   </tr>
//   <tr>
//     <td>
//       РЦ энергосбережение
//     </td>
//     <td>
//       <input
//         className = { this.state.RC2.length ? 'ffi' : 'nffi' }
//         value = { this.state.RC2 }
//         onChange = { (event) => this.setState({
//           RC2: event.target.value,
//         }) }
//       />
//     </td>
//   </tr>
// </table>
// <button> Сохранить </button>
// <button> Отмена </button>
// <button> Удалить дом </button>
