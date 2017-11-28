var config = require('../config');
var log = require('./log')(module);
var mongoose = require('./mongoose');
var Houses = mongoose.models.houses;
var async = require('async');


module.exports.showBase = (socket) => {
  Houses.showBase((data) => {
    socket.emit('getBase', data);
  });
}

module.exports.selectHouse = (address, socket) => {
  Houses.selectHouse(address, (data) => {
    socket.emit('getHouse', data);
  });
}

module.exports.addNewHouse = (form) => {
  console.log(form);
  let address = '';
  let data = form.reduce((acc, elem) => {
    if (elem.name == 'town' ||
        elem.name == 'streetType' ||
        elem.name == 'streetName') {
          address = address + elem.value + ',';
          return acc;
        }
    if (elem.name == 'houseNumber') {
      address += elem.value;
      return acc;
    }
    acc[elem.name] = elem.value;
    return acc;
  }, {});
  data['address'] = address;
  Houses.addNewHouse(data);
}
