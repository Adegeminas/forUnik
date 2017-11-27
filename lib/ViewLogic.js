var config = require('../config');
var log = require('./log')(module);
var mongoose = require('./mongoose');
var World = mongoose.models.world;
var User = mongoose.models.players;

const radius = config.get("MAP_RADIUS");

module.exports.getInventoryRequest = (socket, charName) => {
  var username = socket.handshake.user.id;
  World.findOne({'parties.userid' : username}, (err, location) => {
    if (err) {
      log.error(err);
      return;
    }
    if (!location) {
      return;
    }
    let charitems, partyitems, itemFormula;
    location.parties.filter((party) => {
      if (party.userid == username) {
        partyitems = party.items;
        party.chars.filter((char) => {
          if (char.name == charName) {
            charitems = char.items;
            itemFormula = char.itemFormula;
          }
          return false;
        });
      }
      return false;
    });

    socket.emit('getInventoryResponse', [partyitems, charitems, charName, itemFormula]);
  });
}
module.exports.getSkillsRequest = (socket, charName) => {
  var username = socket.handshake.user.id;
  World.findOne({'parties.userid' : username}, (err, location) => {
    if (err) {
      log.error(err);
      return;
    }
    if (!location) {
      return;
    }
    let resChar = false;
    location.parties.filter((party) => {
      if (party.userid == username) {
        party.chars.filter((char) => {
          if (char.name == charName) {
            resChar = char;
          }
          return false;
        });
      }
      return false;
    });
    if (resChar) socket.emit('getSkillsResponse', resChar);
  });
}
module.exports.getUpdateRequest = (socket) => {
  var username = socket.handshake.user.id;
  World.findOne({'parties.userid' : username}, (err, location) => {
    if (err) {
      log.error(err);
      return;
    }
    if (location) {
      var x = location.x;
      var y = location.y;
      var z = location.z;
    } else {
      return;
    }
    World.find()
    .where('x').in([x, (x + 1 + radius) % radius, (x - 1 + radius) % radius])
    .where('y').in([y, (y + 1 + radius) % radius, (y - 1 + radius) % radius])
    .where('z').equals(z)
    .exec((err, locations) => {
      if (err) log.error(err);

      var obj = {};

      locations.filter((location) => {

        let x0 = (location.x + radius - x) % radius;
        let y0 = (location.y + radius - y) % radius;

        if (x0 === radius - 1) x0 = -1;
        if (y0 === radius - 1) y0 = -1;


        obj[`${x0}, ${y0}`] = location;
      });
      socket.emit('getUpdateResponse', JSON.stringify(obj));
    })
  })
};
