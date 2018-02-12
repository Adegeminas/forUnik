class PeriodChanger {
  constructor(house, options) {
    this.house = house;
    this.options = options;
    this.div = document.createElement('div');
    this.render();
    this.initialize();
  }

  render(data) {
    if (!data) {
      this.div.innerHTML = ``;
    } else {
      this.div.innerHTML = `
        <div>
          <legend> Редактирование периода <i style="color:white">${data.month}</i></legend>

          <table>
            <tr>
              <td>
                Продано энергосбережение
              </td>
              <td>
                <select name="isBasic">
                  <option ${data.isBasic == true ? 'selected' : 1} value="true">Нет</option>
                  <option ${data.isBasic == false ? 'selected' : 1} value="false">Да</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>
                Прибор учета работал
              </td>
              <td>
                <select name="shouldCount">
                  <option ${data.shouldCount == true ? 'selected' : 1} value="true">Да</option>
                  <option ${data.shouldCount == false ? 'selected' : 1} value="false">Нет</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>
                УК
              </td>
              <td>
                <input
                  type="text"
                  name="company"
                  value="${data.company}"
                >
              </td>
            </tr>
            <tr>
              <td>
                Данные РЦ без вычета ГВС
              </td>
              <td>
                <input type="text" name="O"
                value=${data.O ? data.O : ''}>
              </td>
            </tr>

            ${ this.house.sameCounter
              ?
              `<tr>
                <td>
                  Данные РЦ с вычетом ГВС
                </td>
                <td>
                  <input type="text" name="P" value=${data.P ? data.P : ''}>
                </td>
              </tr>`
              :
              `<tr hidden="true">
                <td>
                  Данные РЦ с вычетом ГВС
                </td>
                <td>
                  <input type="text" name="P" value=${data.P ? data.P : ''}>
                </td>
              </tr>`
            }

            <tr>
              <td>
                Данные ОДПУ без вычета ГВС
              </td>
              <td>
                <input type="text" name="Q" value=${data.Q ? data.Q : ''}>
              </td>
            </tr>

            <tr>
              <td>
                Данные по нормативу (по среднему)
              </td>
              <td>
                <input type="text" name="R" value=${data.R ? data.R : ''}>
              </td>
            </tr>

            <tr>
              <td>
                Тариф
              </td>
              <td>
                <input
                  type="text"
                  name="tarif"
                  value=${data.tarif}>
              </td>
            </tr>
          </table>

          <button> Сохранить </button>
          <button> Отменить </button>
        </div>
      `;
    }
  }

  initialize(data) {
    if (data) {
      let saveButton = this.div.getElementsByTagName('button')[0];
      let cancelButton = this.div.getElementsByTagName('button')[1];

      saveButton.onclick = () => {
        let form = this.div.getElementsByTagName('div')[0];
        let flag = form.querySelector('[name=O]').value.length > 0 ||
                   form.querySelector('[name=P]').value.length > 0 ||
                   form.querySelector('[name=Q]').value.length > 0 ||
                   form.querySelector('[name=R]').value.length > 0;
        flag = flag && (form.querySelector('[name=company]').value.length > 0) && (form.querySelector('[name=tarif]').value.length > 0);
        if (!flag) {
          alert('Заполните все поля!');
        } else {
          form.hidden = true;
          let newPeriod = {
            month: data.month,
            isBasic: form.querySelector('[name=isBasic]').value,
            shouldCount: form.querySelector('[name=shouldCount]').value,
            company: form.querySelector('[name=company]').value,
            O: form.querySelector('[name=O]').value.replace(',','.'),
            P: form.querySelector('[name=P]').value.replace(',','.'),
            Q: form.querySelector('[name=Q]').value.replace(',','.'),
            R: form.querySelector('[name=R]').value.replace(',','.'),
            tarif: form.querySelector('[name=tarif]').value,
          };

          socket.emit('updatePeriod', this.house.address, newPeriod);
        }

      };
      cancelButton.onclick = () => {
        this.hide();
      };
    }
  }

  hide() {
    this.div.getElementsByTagName('div')[0].hidden = true;
  }
  toggleHide() {
    this.div.getElementsByTagName('div')[0].hidden = !this.div.getElementsByTagName('div')[0].hidden;
  }
  open(data) {
    this.render(data);
    this.initialize(data);
  }
}
