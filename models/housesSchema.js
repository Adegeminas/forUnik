var log = require('../lib/log')(module);
var mongoose = require('mongoose');
var util = require('util');
var async = require('async');
var AuthError = require('../error').AuthError;
var config = require('../config');

let Houses = {
  x : {
    type: Number,
    require: true,
  },

  img: String,

  getNewAdventure: {
    type: {},
    get: function() {
      return 0;
    },
  },
}

let housesSchema = mongoose.Schema(Houses);

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
