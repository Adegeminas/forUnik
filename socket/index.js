var log = require('../lib/log')(module);
var async = require('async');
var config = require('../config');
var util = require('util');
var connect = require('connect');
var cookie = require('cookie');
var sessionStore = require('../lib/sessionStore');
var User = require('../lib/mongoose').models.users;
var HttpError = require('../error').HttpError;
var cookieParser = require('cookie-parser');
var baseApiLogic = require('../lib/baseApiLogic');

function loadSession(sid, callback) {
  sessionStore.load(sid, function(err, session) {
    if (arguments.length == 0) {
      return callback(null, null);
    } else {
      return callback(null, session);
    }
  });
}
function loadUser(session, callback) {
  if (!session || !session.user) {
    return callback(null, null);
  }
  User.findById(session.user, function(err, user) {
    if (err) return callback(err);

    if (!user) {
      return callback(null, null);
    }
    callback(null, user);
  });
}
module.exports = function(server) {
  var io = require('socket.io').listen(server);
  let authorization = function(socket, callback) {
    async.waterfall([
      function(callback) {
        socket.handshake.cookies = cookie.parse(socket.handshake.headers.cookie || '');
        var sidCookie = socket.handshake.cookies[config.get('session:key')];
        var sid = cookieParser.signedCookie(sidCookie, config.get('session:secret'));
        loadSession(sid, callback);
      },
      function(session, callback) {
        if (!session) {
          callback(new HttpError(401, "No session"));
          return;
        }
        socket.handshake.session = session;
        loadUser(session, callback);
      },
      function(user, callback) {
        if (!user) {
          callback(new HttpError(403, "Anonymous session may not connect"));
          return;
        }

        if (socket.handshake) socket.handshake.user = user;
        callback(null);
      }
    ], function(err) {
      if (!err) {
        return callback(null, true);
      }
      if (err instanceof HttpError) {
        return callback(null, false);
      }
      callback(err);
    });
  };
  io.use(authorization);
  io.sockets.on('session:reload', function(sid) {
    var clients = io.sockets.clients();
    clients.forEach(function(client) {
      if (client.handshake.session.id != sid) return;
      loadSession(sid, function(err, session) {
        if (err) {
          client.emit("error", "server error");
          client.disconnect();
          return;
        }
        if (!session) {
          client.emit("logout");
          client.disconnect();
          return;
        }
        client.handshake.session = session;
      });
    });
  });
  io.sockets.on('connection', function(socket) {
    socket.emit('initConnection', socket.handshake);

    socket.on('addNewHouse', function(house) {
      baseApiLogic.addNewHouse(house, (result) => {
        socket.emit('addNewHouseResult', result);
      });
    });

    socket.on('deleteHouse', function(address) {
      baseApiLogic.deleteHouse(address, (result) => {
        socket.emit('findOneHouseResult', result);
      });
    });

    socket.on('editHouse', function(request, house) {
      baseApiLogic.editHouse(house.address, request, (result) => {
        socket.emit('findOneHouseResult', result);
      });
    });

    socket.on('findOneHouse', function(house) {
      baseApiLogic.findOneHouse(house, (result) => {
        socket.emit('findOneHouseResult', result);
      });
    });

    socket.on('addNewPeriod', function(house, newPeriod) {
      baseApiLogic.addNewPeriod(house, newPeriod, (result, text) => {
        socket.emit('addNewPeriodResult', [result, text]);
      });
    });

    socket.on('updatePeriod', function(address, period) {
      baseApiLogic.updatePeriod(address, period, (result, text) => {
        socket.emit('addNewPeriodResult', [result, text]);
      });
    });

    socket.on('addNewPeriodAndContinue', function(house, newPeriod, options) {
      baseApiLogic.addNewPeriod(house, newPeriod, (result, text) => {
        socket.emit('addNewPeriodResultWithContinue', [result, text, options]);
      });
    });

    socket.on('deletePeriod', function(str) {
      let [period, address] = str.split('/');
      baseApiLogic.deletePeriod(address, period, (result, text) => {
        socket.emit('addNewPeriodResult', [result, text]);
      });
    });

    socket.on('oneHouseRequest', function(request) {
      baseApiLogic.oneHouseRequest(request, (result) => {
        socket.emit('oneHouseResponse', result);
      });
    });

    socket.on('ukRequest', function(request) {
      baseApiLogic.ukRequest(request, (result) => {
        socket.emit('ukResponse', result);
      });
    });

    socket.on('allHousesRequest', function(request) {
      baseApiLogic.allHousesRequest(request, (result) => {
        socket.emit('allHousesResponse', result);
      });
    });

    socket.on('getCatalogue', function() {
      baseApiLogic.getCatalogue((result) => {
        socket.emit('getCatalogueResult', result);
      });
    });
  });
  return io;
};
