const async = require('async');
const config = require('../config');
const cookie = require('cookie');
const sessionStore = require('../lib/sessionStore');
const User = require('../lib/mongoose').models.users;
const HttpError = require('../error').HttpError;
const cookieParser = require('cookie-parser');
const baseApiLogic = require('../lib/baseApiLogic');

function loadSession(sid, callback) {
  sessionStore.load(sid, function (err, session) {
    if (err) {
      console.log(err);
    }
    if (arguments.length === 0) {
      return callback(null, null);
    }
    return callback(null, session);
  });
}

function loadUser(session, callback) {
  if (!session || !session.user) {
    return callback(null, null);
  }
  User.findById(session.user, function (err, user) {
    if (err) return callback(err);

    if (!user) {
      return callback(null, null);
    }
    callback(null, user);
  });
}

function authorization(socket, callback) {
  async.waterfall([
    function (_callback) {
      socket.handshake.cookies = cookie.parse(socket.handshake.headers.cookie || '');

      const sidCookie = socket.handshake.cookies[config.get('session:key')];
      const sid = cookieParser.signedCookie(sidCookie, config.get('session:secret'));

      loadSession(sid, _callback);
    },
    function (session, _callback) {
      if (!session) {
        callback(new HttpError(401, 'No session'));
        return;
      }
      socket.handshake.session = session;
      loadUser(session, _callback);
    },
    function (user, _callback) {
      if (!user) {
        _callback(new HttpError(403, 'Anonymous session may not connect'));
        return;
      }

      if (socket.handshake) socket.handshake.user = user;
      _callback(null);
    }
  ], function (err) {
    if (!err) {
      return callback(null, true);
    }
    if (err instanceof HttpError) {
      return callback(null, false);
    }
    callback(err);
  });
}

module.exports = function (server) {
  const io = require('socket.io').listen(server);

  io.use(authorization);
  io.sockets.on('session:reload', function (sid) {
    const clients = io.sockets.clients();

    clients.forEach(function (client) {
      if (client.handshake.session.id !== sid) return;
      loadSession(sid, function (err, session) {
        if (err) {
          client.emit('error', 'server error');
          client.disconnect();
          return;
        }
        if (!session) {
          client.emit('logout');
          client.disconnect();
          return;
        }
        client.handshake.session = session;
      });
    });
  });
  io.sockets.on('connection', function (socket) {
    socket.emit('initConnection', socket.handshake);

    // LIBS REQUEST

    socket.on('getCatalogue', function () {
      baseApiLogic.getCatalogue((result) => {
        socket.emit('getCatalogueResult', result);
      });
    });

    // CRUD HOUSE

    socket.on('createHouse', function (house) {
      baseApiLogic.createHouse(house, (result) => {
        socket.emit('createHouseResult', result);
      });
    });

    socket.on('readHouse', function (house) {
      baseApiLogic.readHouse(house, (result) => {
        socket.emit('readHouseResult', result);
      });
    });

    socket.on('updateHouse', function (request, house) {
      baseApiLogic.updateHouse(house.address, request, (result) => {
        socket.emit('readHouseResult', result);
      });
    });

    socket.on('deleteHouse', function (address) {
      baseApiLogic.deleteHouse(address, (result) => {
        socket.emit('readHouseResult', result);
      });
    });

    // CRUD PERIOD

    socket.on('createPeriod', function (house, newPeriod) {
      baseApiLogic.createPeriod(house, newPeriod, (result, text) => {
        socket.emit('createPeriodResult', [result, text]);
      });
    });

    socket.on('updatePeriod', function (address, newPeriod) {
      baseApiLogic.updatePeriod(address, newPeriod, (result, text) => {
        socket.emit('createPeriodResult', [result, text]);
      });
    });

    socket.on('deletePeriod', function (str) {
      const [period, address] = str.split('/');

      baseApiLogic.deletePeriod(address, period, (result, text) => {
        socket.emit('createPeriodResult', [result, text]);
      });
    });

    // REPORTS REQUEST

    socket.on('oneHouseRequest', function (request) {
      baseApiLogic.oneHouseRequest(request, (result) => {
        socket.emit('oneHouseResponse', result);
      });
    });

    socket.on('ukRequest', function (request) {
      baseApiLogic.ukRequest(request, (result) => {
        socket.emit('ukResponse', result);
      });
    });

    socket.on('allHousesRequest', function (request) {
      baseApiLogic.allHousesRequest(request, (result) => {
        socket.emit('allHousesResponse', result);
      });
    });
  });
  return io;
};
