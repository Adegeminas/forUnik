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
  companies: {
    type: [
      String
    ],
  },
};

let catalogueSchema = mongoose.Schema(Catalogue, options);

catalogueSchema.statics.get = function(callback) {

  this.findOne((err, catalogue) => {
    if (!err && !catalogue) {
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
};

catalogueSchema.statics.addNewStreet = function(streetName) {
  this.findOne((err, catalogue) => {
    if (err) {
      log.error(err);
    } else {
      let flag = true;
      catalogue.streets.forEach((street) => {
        if (street === streetName) {
          flag = false;
        }
      });
      if (flag) catalogue.streets.push(streetName);
      catalogue.save();
    }
  });
};

catalogueSchema.statics.addCompany = function(companyName) {
  this.findOne((err, catalogue) => {
    if (err) {
      log.error(err);
    } else {
      let flag = true;
      catalogue.companies.forEach((company) => {
        if (company === companyName) {
          flag = false;
        }
      });
      if (flag) catalogue.companies.push(companyName);
      catalogue.save();
    }
  });
};

module.exports = catalogueSchema;
