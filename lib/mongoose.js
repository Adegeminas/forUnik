var log = require('./log')(module);
var mongoose = require('mongoose');
var config = require('../config');
var userSchema = require('../models/userSchema');
var housesSchema = require('../models/housesSchema');
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI || config.get('mongoose:uri'), config.get('mongoose:options'), () => {
  log.info('Connection succeed');
});

mongoose.model('users', userSchema);
mongoose.model('houses', housesSchema);

module.exports = mongoose;
