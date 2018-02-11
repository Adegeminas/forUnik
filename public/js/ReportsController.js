let controller = {
  catalogue: {

  },
  updateCatalogue: function() {
    cataloger.render(this.catalogue);
  }
};

cataloger = new Cataloger(document.getElementById('catalogue', {}, controller));

var socket = io.connect();
socket
    .on('connect', function() {
      socket.emit('getCatalogue');
    })
    .on('initConnection', (handshake) => {
      socket.handshake = handshake;
      if (!socket.handshake.user) {

        location.href = "/";
        return;
      }
    })
    .on('disconnect', function() {
      location.href = "/";
     })
    .on('logout', function(text) {
      if (text) alert(text);
      location.href = "/";
    })
    .on('error', function(reason) {
      if (reason == "handshake unauthorized") {
        alert("вы вышли из сайта");
      } else {
        setTimeout(function() {
          socket.socket.connect();
        }, 500);
      }
    })
    .on('oneHouseResponse', function(result) {
      resultToHTML(result);
    })
    .on('ukResponse', function(result) {
      resultToHTML(result);
    })
    .on('allHousesResponse', function(result) {
      resultToHTML(result);
    })
    .on('getCatalogueResult', function(catalogue) {
      controller.catalogue = catalogue;
      controller.updateCatalogue();
    });

let oneHouseRequestResultToHTML = function (result, error) {
if (!result) {
  return error;
}
let html = '';
html += `<legend>${result.house.address}: <i style="color:blue">${result.purposeMonth.month}</i></legend>`;
html += `<legend>Использованы отчетные периоды:</legend>`;
html += `<table>
          <tr>
            <td>
              Период
            </td>
            <td>
              Прибор работал
            </td>
            <td>
              УК
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
          </tr>`;

result.basicMonths.forEach((month) => {
  html += periodToHTML(month);
});

html += '</table><br>';
html += `<legend>Результаты энергосбережения:</legend>`;
html += `<h4>Контрольное значение потребления: ${result.basicAmount.toFixed(2)} Гкал</h4>`;
html += `<h4>Отчетное значение потребления: ${result.purposeAmount.toFixed(2)} Гкал</h4>`;
html += `<h4>Экономия составила: ${result.gigsEconomy.toFixed(2)} Гкал / ${result.rublesEconomy.toFixed(2)} рублей / ${result.procentEconomy.toFixed(2)}%</h4>`;
html += `<h4>Экономия на квадратный метр: ${result.economyPerMeter.toFixed(2)} рублей</h4>`;
html += `<h4>Итого в счет оплаты энергосбережения: ${result.profit.toFixed(2)} рублей или ${result.profitPerMeter.toFixed(2)} рублей/кв.м</h4>`;

html += `<legend>Показатели при отсутствии экономии (справочно):</legend>`;
html += `<h4>Экономия: ${result.realGigsEconomy.toFixed(2)} Гкал</h4>`;

return html;
}

function periodToHTML(period) {
    let html = '';
    html += `
        <tr>
          <td>
            ${period.month}
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
        </tr>
    `;
    return html;
  }

function requestHeader(response) {
let html = '';

html += `
  <legend>Параметры запроса</legend>

  <h4 style="color: blue">${response.header}<h4>

  <h4>Начальный период: ${response.query.startPeriod}<h4>
  <h4>Конечный период: ${response.query.endPeriod}<h4>
  <h4>Метод расчета: ${response.query.kotel ? 'котловой' : 'некотловой'}<h4>
  <h4>Базовые значения: ${response.query.method}<h4>
  <h4>Учитывать неработающий счетчик: ${response.query.useR == 'true' ? 'да' : 'нет'}<h4>

  <legend>Суммарная информация</legend>

  <h4>Суммарная экономия: ${response.summary.gigsEconomy} Гкал<h4>
  <h4>Суммарная экономия: ${response.summary.rublesEconomy} рублей<h4>
  <h4>Плата за энергосбережение: ${response.summary.profit} рублей<h4>

  <legend>Информация по отдельным домам (нажать на дом для просмотра)</legend>
`;

return html;
}

function resultToHTML(response) {
  let resultDiv = document.getElementById('resultDiv');

  if (!response.reports.length) {
    resultDiv.innerHTML = 'Отсутствуют базовые данные для указанного запроса';
    return;
  }

  resultDiv.innerHTML = requestHeader(response);

  response.reports.forEach((report) => {
      let ul = document.createElement('ul');
      ul.innerHTML = `<h3>${report[0].house.address}</h3>`;
      ul.onclick = function() {
        if (this.style.border) {
          this.style.border = '';
        } else {
          this.style.border = '1px solid red';
        }
        this.childNodes.forEach((node) => {
          node.hidden = !node.hidden;
        })
      };
      report.forEach((period) => {
        let li = document.createElement('li');
        li.hidden = 'true';
        li.innerHTML = oneHouseRequestResultToHTML(period);
        ul.append(li);
      });
      resultDiv.append(ul);
  });
}
