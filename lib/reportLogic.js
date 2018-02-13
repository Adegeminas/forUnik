function nextPeriod(period) {
  const [month, year] = period.split('-');

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

function smallerPeriod(a, b) {
  if (a === b) return true;

  const [aMonth, aYear] = a.split('-');
  const [bMonth, bYear] = b.split('-');

  if (aYear < bYear) {
    return true;
  }

  return (aMonth < bMonth);
}

function getPeriods(start, end) {
  const periods = [];
  let curPeriod = start;

  while (smallerPeriod(curPeriod, end)) {
    periods.push(curPeriod);
    curPeriod = nextPeriod(curPeriod);
  }

  return periods;
}

module.exports = function proceedRequest(houses, request, callback) {
  const response = {
    reports: []
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

  callback(response);
};

function getResultforHouse(house, request) {
  let result = [];

  if (!house) {
    result = false;
    return result;
  }

  if (!house.sameCounter) {
    request.kotel = false;
  }

  request.periods = getPeriods(request.startPeriod, request.endPeriod);

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
      case '2015,2016,2017':
        basicMonths = basicMonths.filter(period => {
          return period.month.split('-')[1] === '2015' ||
                 period.month.split('-')[1] === '2016' ||
                 period.month.split('-')[1] === '2017';
        });
        break;
      default:
    }

    let basicAmount = null;

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
          }
          return acc;
        }, [0, 0]);

        basicAmount = temp[1] ? temp[0] / temp[1] : null;
      }
    } else {
      const temp = basicMonths.reduce((acc, month) => {
        let basicMonthCount = null;

        if (request.method === 'РЦ') {
          basicMonthCount = (month.O || month.P) || month.Q || (request.useR === 'true' && month.R);
        } else {
          basicMonthCount = month.Q ||  (month.O || month.P) || (request.useR === 'true' && month.R);
        }
        if (basicMonthCount) {
          acc[0] += basicMonthCount;
          acc[1]++;
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

    if (house.sameCounter) {
      if (request.kotel) {
        if (request.method === 'РЦ') {
          purposeAmount = purposeMonth.O || purposeMonth.Q || (request.useR === 'true' && purposeMonth.R);
        } else {
          purposeAmount = purposeMonth.Q || purposeMonth.O || (request.useR === 'true' && purposeMonth.R);
        }
      } else {
        purposeAmount = purposeMonth.P || purposeMonth.O || purposeMonth.Q || (request.useR === 'true' && purposeMonth.R);
      }
    } else if (request.method === 'РЦ') {
      purposeAmount = (purposeMonth.O || purposeMonth.P) || purposeMonth.Q || (request.useR === 'true' && purposeMonth.R);
    } else {
      purposeAmount = purposeMonth.Q || purposeMonth.O || purposeMonth.P || (request.useR === 'true' && purposeMonth.R);
    }

    if (!purposeAmount) {
      response.success = false;
      result.push(response);
      return;
    }

    response.house = house;
    response.request = request;
    response.basicMonths = basicMonths;
    response.basicAmount = basicAmount;
    response.purposeMonth = purposeMonth;
    response.purposeAmount = purposeAmount;
    response.gigsEconomy = (basicAmount - response.purposeAmount) / basicAmount > 0.05 ?
      basicAmount - response.purposeAmount : 0;
    response.procentEconomy = (basicAmount - response.purposeAmount) / basicAmount > 0.05 ?
      100 * (basicAmount - response.purposeAmount) / basicAmount : 0;
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
