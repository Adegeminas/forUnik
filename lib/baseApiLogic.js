var config = require('../config');
var log = require('./log')(module);
var mongoose = require('./mongoose');
var Houses = mongoose.models.houses;
var async = require('async');

module.exports.addNewHouse = (house, callback) => {
  Houses.addNewHouse(house, callback);
}

module.exports.findOneHouse = (house, callback) => {
  Houses.findOneHouse(house, callback);
}

module.exports.addNewPeriod = (house, period, callback) => {
  Houses.addNewPeriod(house, period, callback);
}

module.exports.deletePeriod = (address, period, callback) => {
  Houses.deletePeriod(address, period, callback);
}

module.exports.oneHouseRequest = (request, callback) => {
  let query = {address: request.address};
  Houses.findHouses(query, (houses) => {
    exec(houses, request, callback);
  });
}

module.exports.ukRequest = (request, callback) => {
  let query = {};
  Houses.findHouses(query, (houses) => {
    exec(houses, request, callback);
  });
}

module.exports.allHousesRequest = (request, callback) => {
  let query = {};
  Houses.findHouses(query, (houses) => {
    exec(houses, request, callback);
  });
}


function getPeriods(start, end) {
  let periods = [];

  let curPeriod = start;
  while (smallerPeriod(curPeriod, end)) {
    periods.push(curPeriod);
    curPeriod = nextPeriod(curPeriod);
  }

  return periods;
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
function smallerPeriod(a, b) {
  let [aMonth, aYear] = a.split('-');
  let [bMonth, bYear] = b.split('-');

  if (aYear < bYear) {
    return true;
  } else {
    return (aMonth <= bMonth);
  }
}
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
    let response = {};
    let purposeMonth = null;
    let basicMonths = house.data.filter((period) => {
      if (period.month === purposePeriod && !period.isBasic) {
        purposeMonth = period;
        return false;
      }
      if (request.useR === 'false' && !period.shouldCount) {
        return false;
      }
      return ((period.month.split('-')[0] === purposePeriod.split('-')[0]) && period.isBasic);
    });

    if (request.company && purposeMonth) {
      if (purposeMonth.company !== request.company) {
        purposeMonth = null;
      }
    }

    if (!purposeMonth) {
      response.success = false;
      result.push(response);
      return;
    }

    let basicAmount = null;

    if (house.sameCounter) {

      if (request.kotel === 'true') {
        let temp = basicMonths.reduce((acc, month) => {
          let basicMonthCount = null;
          if (request.method === 'РЦ') {
            basicMonthCount = month.O || (request.useR === 'true' && month.R);
          } else {
            basicMonthCount = month.Q || (request.useR === 'true' && month.R);
          }
          if (basicMonthCount) {
            acc[0] += basicMonthCount;
            acc[1] ++;
          }
          return acc;
        }, [0, 0]);

        basicAmount = temp[1] ? temp[0]/temp[1] : null;
      } else {
        let temp = basicMonths.reduce((acc, month) => {
          let basicMonthCount = null;

          basicMonthCount = month.P || (request.useR === 'true' && month.R);

          if (basicMonthCount) {
            acc[0] += basicMonthCount;
            acc[1] ++;
          }
          return acc;
        }, [0, 0]);

        basicAmount = temp[1] ? temp[0]/temp[1] : null;
      }

    } else {

      let temp = basicMonths.reduce((acc, month) => {
        let basicMonthCount = null;
        if (request.method === 'РЦ') {
          basicMonthCount = (month.O || month.P) || (request.useR === 'true' && month.R);
        } else {
          basicMonthCount = month.Q || (request.useR === 'true' && month.R);
        }
        if (basicMonthCount) {
          acc[0] += basicMonthCount;
          acc[1] ++;
        }
        return acc;
      }, [0, 0]);

      basicAmount = temp[1] ? temp[0]/temp[1] : null;
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
            purposeAmount = purposeMonth.O || (request.useR === 'true' && purposeMonth.R);
          } else {
            purposeAmount = purposeMonth.Q || (request.useR === 'true' && purposeMonth.R);
          }
      } else {
          purposeAmount = purposeMonth.P || (request.useR === 'true' && purposeMonth.R);
      }
    } else {
        if (request.method === 'РЦ') {
          purposeAmount = (purposeMonth.O || purposeMonth.P) || (request.useR === 'true' && purposeMonth.R);
        } else {
          purposeAmount = purposeMonth.Q || (request.useR === 'true' && purposeMonth.R);
        }
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
                            basicAmount - response.purposeAmount :
                            0;
    response.procentEconomy = (basicAmount - response.purposeAmount) / basicAmount > 0.05 ?
                            100 * (basicAmount - response.purposeAmount) / basicAmount :
                            0;
    response.rublesEconomy = response.gigsEconomy * house.tarif;
    response.economyPerMeter = response.rublesEconomy / house.square;
    response.profit = response.rublesEconomy / 2;
    response.profitPerMeter = response.profit / house.square;


    response.realGigsEconomy = basicAmount - response.purposeAmount;
    response.realRublesEconomy = response.realGigsEconomy * house.tarif;
    response.realEconomyPerMeter = response.realRublesEconomy / house.square;

    response.success = true;
    result.push(response);
  });

  return result;
};

function exec(houses, request, callback) {

  let response = {
    reports: [],
  };

  for (var i = 0; i < houses.length; i++) {
    let curHouseResponse = getResultforHouse(houses[i], request).filter((period) => {
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

  callback(response);
}
