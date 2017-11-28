var log = require('../lib/log')(module);
var mongoose = require('mongoose');
var util = require('util');
var async = require('async');
var AuthError = require('../error').AuthError;
var config = require('../config');

//Город	Тип улицы	Название улицы	Номер дома	Общая площадь	Управляющая организация

let Houses = {
  address : {
    type: String,
    require: true,
    default: 'defaultAddress',
    unique: true,
  },

  square: {
    type: Number,
    require: true,
    default: 1000,
  },

  company: {
    type: String,
    require: true,
    default: 'Сторм',
  },

  basicPeriod: {
    type: String,
    require: true,
    default: '1-12-2015/1-12-2016',
  },

  data: [{
      date: {
        type: String,
        require: true,
        default: '1-2015',
      },
      wasSold: {
        type: Boolean,
        require: true,
        default: true,
      },
      wasWorking: {
        type: Boolean,
        require: true,
        default: true,
      },
      RCteplo: {
        type: String,
        require: true,
        default: 'defaultRCteplo',
      },
      RCenergo: {
        type: String,
        require: true,
        default: 'defaultRCenergo',
      },
      isCommon: {
        type: Boolean,
        require: true,
        default: true,
      },
      _O: {
        type: Number,
      },
      _P: {
        type: Number,
      },
      _Q: {
        type: Number,
      },
      _R: {
        type: Number,
      },
      cost: {
        type: Number,
        require: true,
        default: 3000,
      },
    }],
}

let housesSchema = mongoose.Schema(Houses);

housesSchema.statics.showBase = function(callback) {
  this.find((err, data) => {
    if (err) {
      log.error(err);
      log.error('Error in showBase');
      callback(null);
      return;
    }
    callback(data);
  })
};

housesSchema.statics.selectHouse = function(address, callback) {
  this.findOne({'address' : address}, (err, data) => {
    if (err) {
      log.error(err);
      log.error('Error in selectHouse');
      callback(null);
      return;
    }
    callback(data);
  })
};

housesSchema.statics.addElem = function() {
  let House = this;
  let address = Date.now().toString();
  let house = new House({address: address});

  house.save((err) => {
    if (err) {
      log.error(err);
    }
  })
};

housesSchema.statics.addNewHouse = function(data) {

  let House = this;
  let house = new House(data);

  house.save((err) => {
    if (err) {
      log.error(err);
    }
  })
};

housesSchema.post('save', function(location) {

});

module.exports = housesSchema;

// Логгируемые функции

// housesSchema.statics.adventure = function(callback, userid, activity) {
//   this.findOne({'parties.userid' : userid}, (err, location) => {
//     if (err) {
//       log.error('Some error in aventure');
//       return;
//     }
//     if (!location) {
//       log.error('error in adventure, no location');
//       return;
//     }
//     if (callback) callback(location.getNewAdventure, activity);
//   });
// }

// housesSchema.statics.addParty = function(party, x, y, z) {
//   var x = ((config.get("MAP_RADIUS") + x) % config.get("MAP_RADIUS")) || false;
//   var y = ((config.get("MAP_RADIUS") + y) % config.get("MAP_RADIUS")) || false;
//   var World = this;
//   if (!party) return;
//   if (!party.userid) return;
//   World.findOne({'x': x, 'y': y, 'z': z}, (err, location) => {
//     if (err) {
//       log.error(err);
//       return;
//     }
//     if (!location) {
//       var location = new World(new Location(x || 0, y || 0, z || 0, [new Party('npcenemy'), new Party('npcwild'), new Party('npctavern')]));
//     }
//     addLog(party, `Вы переходите в локацию ${location.info.name}`);
//     location.parties.push(party);
//     location.save((err) => {
//       if (err) log.error(err);
//     })
//   });
// }
