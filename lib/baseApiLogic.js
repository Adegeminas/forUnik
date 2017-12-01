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
