import React, {Component} from 'react';

class HouseViewerEditor extends Component {
  constructor(props) {
    super(props);

    this.updateProceed = props.updateProceed;
    this.deleteProceed = props.deleteProceed;

    this.initialState = {
      house: null,
      isOpen: false,
      square: 0,
      sameCounter: false,
      RC1: '',
      RC2: ''
    };

    this.state = this.initialState;
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.house) {
      this.setState(this.initialState);
      return;
    }

    const { house } = nextProps;

    this.setState({
      house: house,
      square: house.square,
      sameCounter: house.sameCounter,
      RC1: house.RC1,
      RC2: house.RC2
    });
  }

  handleOpen() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  handleDelete() {
    if (confirm('Это действие удалит дом со всеми отчетными периодами. Вы уверены?')) {
      this.deleteProceed(this.state.house.address);
    }
  }

  handleUpdate() {
    const flag = this.state.square &&
               this.state.RC1 &&
               this.state.RC2;

    if (!flag) {
      return;
    }

    const request = {
      square: String(this.state.square).replace(',', '.'),
      sameCounter: this.state.sameCounter,
      RC1: this.state.RC1,
      RC2: this.state.RC2
    };

    this.updateProceed(request, this.state.house);
    this.setState(this.initialState);
  }

  render() {
    const { house } = this.props;

    const editMenu = this.state.isOpen &&
      <div>
        <table>
          <tr>
            <td
              style = {{
                width: 200 + 'px'
              }}
            >
              Площадь
            </td>
            <td>
              <input
                className = { this.state.square ? 'ffi' : 'nffi' }
                value = { this.state.square }
                onChange = { (event) => this.setState({
                  square: event.target.value
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
                  sameCounter: event.target.value
                })}
              >
                <option value = 'false'>Нет</option>
                <option value = 'true'>Да</option>
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
                  RC1: event.target.value
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
                  RC2: event.target.value
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
}

export default HouseViewerEditor;
