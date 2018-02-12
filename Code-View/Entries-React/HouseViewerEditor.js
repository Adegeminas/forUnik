import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class HouseViewerEditor extends Component{

  constructor(props) {
    super(props);

    let house = props.house;

    this.updateProceed = props.updateProceed;
    this.deleteProceed = props.deleteProceed;

    this.initialState = {
      house: null,
      isOpen: false,
      square: 0,
      sameCounter: false,
      RC1: '',
      RC2: '',
    };

    this.state = this.initialState;
  }

  componentWillReceiveProps(nextProps) {
    if ( !nextProps.house ) {
      this.setState(this.initialState);
      return;
    }

    let { house } = nextProps;

    this.setState({
      house: house,
      square: house.square,
      sameCounter: house.sameCounter,
      RC1: house.RC1,
      RC2: house.RC2,
    });
  }

  render() {
    const { house } = this.props;

    const editMenu = this.state.isOpen &&
      <div>
        <table>
          <tr>
            <td
              style = {{
                width: 200 + 'px',
            }}>
              Площадь
            </td>
            <td>
              <input
                className = { this.state.square ? 'ffi' : 'nffi' }
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
        <button onClick = { this.handleUpdate.bind(this) }> Сохранить </button>
        <button onClick = { this.handleOpen.bind(this) }> Отмена </button>
        <button onClick = { this.handleDelete.bind(this) }> Удалить дом </button>
      </div>;

    const body = house &&
      <div>
        <button onClick = { this.handleOpen.bind(this) } > Редактировать дом </button>
        { editMenu }
      </div>;

    return (
      <div>
        { body }
      </div>
    );
  }

  handleOpen() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  handleDelete() {
    if (confirm('Это действие удалит дом со всеми отчетными периодами. Вы уверены?')) {
      this.deleteProceed(this.state.house.address);
    }
  }

  handleUpdate() {
    let flag = this.state.square &&
               this.state.RC1 &&
               this.state.RC2;

    if (!flag) {
      return;
    }

    let request = {
      square: this.state.square,
      sameCounter: this.state.sameCounter,
      RC1: this.state.RC1,
      RC2: this.state.RC2,
    };
    this.updateProceed(request, this.state.house);
    this.setState(this.initialState);
  }
}

export default HouseViewerEditor;
