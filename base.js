const mongoose = require('./lib/mongoose');

switch (process.argv[2]) {
  case 'delall':
    mongoose.models.users.collection.drop((err) => {
      if (err) {

      } else {
        console.log('Users database drop succeed');
      }
    });
    mongoose.models.houses.collection.drop((err) => {
      if (err) {

      } else {
        console.log('World database drop succeed');
      }
    });
    mongoose.models.catalogue.collection.drop((err) => {
      if (err) {

      } else {
        console.log('Catalogue database drop succeed');
      }
    });
    break;
  default:

}
