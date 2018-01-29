class PeriodAdder {
  constructor(house, options) {
    this.house = house;
    this.options = options;
    this.div = document.createElement('div');
    this.render();
    this.initialize();
  }

  render() {
    this.div.innerHTML = `
      <button> Добавить отчетный период </button>
      <div ${this.options&&this.options.year ? 1 : "hidden='true'"}>
        <table>
          <tr>
            <td>
              Год
            </td>
            <td>
              <select name="year">
                <option ${this.options&&this.options.year&&this.options.year=='2015' ? 'selected' : 1}>2015</option>
                <option ${this.options&&this.options.year&&this.options.year=='2016' ? 'selected' : 1}>2016</option>
                <option ${this.options&&this.options.year&&this.options.year=='2017' ? 'selected' : 1}>2017</option>
                <option ${this.options&&this.options.year&&this.options.year=='2018' ? 'selected' : 1}>2018</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              Месяц
            </td>
            <td>
              <select name="month">
                <option ${this.options&&this.options.month&&this.options.month=='01' ? 'selected' : 1}>01</option>
                <option ${this.options&&this.options.month&&this.options.month=='02' ? 'selected' : 1}>02</option>
                <option ${this.options&&this.options.month&&this.options.month=='03' ? 'selected' : 1}>03</option>
                <option ${this.options&&this.options.month&&this.options.month=='04' ? 'selected' : 1}>04</option>
                <option ${this.options&&this.options.month&&this.options.month=='05' ? 'selected' : 1}>05</option>
                <option ${this.options&&this.options.month&&this.options.month=='10' ? 'selected' : 1}>10</option>
                <option ${this.options&&this.options.month&&this.options.month=='11' ? 'selected' : 1}>11</option>
                <option ${this.options&&this.options.month&&this.options.month=='12' ? 'selected' : 1}>12</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              Продано энергосбережение
            </td>
            <td>
              <select name="isBasic">
                <option ${this.options&&this.options.sold&&this.options.sold=='20' ? 'selected' : 1} value="true">Нет</option>
                <option ${this.options&&this.options.sold&&this.options.sold=='10' ? 'selected' : 1} value="false">Да</option>
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
              <input
                type="text"
                name="company"
                value="${this.house.data.length ? this.house.data[this.house.data.length - 1].company : ''}"
                list="companiesList1">
            </td>
          </tr>
          <tr>
            <td>
              Данные РЦ без вычета ГВС
            </td>
            <td>
              <input id="focus" type="text" name="O" value="">
            </td>
          </tr>

          ${ this.house.sameCounter
            ?
            `<tr>
              <td>
                Данные РЦ с вычетом ГВС
              </td>
              <td>
                <input type="text" name="P" value="">
              </td>
            </tr>`
            :
            `<tr hidden="true">
              <td>
                Данные РЦ с вычетом ГВС
              </td>
              <td>
                <input type="text" name="P" value="">
              </td>
            </tr>`
          }

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
                  Данные по нормативу (по среднему)
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
              <input
                type="text"
                name="tarif"
                value=${this.options&&this.options.tarif ? this.options.tarif : ''}>
            </td>
          </tr>
        </table>
        <button> Сохранить </button>
        <button> Сохранить и перейти к следующему месяцу</button>
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
                 form.querySelector('[name=R]').value.length > 0;
      flag = flag && (form.querySelector('[name=company]').value.length > 0) && (form.querySelector('[name=tarif]').value.length > 0);
      if (!flag) {
        alert('Заполните все поля!');
      } else {
        form.hidden = true;
        let newPeriod = {
          month: form.querySelector('[name=month]').value + '-' + form.querySelector('[name=year]').value,
          isBasic: form.querySelector('[name=isBasic]').value,
          shouldCount: form.querySelector('[name=shouldCount]').value,
          company: form.querySelector('[name=company]').value,
          O: form.querySelector('[name=O]').value.replace(',','.'),
          P: form.querySelector('[name=P]').value.replace(',','.'),
          Q: form.querySelector('[name=Q]').value.replace(',','.'),
          R: form.querySelector('[name=R]').value.replace(',','.'),
          tarif: form.querySelector('[name=tarif]').value,
        };


        socket.emit('addNewPeriod', {
          address: document.getElementById('address').innerHTML,
        }, newPeriod);
      }
    }
    this.div.getElementsByTagName('button')[2].onclick = () => {
      let form = this.div.getElementsByTagName('div')[0];
      let flag = form.querySelector('[name=O]').value.length > 0 ||
                 form.querySelector('[name=P]').value.length > 0 ||
                 form.querySelector('[name=Q]').value.length > 0 ||
                 form.querySelector('[name=R]').value.length > 0;
      flag = flag && (form.querySelector('[name=company]').value.length > 0) && (form.querySelector('[name=tarif]').value.length > 0);
      if (!flag) {
        alert('Заполните все поля!');
      } else {
        // form.hidden = true;
        let newPeriod = {
          month: form.querySelector('[name=month]').value + '-' + form.querySelector('[name=year]').value,
          isBasic: form.querySelector('[name=isBasic]').value,
          shouldCount: form.querySelector('[name=shouldCount]').value,
          company: form.querySelector('[name=company]').value,
          O: form.querySelector('[name=O]').value.replace(',','.'),
          P: form.querySelector('[name=P]').value.replace(',','.'),
          Q: form.querySelector('[name=Q]').value.replace(',','.'),
          R: form.querySelector('[name=R]').value.replace(',','.'),
          tarif: form.querySelector('[name=tarif]').value,
        };

        let nextMonth = nextPeriod(newPeriod.month);

        socket.emit('addNewPeriodAndContinue', {
          address: document.getElementById('address').innerHTML,
        }, newPeriod, {
          month: nextMonth.split('-')[0],
          year: nextMonth.split('-')[1],
          tarif: newPeriod.tarif,
          sold: newPeriod.isBasic=='false' ? '10' : '20',
        });
      }
    }

  }

  hide() {
    this.div.getElementsByTagName('div')[0].hidden = true;
  }
}

function nextPeriod(period) {

  let [month, year] = period.split('-');

  switch (month) {
    case '01':
      return `02-${year}`;
    case '02':
      return `03-${year}`;
    case '03':
      return `04-${year}`;
    case '04':
      return `05-${year}`;
    case '05':
      return `10-${year}`;
    case '10':
      return `11-${year}`;
    case '11':
      return `12-${year}`;
    default:
      return `01-${(Number(year) + 1) + ''}`;
  }

}
