var log = require('../lib/log')(module);
var mongoose = require('mongoose');
var crypto = require('crypto');
var util = require('util');
var async = require('async');
var AuthError = require('../error').AuthError;

let User = {
  username: {
    type: String,
    unique: true,
    required: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  }
};

let userSchema = mongoose.Schema(User);

userSchema.methods.encryptPassword = function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

userSchema.virtual('password')
  .set(function(password) {
    this._plainPassword = password;
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() { return this._plainPassword; });

userSchema.methods.checkPassword = function(password) {
  return this.encryptPassword(password) === this.hashedPassword;
};

userSchema.statics.authorize = function(username, password, callback) {
  var userSchema = this;

  async.waterfall([
    function(callback) {
      userSchema.findOne({username: username}, callback);
    },
    function(user, callback) {
      if (user) {
        if (user.checkPassword(password)) {
          log.info(user.id + ' connected ' + new Date());
          callback(null, user);
        } else {
          callback(new AuthError("Пароль неверен"));
        }
      } else {
        var user = new userSchema({username: username, password: password, salt: Math.random() + ''});
        user.save(function(err) {
          if (err) return callback(err);
          log.info(user.id + ' connected ' + new Date());
          callback(null, user);
        });
      }
    }
  ], callback);
};


module.exports = userSchema;
