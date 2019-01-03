const fs = require('fs');

function getMonthName(month) {
  switch (month.split('-')[0]) {
    case '01': return 'январь';
    case '02': return 'февраль';
    case '03': return 'март';
    case '04': return 'апрель';
    case '05': return 'май';
    case '10': return 'октябрь';
    case '11': return 'ноябрь';
    default: return 'декабрь';
  }
}

function getPeriodAfterThat(period) {
  const [month, year] = period.split('-');

  switch (month) {
    case '01': return `02-${year}`;
    case '02': return `03-${year}`;
    case '03': return `04-${year}`;
    case '04': return `05-${year}`;
    case '05': return `10-${year}`;
    case '10': return `11-${year}`;
    case '11': return `12-${year}`;
    default: return `01-${(Number(year) + 1) + ''}`;
  }
}

function isErlier(a, b) {
  if (a === b) return true;

  const [aMonth, aYear] = a.split('-');
  const [bMonth, bYear] = b.split('-');

  if (aYear < bYear) {
    return true;
  }

  return (aYear === bYear) && (aMonth < bMonth);
}

function getPeriodsArrayFromInterval(start, end) {
  const periods = [];
  let curPeriod = start;

  while (isErlier(curPeriod, end)) {
    periods.push(curPeriod);
    curPeriod = getPeriodAfterThat(curPeriod);
  }

  return periods;
}

module.exports = function proceedRequest(houses, request, callback) {
  const response = {
    reports: [],
    fileName: null
  };

  for (let i = 0; i < houses.length; i++) {
    const curHouseResponse = getResultforHouse(houses[i], request).filter((period) => {
      return period.success;
    });

    response.reports.push(curHouseResponse);
  }

  response.reports = response.reports.filter((report) => {
    return (report.length > 0);
  });

  response.query = request;
  response.summary = {};
  response.summary.gigsEconomy = response.reports.reduce((acc, house) => {
    return acc + house.reduce((abb, month) => {
      return abb + month.gigsEconomy;
    }, 0);
  }, 0).toFixed(2);
  response.summary.rublesEconomy = response.reports.reduce((acc, house) => {
    return acc + house.reduce((abb, month) => {
      return abb + month.rublesEconomy;
    }, 0);
  }, 0).toFixed(2);
  response.summary.profit = response.summary.rublesEconomy / 2;
  response.header = request.header;

  const fileName = Date.now().toString() + '.csv';
  let fileBody = 'Адрес;' +
    'период;' +
    'контрольное_значение_гиг;' +
    'реальное_значение_гиг;' +
    'экономия_в_гигах;' +
    'экономия_в_процентах;' +
    'экономия_в_рублях;' +
    'экономия_на_метр;' +
    'плата_за_услуги_всего;' +
    'плата_за_услуги_на_метр;' +
    'контрольные_показания' + '\r\n \r\n';

  fileBody += response.reports.reduce((acc, house) => {
    return acc + house.reduce((acc2, period) => {
      return acc2 +
        period.house.address + ';' +
        getMonthName(period.purposeMonth.month) + ';' +
        period.basicAmount.toFixed(2) + ';' +
        period.purposeAmount.toFixed(2) + ';' +
        period.gigsEconomy.toFixed(2) + ';' +
        period.procentEconomy.toFixed(2) + ';' +
        period.rublesEconomy.toFixed(2) + ';' +
        period.economyPerMeter.toFixed(2) + ';' +
        period.profit.toFixed(2) + ';' +
        period.profitPerMeter.toFixed(2) + ';' +
        Object.keys(period.basicMonthDetails).map(key => key + ':' + period.basicMonthDetails[key])
         + '\r\n';
    }, '') + '\r\n';
  }, '');


  fs.writeFile('public/reports/' + fileName, fileBody, 'utf8', (err) => {
    if (err) {
      console.log(err);
      callback(response);
      return;
    }
    response.fileName = '/reports/' + fileName;
    callback(response);
  });
};

function getResultforHouse(house, _request) {
  let result = [];
  let request = Object.assign({}, _request);

  if (!house) {
    result = false;
    return result;
  }

  if (!house.sameCounter) {
    request.kotel = 'false';
  }

  request.periods = getPeriodsArrayFromInterval(request.startPeriod, request.endPeriod);

  request.periods.forEach((purposePeriod) => {
    const response = {};
    let purposeMonth = null;

    let basicMonths = house.data.
      filter((period) => { // выкидываем лишние месяцы
        return ((period.month.split('-')[0] === purposePeriod.split('-')[0]));
      }).
      filter((period) => { // выкидываем сам месяц
        if (period.month === purposePeriod && !period.savingWasntSold) {
          purposeMonth = period;
          return false;
        }
        return true;
      }).
      filter((period) => { // выкидываем по запросу
        if (request.useR === 'false' && !period.shouldCount) {
          return false;
        }
        return true;
      });

    if (request.company && purposeMonth) {
      if (purposeMonth.company !== request.company) {
        purposeMonth = null;
      }
    }

    if (!purposeMonth) {
      response.success = false; // здесь можно вписать ошибку
      result.push(response);
      return;
    }

    switch (purposeMonth.basicMonths) {
      case 'Предыдущий год':
        basicMonths = basicMonths.filter(period => {
          return Number(period.month.split('-')[1]) + 1 === Number(purposePeriod.split('-')[1]);
        });
        break;
      case 'Предыдущие 2 года':
        basicMonths = basicMonths.filter(period => {
          return Number(period.month.split('-')[1]) + 1 === Number(purposePeriod.split('-')[1]) ||
                 Number(period.month.split('-')[1]) + 2 === Number(purposePeriod.split('-')[1]);
        });
        break;
      case 'Предыдущие 3 года':
        basicMonths = basicMonths.filter(period => {
          return Number(period.month.split('-')[1]) + 1 === Number(purposePeriod.split('-')[1]) ||
                 Number(period.month.split('-')[1]) + 2 === Number(purposePeriod.split('-')[1]) ||
                 Number(period.month.split('-')[1]) + 3 === Number(purposePeriod.split('-')[1]);
        });
        break;
      case '2015':
        basicMonths = basicMonths.filter(period => {
          return period.month.split('-')[1] === '2015';
        });
        break;
      case '2016':
        basicMonths = basicMonths.filter(period => {
          return period.month.split('-')[1] === '2016';
        });
        break;
      case '2017':
        basicMonths = basicMonths.filter(period => {
          return period.month.split('-')[1] === '2017';
        });
        break;
      case '2018':
        basicMonths = basicMonths.filter(period => {
          return period.month.split('-')[1] === '2018';
        });
        break;
      case '2015,2016':
        basicMonths = basicMonths.filter(period => {
          return period.month.split('-')[1] === '2015' ||
                 period.month.split('-')[1] === '2016';
        });
        break;
      case '2016,2017':
        basicMonths = basicMonths.filter(period => {
          return period.month.split('-')[1] === '2016' ||
                 period.month.split('-')[1] === '2017';
        });
        break;
      case '2017,2018':
        basicMonths = basicMonths.filter(period => {
          return period.month.split('-')[1] === '2017' ||
                 period.month.split('-')[1] === '2018';
        });
        break;
      case '2015,2016,2017':
        basicMonths = basicMonths.filter(period => {
          return period.month.split('-')[1] === '2015' ||
                 period.month.split('-')[1] === '2016' ||
                 period.month.split('-')[1] === '2017';
        });
        break;
      case '2016,2017,2018':
        basicMonths = basicMonths.filter(period => {
          return period.month.split('-')[1] === '2016' ||
                 period.month.split('-')[1] === '2017' ||
                 period.month.split('-')[1] === '2018';
        });
        break;
      case '2015,2016,2017,2018':
        basicMonths = basicMonths.filter(period => {
          return period.month.split('-')[1] === '2015' ||
                 period.month.split('-')[1] === '2016' ||
                 period.month.split('-')[1] === '2017' ||
                 period.month.split('-')[1] === '2018';
        });
        break;
      default:
    }

    let basicAmount = null;
    let basicMonthDetails = {};

    if (house.sameCounter) {
      if (request.kotel === 'true') {
        const temp = basicMonths.reduce((acc, month) => {
          let basicMonthCount = null;

          if (request.method === 'РЦ') {
            basicMonthCount = month.O || month.Q || (request.useR === 'true' && month.R);
          } else {
            basicMonthCount = month.Q || month.O || (request.useR === 'true' && month.R);
          }
          if (basicMonthCount) {
            acc[0] += basicMonthCount;
            acc[1]++;
            basicMonthDetails[month.month] = basicMonthCount;
          }
          return acc;
        }, [0, 0]);

        basicAmount = temp[1] ? temp[0] / temp[1] : null;
      } else {
        const temp = basicMonths.reduce((acc, month) => {
          let basicMonthCount = null;

          basicMonthCount = month.P || month.Q || month.O || (request.useR === 'true' && month.R);

          if (basicMonthCount) {
            acc[0] += basicMonthCount;
            acc[1]++;
            basicMonthDetails[month.month] = basicMonthCount;
          }
          return acc;
        }, [0, 0]);

        basicAmount = temp[1] ? temp[0] / temp[1] : null;
      }
    } else {
      const temp = basicMonths.reduce((acc, month) => {
        let basicMonthCount = null;

        if (request.kotel === 'true') {
          if (request.method === 'РЦ') {
            basicMonthCount = month.O || month.Q || (request.useR === 'true' && month.R);
          } else {
            basicMonthCount = month.Q || month.O || (request.useR === 'true' && month.R);
          }
        } else {
          if (request.method === 'РЦ') {
            basicMonthCount = (month.P || month.O) || month.Q || (request.useR === 'true' && month.R);
          } else {
            basicMonthCount = month.Q ||  (month.P || month.O) || (request.useR === 'true' && month.R);
          }
        }

        if (basicMonthCount) {
          acc[0] += basicMonthCount;
          acc[1]++;
          basicMonthDetails[month.month] = basicMonthCount;
        }
        return acc;
      }, [0, 0]);

      basicAmount = temp[1] ? temp[0] / temp[1] : null;
    }

    if (!basicAmount) {
      response.success = false;
      result.push(response);
      return;
    }

    let purposeAmount = null;


    purposeAmount = (house.sameCounter)
      ? (request.kotel === 'true')
        ? (request.method === 'РЦ')
          ? purposeMonth.O || purposeMonth.Q || (request.useR === 'true' && purposeMonth.R)
          : purposeMonth.Q || purposeMonth.O || (request.useR === 'true' && purposeMonth.R)
        : purposeMonth.P || purposeMonth.O || purposeMonth.Q || (request.useR === 'true' && purposeMonth.R)

      : (request.method === 'РЦ')
        ? (purposeMonth.P || purposeMonth.O) || purposeMonth.Q || (request.useR === 'true' && purposeMonth.R)
        : purposeMonth.Q || (purposeMonth.P || purposeMonth.O) || (request.useR === 'true' && purposeMonth.R);

    if (!purposeAmount) {
      response.success = false;
      result.push(response);
      return;
    }

    response.house = house;
    response.request = request;
    response.basicMonths = basicMonths;
    response.basicMonthDetails = basicMonthDetails;
    response.basicAmount = basicAmount;
    response.purposeMonth = purposeMonth;
    response.purposeAmount = purposeAmount;
    response.gigsEconomy = (basicAmount - response.purposeAmount) / basicAmount > 0.05 ?
      basicAmount - response.purposeAmount : 0;
    response.procentEconomy = (basicAmount - response.purposeAmount) / basicAmount > 0.05 ?
      (100 * (basicAmount - response.purposeAmount) / basicAmount) : 0;
    response.rublesEconomy = response.gigsEconomy * response.purposeMonth.tarif;
    response.economyPerMeter = response.rublesEconomy / house.square;
    response.profit = response.rublesEconomy / 2;
    response.profitPerMeter = response.profit / house.square;

    response.realGigsEconomy = basicAmount - response.purposeAmount;
    response.realRublesEconomy = response.realGigsEconomy * response.purposeMonth.tarif;
    response.realEconomyPerMeter = response.realRublesEconomy / house.square;

    response.success = true;
    result.push(response);
  });

  return result;
}
