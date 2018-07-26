const mongoose = require('./mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const sessionStore = new MongoStore({
  url: process.env.MONGODB_URI
});

module.exports = sessionStore;
