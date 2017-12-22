class PeriodAdder {
  constructor(house) {
    this.div = document.createElement('div');
    this.render();
    this.initialize();
  }

  render() {
    this.div.innerHTML = `
      <button> Добавить отчетный период </button>
      <div hidden='true'>
        <table>
          <tr>
            <td>
              Год
            </td>
            <td>
              <select name="year">
                <option>2015</option>
                <option>2016</option>
                <option>2017</option>
                <option>2018</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              Месяц
            </td>
            <td>
              <select name="month">
                <option>01</option>
                <option>02</option>
                <option>03</option>
                <option>04</option>
                <option>05</option>
                <option>10</option>
                <option>11</option>
                <option>12</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              Продано энергосбережение
            </td>
            <td>
              <select name="isBasic">
                <option value="true">Нет</option>
                <option value="false">Да</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              Прибор учета работал
            </td>
            <td>
              <select name="shouldCount">
                <option value="true">Да</option>
                <option value="false">Нет</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              УК
            </td>
            <td>
              <input type="text" name="company" value="Сторм">
            </td>
          </tr>
          <tr>
            <td>
              Данные РЦ без вычета ГВС
            </td>
            <td>
              <input type="text" name="O" value="">
            </td>
          </tr>
          <tr>
            <td>
              Данные РЦ с вычетом ГВС
            </td>
            <td>
              <input type="text" name="P" value="">
            </td>
          </tr>
          <tr>
            <td>
              Данные ОДПУ без вычета ГВС
            </td>
            <td>
              <input type="text" name="Q" value="">
            </td>
          </tr>
          <tr>
            <td>
              Данные по нормативу
            </td>
            <td>
              <input type="text" name="R" value="">
            </td>
          </tr>
          <tr>
            <td>
              Тариф
            </td>
            <td>
              <input type="text" name="tarif" value="3000">
            </td>
          </tr>
        </table>
      <button> Сохранить </button>
    </div>
    `;
  }

  initialize() {
    this.div.getElementsByTagName('button')[0].onclick = () => {
      this.div.getElementsByTagName('div')[0].hidden = !this.div.getElementsByTagName('div')[0].hidden;
    }
    this.div.getElementsByTagName('button')[1].onclick = () => {
      let form = this.div.getElementsByTagName('div')[0];
      let flag = form.querySelector('[name=O]').value.length > 0 ||
                 form.querySelector('[name=P]').value.length > 0 ||
                 form.querySelector('[name=Q]').value.length > 0 ||
                 form.querySelector('[name=tarif]').value.length > 0 ||
                 form.querySelector('[name=R]').value.length > 0;
      flag = flag && form.querySelector('[name=company]').value.length > 0;
      if (!flag) {
        alert('Заполните все поля!');
      } else {
        form.hidden = true;
        let newPeriod = {
          month: form.querySelector('[name=month]').value + '-' + form.querySelector('[name=year]').value,
          isBasic: form.querySelector('[name=isBasic]').value,
          shouldCount: form.querySelector('[name=shouldCount]').value,
          company: form.querySelector('[name=company]').value,
          O: form.querySelector('[name=O]').value,
          P: form.querySelector('[name=P]').value,
          Q: form.querySelector('[name=Q]').value,
          R: form.querySelector('[name=R]').value,
          tarif: form.querySelector('[name=tarif]').value,
        };
        socket.emit('addNewPeriod', {
          address: document.getElementById('address').innerHTML,
        }, newPeriod);
      }
    }
  }
}
