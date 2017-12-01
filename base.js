const mongoose = require('./lib/mongoose');

function getHouse() {
  return {
    address: Math.random().toFixed(2).toString(),
    square: Math.random().toFixed(2),
    company: Math.random().toFixed(2).toString(),
    basicPeriod: '10-15:05-16/10-16:05-17',
    RC1: 'ИРЦ',
    RC2: 'ИРЦ',
    tarif: 1800,
    data: [{
      month: '11-15',
      isBasic: true,
      shouldCount: true,
      sameCounter: false,
      O: 80,
      P: 60,
      Q: 50,
      R: 100,
    },{
      month: '11-16',
      isBasic: true,
      shouldCount: false,
      sameCounter: false,
      O: 60,
      P: 80,
      Q: 40,
      R: 100,
    },{
      month: '11-17',
      isBasic: false,
      shouldCount: true,
      sameCounter: true,
      O: 70,
      P: 30,
      Q: 70,
      R: 90,
    }],
  };
}

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
  case 'add':
    let houseObj = getHouse();
    let house = new mongoose.models.houses(houseObj);
    house.save((err) => {
      if (err) {
        console.log(err);
      }
    });
    break;
  case 'remove':
    mongoose.models.houses.deleteHouse(
      {
        address: 'test',
      },
      console.log
    );
    break;
  case 'get':
    mongoose.models.houses.getHouse(
      {
        address: 'test',
      },
      console.log
    );
    break;
  case 'addone':
    mongoose.models.houses.addNewHouse(
      {
        address: 'test',
        square: 1234,
        company: Math.random().toFixed(2).toString(),
        basicPeriod: '10-15:05-16/10-16:05-17',
        RC1: 'ИРЦ',
        RC2: 'ИРЦ',
        tarif: 1800,
      },
      console.log
    );
    break;
  case 'change':
    mongoose.models.houses.changeHouse(
      {
        address: 'test',
        square: 5555,
        data: []
      },
      console.log
    );
    break;
  case 'show':
    mongoose.models.houses.find((err, data) => {
      if (err || !data.length) {
        console.log('No data');
        return;
      } else {
        data.forEach((elem) => {
          console.log(elem);
        });
      }
    });
    break;
  case 'test':
    mongoose.models.houses.find((err, data) => {
      if (err || !data.length) {
        console.log('No data');
        return;
      } else {
        data.forEach((elem) => {
          console.log(elem.getEconomy('11-17', 'Q'));
        });
      }
    });
    break;
  default:
  break;
}
