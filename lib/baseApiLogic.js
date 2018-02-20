const mongoose = require('./mongoose');
const Houses = mongoose.models.houses;
const Catalogue = mongoose.models.catalogue;
const proceedRequest = require('./reportLogic');

module.exports.createHouse = (house, callback) => {
  Houses.createHouse(house, callback);
  Catalogue.addNewStreet(house.address.split(',')[2]);
};
module.exports.deleteHouse = (address, callback) => {
  Houses.deleteHouse(address, callback);
};

module.exports.updateHouse = (address, request, callback) => {
  Houses.updateHouse(address, request, callback);
};

module.exports.readHouse = (house, callback) => {
  Houses.readHouse(house, callback);
};

module.exports.createPeriod = (house, period, callback) => {
  Houses.createPeriod(house, period, callback);
  Catalogue.addCompany(period.company);
};

module.exports.updatePeriod = (address, period, callback) => {
  Houses.updatePeriod(address, period, callback);
};

module.exports.deletePeriod = (address, period, callback) => {
  Houses.deletePeriod(address, period, callback);
};

module.exports.oneHouseRequest = (request, callback) => {
  Houses.findHouses({address: request.address}, (houses) => {
    proceedRequest(houses, request, callback);
  });
};

module.exports.ukRequest = (request, callback) => {
  Houses.findHouses({}, (houses) => {
    proceedRequest(houses, request, callback);
  });
};

module.exports.allHousesRequest = (request, callback) => {
  Houses.findHouses({}, (houses) => {
    proceedRequest(houses, request, callback);
  });
};

module.exports.getCatalogue = (callback) => {
  Catalogue.get(callback);
};
