let socket = io.connect();
let houseAdder = null;
let houseFinder = null;
let resulter = null;
let currentHouse = null;

let controller = {
  showAdder: function() {
    houseFinder.hide();
    resulter.hide();
  },
  showFinder: function() {
    houseAdder.hide();
    resulter.hide();
  },
  render: function(result) {
    resulter.render(result);
  },
  catalogue: {

  },
  updateCatalogue: function() {
    cataloger.render(this.catalogue);
  }
};

houseAdder = new HouseAdder(document.getElementById('addNewHouseDiv', {}, controller));
houseFinder = new HouseFinder(document.getElementById('findOneHouseDiv', {}, controller));
resulter = new Resulter(document.getElementById('findingResultDiv', {}, controller));
cataloger = new Cataloger(document.getElementById('catalogue', {}, controller));

socket
    .on('connect', function() {
      socket.emit('getCatalogue');
    })
    .on('initConnection', function(handshake) {
      socket.handshake = handshake;
      if (!socket.handshake.user) {
        location.href = "/";
        return;
      }
    })
    .on('disconnect', function() {
      location.href = "/";
     })
    .on('logout', function(text) {
      if (text) alert(text);
      location.href = "/";
    })
    .on('error', function(reason) {
      if (reason == "handshake unauthorized") {
        alert("вы вышли из сайта");
      } else {
        setTimeout(function() {
          socket.socket.connect();
        }, 500);
      }
    })
    .on('addNewHouseResult', function(result) {
      if (result) {
        socket.emit('getCatalogue');
      } else {
        alert('Неудача');
      }
    })
    .on('findOneHouseResult', function(result) {
      let resultDiv = document.getElementById('findingResultDiv');
      currentHouse = result;
      controller.render(result);
    })
    .on('addNewPeriodResult', function([result, text]) {
      let resultDiv = document.getElementById('findingResultDiv');
      if (result) {
        controller.render(result);
      } else {
        alert('Неудача', text);
      }
    })
    .on('getCatalogueResult', function(catalogue) {
      controller.catalogue = catalogue;
      controller.updateCatalogue();
    });
