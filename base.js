const mongoose = require('./lib/mongoose');

switch (process.argv[2]) {
  case 'delall':
    mongoose.models.users.collection.drop((err) => {
      if (err) {
        console.log('No users');
      } else {
        console.log('Users database drop succeed');
      }
    });
    mongoose.models.houses.collection.drop((err) => {
      if (err) {
        console.log('No data');
      } else {
        console.log('World database drop succeed');
      }
    });
    break;
  default:
    break;
}
