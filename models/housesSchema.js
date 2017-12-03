var log = require('../lib/log')(module);
var mongoose = require('mongoose');
var util = require('util');
var AuthError = require('../error').AuthError;
var config = require('../config');

let House = {
  address: {
    type: String,
    require: true,
    unique: true,
    default: 'NoAddress',
  },
  square: {
    type: Number,
    require: true,
    default: 1000,
  },
  sameCounter: {
    type: Boolean,
    require: true,
    default: true,
  },
  basicPeriod: {
    type: String,
    require: true,
    default: '10-15:05-16/10-16:05-17',
  },
  RC1: {
    type: String,
    require: true,
    default: 'ИРЦ',
  },
  RC2: {
    type: String,
    require: true,
    default: 'ИРЦ',
  },
  tarif: {
    type: Number,
    require: true,
    default: 1800,
  },
  data: {
    type: [{
      month: {
        type: String,
        require: true,
        default: '01-15',
      },
      isBasic: {
        type: Boolean,
        require: true,
        default: true,
      },
      shouldCount: {
        type: Boolean,
        require: true,
        default: true,
      },
      company: {
        type: String,
        require: true,
        default: 'Сторм',
      },
      O: {
        type: Number,
        default: 0,
      },
      P: {
        type: Number,
        default: 0,
      },
      Q: {
        type: Number,
        default: 0,
      },
      R: {
        type: Number,
        default: 0,
      },
    }],
    require: true,
    default: [],
  },
};

let housesSchema = mongoose.Schema(House);

housesSchema.statics.addNewHouse = function(parameters, callback) {
  let House = this;
  let newHouse = new House(parameters);
  newHouse.save((err) => {
    if (err) {
      callback(false);
      log.error(err);
    } else {
      callback(true);
    }
  });
};
housesSchema.statics.findOneHouse = function(parameters, callback) {
  let House = this;
  this.findOne({address: parameters.address}, (err, house) => {
    if (err || !house) {
      log.error(err);
      callback(false);
    } else {
      callback(house);
    }
  });
};
housesSchema.statics.changeHouse = function(parameters, callback) {
  let House = this;
  this.findOne({address: parameters.address}, (err, house) => {
    if (err || !house) {
      log.error(err);
      callback(false);
      return;
    }
    Object.keys(parameters).forEach((key) => {
      house[key] = parameters[key];
    });
    house.save((err) => {
      if (err) {
        log.error(err);
        callback(false);
        return;
      }
      callback(true);
    })
  });
};
housesSchema.statics.deleteHouse = function(parameters, callback) {
  let House = this;
  this.findOne({address: parameters.address}, (err, house) => {
    if (err || !house) {
      log.error(err);
      callback(false);
      return;
    }
    house.remove((err) => {
      if (err) {
        log.error(err);
        callback(false);
        return;
      }
      callback(true);
    });
  });
};
housesSchema.statics.addNewPeriod = function(parameters, period, callback) {
  let House = this;
  this.findOne({address: parameters.address}).sort('data.month').exec((err, house) => {
    if (err || !house) {
      log.error(err);
      callback(false);
    } else {
      house.data.push(period);
      house.save((err) => {
        if (err) {
          log.error(err);
          callback(false);
        } else {
          callback(house);
        }
      });
    }
  });
}
housesSchema.statics.findHouses = function(query, callback) {
  let House = this;
  this.find(query, (err, houses) => {
    if (err || !houses.length) {
      log.error(err);
      callback(false);
    } else {
      callback(houses);
    }
  });
}



housesSchema.statics.deletePeriod = function(address, period, callback) {
  let House = this;
  this.findOne({address: address}).exec((err, house) => {
    if (err || !house) {
      log.error(err);
      callback(false);
    } else {
      house.data = house.data.filter((elem) => {
        return elem.month !== period;
      });
      house.save((err) => {
        if (err) {
          log.error(err);
          callback(false);
        } else {
          callback(house);
        }
      });
    }
  });
};

module.exports = housesSchema;
