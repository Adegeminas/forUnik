var log = require('../lib/log')(module);
var mongoose = require('mongoose');

let options = {
  usePushEach: true,
};

let Catalogue = {
  streets: {
    type: [
      String
    ],
  },
}

let catalogueSchema = mongoose.Schema(Catalogue, options);

catalogueSchema.statics.get = function(callback) {

  this.findOne((err, catalogue) => {
    if (!err && !catalogue) {
      console.log('no catalogue');
      let catalogue = new this();
      catalogue.save();
      callback(false);
      return;
    }
    if (err) {
      callback(false);
    } else {
      callback(catalogue);
    }
  });
}

catalogueSchema.statics.addNewStreet = function(streetName) {
  this.findOne((err, catalogue) => {
    if (err) {
      console.log(err);
    } else {
      catalogue.streets.push(streetName);
      catalogue.save();
    }
  });
}

module.exports = catalogueSchema;
