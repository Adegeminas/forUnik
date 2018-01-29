class HouseFinder {
  constructor(element, options = {}, controller) {
    this._element = element;
    this.render();
    this.initialize();
  };

  render() {
    this._element.innerHTML = `
      <button class="mainbutton"> Найти дом по адресу </button>
      <div hidden="true">
        <legend>Поиск дома</legend>
        <table>
          <tr>
            <td>
              Город
            </td>
            <td>
              <input type="text" name="town" value="Пермь">
            </td>
          </tr>
          <tr>
            <td>
              Тип улицы
            </td>
            <td>
              <select name="streetType">
                <option>улица</option>
                <option>проспект</option>
                <option>проезд</option>
                <option>аллея</option>
                <option>площадь</option>
                <option>переулок</option>
                <option>линия</option>
               </select>
            </td>
          </tr>
          <tr>
            <td>
              Название улицы
            </td>
            <td>
              <input type="text" name="streetName" list="streetList1">
            </td>
          </tr>
          <tr>
            <td>
              Номер дома
            </td>
            <td>
              <input type="text" name="houseNumber">
            </td>
          </tr>
        </table>
        <br>
        <button> Найти </button>
        <button> Отмена </button>
      </div>
    `;
  };

  initialize() {
    this._toogleButton = this._element.getElementsByTagName('button')[0];
    this._formDiv = this._element.getElementsByTagName('div')[0];
    this._findButton = this._formDiv.getElementsByTagName('button')[0];
    this._cancelButton = this._formDiv.getElementsByTagName('button')[1];

    this._toogleButton.onclick = () => {
      this._formDiv.hidden = !this._formDiv.hidden;
      controller.showFinder();
    }
    this._findButton.onclick = () => {
      let form = this._formDiv;
      let flag = form.querySelector('[name=town]').value.length > 0 &&
                 form.querySelector('[name=streetType]').value.length > 0 &&
                 form.querySelector('[name=streetName]').value.length > 0 &&
                 form.querySelector('[name=houseNumber]').value.length > 0;
      if (!flag) {
        alert('Заполните все поля!');
      } else {
        form.hidden = true;
        let house = {
          address: form.querySelector('[name=town]').value + ',' +
                   form.querySelector('[name=streetType]').value + ',' +
                   form.querySelector('[name=streetName]').value + ',' +
                   form.querySelector('[name=houseNumber]').value,
        };
        socket.emit('findOneHouse', house);
      }
    }
    this._cancelButton.onclick = () => {
      this._formDiv.hidden = true;
    }
  }

  hide() {
    this._element.getElementsByTagName('div')[0].hidden = true;
  }
};
