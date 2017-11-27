var mongoose = require('./mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var sessionStore = new MongoStore({
        // host: '127.0.0.1',
        // port: '27017',
        // db: 'session',
        url: 'mongodb://' + mongoose.connection.host+':'+mongoose.connection.port+'/'+mongoose.connection.name ,
        // url: 'mongodb://localhost:27017/start'
    });

module.exports = sessionStore;
