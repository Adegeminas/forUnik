class PeriodEditor {
  constructor(house, options) {
    this.options = options;
    this.house = house;
    this.div = document.createElement('div');
    this.render();
    this.initialize();
  }

  render() {
    this._renderHeader();
    this._table = this.div.getElementsByTagName('table')[0] || null;
    this.house.data.sort((a,b) => {
      return (
        (a.month.split('-')[1] > b.month.split('-')[1]) ||
        (a.month.split('-')[1] === b.month.split('-')[1] && a.month.split('-')[0] > b.month.split('-')[0])
      );
    }).forEach((period) => {
      this._renderPeriod(period, this.house);
    });
    this._periodAdder = new PeriodAdder(this.house, this.options);
    this.div.append(this._periodAdder.div);
  }

  initialize() {

  }

  _renderHeader() {
    let _header = document.createElement('div');
    let html = `
      <legend> Отчетные периоды </legend>
    `;
    if (this.house.data.length) {
      html += `
        <table>
          <tr>
            <td>
              Период
            </td>
            <td>
              Продано энергосбережение
            </td>
            <td>
              Прибор работал
            </td>
            <td>
              Управляющая компания
            </td>
            <td>
              Объём по данным РЦ без вычета ГВС
            </td>
            <td>
              Объём по данным РЦ с вычетом ГВС
            </td>
            <td>
              Объём по первичным данным ОДПУ без вычета ГВС
            </td>
            <td>
              Объём при неработающем приборе учёта
            </td>
            <td>
              Тариф
            </td>
            <td>
              Действия
            </td>
          </tr>
        </table>`;
      } else {
        html += `Отчетные периоды еще не заполнены.`;
      }
      _header.innerHTML = html;
      this.div.append(_header);
    }

  _renderPeriod(period, house) {
    let tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        ${period.month}
      </td>
      <td>
        ${period.isBasic ? 'Нет' : 'Да'}
      </td>
      <td>
        ${period.shouldCount ? 'Да' : 'Нет'}
      </td>
      <td>
        ${period.company}
      </td>
      <td>
        ${period.O ? period.O : '---'}
      </td>
      <td>
        ${period.P ? period.P : '---'}
      </td>
      <td>
        ${period.Q ? period.Q : '---'}
      </td>
      <td>
        ${period.R ? period.R : '---'}
      </td>
      <td>
        ${period.tarif}
      </td>
      <td>
        <button id = '${period.month}/${house.address}' type="button" onclick="
          socket.emit('deletePeriod', this.id);
        ">Удалить</button>
      </td>`;
    this._table.append(tr);
  }
}
