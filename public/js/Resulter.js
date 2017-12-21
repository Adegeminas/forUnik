class Resulter {
  constructor(element, options = {}) {
    this._element = element;
    this.house = {};
    this.render();
    this.initialize();
  }

  render() {
    this._element.innerHTML = '';
  }

  initialize() {

  }

  oneHouseToHTML(house) {
    this.house = house;
    this.render();
    this.initialize();
  }
}
