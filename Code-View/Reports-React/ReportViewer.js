import React, {Component} from 'react';
import ReportViewerHouse from './ReportViewerHouse';

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
      { response.reports.map(report => <ReportViewerHouse report = { report } />) }
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
