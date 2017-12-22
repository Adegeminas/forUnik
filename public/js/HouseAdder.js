class HouseAdder {

  constructor(element, options = {}, controller) {
    this._element = element;
    this.render();
    this.initialize();
  };

  render() {
    this._element.innerHTML = `
      <button>Добавить новый дом</button>
      <div>
        <legend>Добавление нового дома</legend>
          <table>
            <tr>
              <td style='width:200px'>
                Город
              </td>
              <td style='width:150px'>
                <input type="text" name="town" value="Пермь">
              </td>
            </tr>
            <tr>
              <td>
                Тип улицы
              </td>
              <td>
                 <select name="streetType" style="width: 100%">
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
                <input name="streetName" list="streetList1">
              </td>
            </tr>
            <tr>
              <td>
                Номер дома
              </td>
              <td>
                <input type="text" name="houseNumber" value="6">
              </td>
            </tr>
            <tr>
              <td>
                Площадь
              </td>
              <td>
                <input type="text" name="square" value="1000">
              </td>
            </tr>
            <tr>
              <td>
                Общий счетчик
              </td>
              <td>
                <select name="sameCounter" style="width: 100%">
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
                <input type="text" name="RC1" value="ИРЦ">
              </td>
            </tr>
            <tr>
              <td>
                РЦ энергосбережение
              </td>
              <td>
                <input type="text" name="RC2" value="ИРЦ">
              </td>
            </tr>
          </table>
        <button>Сохранить</button>
        <button>Отмена</button>
      </div>`;
  };

  initialize() {
    this._toogleButton = this._element.getElementsByTagName('button')[0];
    this._formDiv = this._element.getElementsByTagName('div')[0];
    this._saveButton = this._formDiv.getElementsByTagName('button')[0];
    this._cancelButton = this._formDiv.getElementsByTagName('button')[1];

    this._toogleButton.onclick = (e) => {
      this._formDiv.hidden = !this._formDiv.hidden;
      controller.showAdder();
    }
    this._toogleButton.classList.add('mainbutton');
    this._formDiv.hidden = true;

    this._saveButton.onclick = () => {
      let form = this._formDiv;
      let flag = form.querySelector('[name=town]').value.length > 0 &&
                 form.querySelector('[name=streetType]').value.length > 0 &&
                 form.querySelector('[name=streetName]').value.length > 0 &&
                 form.querySelector('[name=houseNumber]').value.length > 0 &&
                 form.querySelector('[name=square]').value.length > 0 &&
                 form.querySelector('[name=RC1]').value.length > 0 &&
                 form.querySelector('[name=RC2]').value.length > 0;
      if (!flag) {
        alert('Заполните все поля!');
      } else {
        form.hidden = true;
        let house = {
          address: form.querySelector('[name=town]').value + ',' +
                   form.querySelector('[name=streetType]').value + ',' +
                   form.querySelector('[name=streetName]').value + ',' +
                   form.querySelector('[name=houseNumber]').value,
          square: form.querySelector('[name=square]').value,
          sameCounter: form.querySelector('[name=sameCounter]').value,
          RC1: form.querySelector('[name=RC1]').value,
          RC2: form.querySelector('[name=RC2]').value,
        };
        socket.emit('addNewHouse', house);
      }
    }

    this._cancelButton.onclick = () => {
      this._formDiv.hidden = true;
    }
  };

  hide() {
    this._element.getElementsByTagName('div')[0].hidden = true;
  }
};
