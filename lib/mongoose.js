var log = require('./log')(module);
var mongoose = require('mongoose');
var config = require('../config');
var userSchema = require('../models/userSchema');
var housesSchema = require('../models/housesSchema');
var catalogueSchema = require('../models/catalogueSchema');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI || config.get('mongoose:uri'), config.get('mongoose:options'), () => {
  log.info('Connection succeed');
});

mongoose.model('users', userSchema);
mongoose.model('houses', housesSchema);
mongoose.model('catalogue', catalogueSchema);

module.exports = mongoose;
