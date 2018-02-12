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
      tarif: {
        type: Number,
        require: true,
        default: 2000,
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

let options = {
  usePushEach: true,
};

let housesSchema = mongoose.Schema(House, options);

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
housesSchema.statics.editHouse = function(address, request, callback) {
  let House = this;
  this.findOne({address: address}, (err, house) => {
    if (err || !house) {
      log.error(err);
      callback(false);
      return;
    }
    Object.keys(request).forEach((key) => {
      house[key] = request[key];
    });
    house.save((err) => {
      if (err) {
        log.error(err);
        callback(false);
        return;
      }
      callback(house);
    });
  });
};
housesSchema.statics.deleteHouse = function(address, callback) {
  let House = this;
  this.findOne({address: address}, (err, house) => {
    if (err || !house) {
      log.error(err);
      callback(false);
      return;
    }
    house.remove((err) => {
      if (err) {
        log.error(err);
        callback(house);
        return;
      }
      callback(false);
    });
  });
};
housesSchema.statics.addNewPeriod = function(parameters, period, callback) {
  let House = this;
  this.findOne({address: parameters.address}).exec((err, house) => {
    if (err || !house) {
      log.error(err, 'Непредвиденная ошибка');
      callback(false, 'Непредвиденная ошибка');
      return;
    } else {
      let flag = true;
      house.data.forEach((data) => {
        if (data.month === period.month) {
          flag = false;
        }
      });
      if (!flag) {
        callback(false, 'Период уже существует');
        return;
      }
      house.data.push(period);
      house.save((err) => {
        if (err) {
          log.error(err);
          callback(false, 'Ошибка при сохранении периода');
          return;
        } else {
          callback(house);
        }
      });
    }
  });
};

housesSchema.statics.updatePeriod = function(address, period, callback) {
  let House = this;
  this.findOne({address: address}).exec((err, house) => {
    if (err || !house) {
      log.error(err, 'Непредвиденная ошибка');
      callback(false, 'Непредвиденная ошибка');
      return;
    } else {
      house.data = house.data.filter(e => e.month !== period.month);
      house.data.push(period);

      house.save((err) => {
        if (err) {
          log.error(err);
          callback(false, 'Ошибка при сохранении периода');
          return;
        } else {
          callback(house);
        }
      });
    }
  });
};

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
};
housesSchema.statics.deletePeriod = function(address, period, callback) {
  let House = this;
  this.findOne({address: address}).exec((err, house) => {
    if (err || !house) {
      log.error(err);
      callback(false, "Дом не найден");
    } else {
      house.data = house.data.filter((elem) => {
        return elem.month !== period;
      });
      house.save((err) => {
        if (err) {
          log.error(err);
          callback(false, 'Серверная ошибка');
        } else {
          callback(house, 'Успех');
        }
      });
    }
  });
};

module.exports = housesSchema;
