import React, {Component} from 'react';

function requestHeader(response) {
  return (
    <div>
      <legend>Параметры запроса</legend>
      <h4> { response.header } </h4>
      <h4>Начальный период: { response.query.startPeriod } </h4>
      <h4>Конечный период: { response.query.endPeriod } </h4>
      <h4>Метод расчета: { response.query.kotel ? 'котловой' : 'некотловой' } </h4>
      <h4>Базовые значения: { response.query.method } </h4>
      <h4>Учитывать неработающий счетчик: { response.query.useR === 'true' ? 'да' : 'нет' } </h4>
      <legend>Суммарная информация</legend>
      <h4>Суммарная экономия: { response.summary.gigsEconomy } Гкал</h4>
      <h4>Суммарная экономия: { response.summary.rublesEconomy } рублей</h4>
      <h4>Плата за энергосбережение: { response.summary.profit } рублей</h4>
      <legend>Информация по отдельным домам (нажать на дом для просмотра)</legend>
    </div>
  );
}

function periodToHTML(period) {
  return (
    <tr>
      <td>
        { period.month }
      </td>
      <td>
        { period.shouldCount ? 'Да' : 'Нет' }
      </td>
      <td>
        { period.company }
      </td>
      <td>
        { period.O ? period.O : '---' }
      </td>
      <td>
        { period.P ? period.P : '---' }
      </td>
      <td>
        { period.Q ? period.Q : '---' }
      </td>
      <td>
        { period.R ? period.R : '---' }
      </td>
    </tr>
  );
}

function oneHouseRequestResultToHTML(result, error) {
  if (!result) {
    return (
      <div>
        { error }
      </div>
    );
  }

  return (
    <div>
      <legend> { result.house.address }: {result.purposeMonth.month} </legend>
      <legend>Использованы отчетные периоды:</legend>
      <table>
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
        </tr>
        { result.basicMonths.map(month => periodToHTML(month)) }
      </table>

      <legend>Результаты энергосбережения:</legend>
      <h4>Контрольное значение потребления: { result.basicAmount.toFixed(2) } Гкал</h4>
      <h4>Отчетное значение потребления: { result.purposeAmount.toFixed(2) } Гкал</h4>

      <h4>
        Экономия составила:
        { result.gigsEconomy.toFixed(2)} Гкал /
        { result.rublesEconomy.toFixed(2) } рублей /
        { result.procentEconomy.toFixed(2) } процентов
      </h4>

      <h4>Экономия на квадратный метр: { result.economyPerMeter.toFixed(2) } рублей</h4>

      <h4>
        Итого в счет оплаты энергосбережения:
        { result.profit.toFixed(2) } рублей или
        { result.profitPerMeter.toFixed(2) } рублей/кв.м
      </h4>

      <legend>Показатели при отсутствии экономии (справочно):</legend>
      <h4> Экономия: { result.realGigsEconomy.toFixed(2) } Гкал </h4>
    </div>
  );
}

function reportView(report) {
  return (
    <div>
      <h3> { report[0].house.address } </h3>
      { report.map(period => oneHouseRequestResultToHTML(period)) }
    </div>
  );
}

function resultToHTML(response) {
  if (!response) {
    return null;
  }


  if (!response.reports || !response.reports.length) {
    return (
      <div>
        'Отсутствуют базовые данные для указанного запроса'
      </div>
    );
  }
  return (
    <div>
      { requestHeader(response) }
      { response.reports.map(report => reportView(report)) }
    </div>
  );
}

class ReportViewer extends Component {
  render() {
    const { report } = this.props;
    const reportBody = resultToHTML(report);

    return (
      <div>
        { reportBody }
      </div>
    );
  }
}

export default ReportViewer;
