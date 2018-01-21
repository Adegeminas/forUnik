class HouseEditor {
  constructor(house) {
    this.div = document.createElement('div');
    this.render();
    this.initialize();
  }

  render() {
    this.div.innerHTML = `
      <button> Редактировать дом </button>
      <div hidden='true'>
        <table>
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
              Общий счетчик тепла и ГВС
            </td>
            <td>
              <select name="sameCounter" style="width: 100%">
                <option value="true">Да</option>
                <option value="false">Нет</option>
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
              РЦ вода
            </td>
            <td>
              <input type="text" name="RC2" value="ИРЦ">
            </td>
          </tr>
        </table>
        <button> Сохранить редактирование </button>
        <button> Отменить редактирование </button>
        <button> Удалить дом </button>
      </div>`;
  }

  initialize() {
    this._editHouseButton = this.div.getElementsByTagName('button')[0];
    this._form = this.div.getElementsByTagName('div')[0];
    this._saveEditingButton = this.div.getElementsByTagName('button')[1];
    this._cancelEditingButton = this.div.getElementsByTagName('button')[2];
    this._deleteHouseButton = this.div.getElementsByTagName('button')[3];

    this._editHouseButton.onclick = () => {
      this._form.hidden = !this._form.hidden;
    };
    this._saveEditingButton.onclick = () => {
      let form = this._form;
      let flag = form.querySelector('[name=square]').value.length > 0 &&
                 form.querySelector('[name=RC1]').value.length > 0 &&
                 form.querySelector('[name=RC1]').value.length > 0;
      if (!flag) {
        alert('Заполните все поля!');
      } else {
        form.hidden = true;
        let request = {
          square: form.querySelector('[name=square]').value,
          sameCounter: form.querySelector('[name=sameCounter]').value,
          RC1: form.querySelector('[name=RC1]').value,
          RC2: form.querySelector('[name=RC2]').value,
        };
        socket.emit('editHouse', request, currentHouse);
      }
    }
    this._cancelEditingButton.onclick = () => {
      this._form.hidden = true;
    }
    this._deleteHouseButton.onclick = () => {
      let address = document.getElementById('address').innerHTML;
      if (confirm('Это действие удалит дом со всеми отчетными периодами. Вы уверены?')) {
        socket.emit('deleteHouse', address);
      }
    }
  }
}
