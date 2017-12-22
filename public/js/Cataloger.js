class Cataloger {
  constructor(element, options = {}, controller) {
    this._element = element;
    this.render();
    this.initialize();
  }
}
