class Resulter {
  constructor(element, options = {}, controller) {
    this._element = element;
    this._house = {};
  }

  render(result) {
    if (!result || !result.address) {
      this._element.innerHTML = '';
      this._houseEditor = null;
      return;
    }
    this._house = result;
    this._element.innerHTML = '';
    this._element.append(this._renderHeader(this._house));
    this._houseEditor = new HouseEditor(this._house);
    this._element.append(this._houseEditor.div);
    this._periodEditor = new PeriodEditor(this._house);
    this._element.append(this._periodEditor.div);
  }

  _renderHeader(house) {
    let div = document.createElement('div');
    div.innerHTML = `
      <legend> Общие сведения </legend>
      <h4 id='address'>${house.address}</h4>
      <p> Площадь: ${house.square}. </p>
      <p> Общий счетчик: ${house.sameCounter ? 'Да' : 'Нет'}. </p>
      <p> РЦ тепло: ${house.RC1}. </p>
      <p> РЦ энергосбережение: ${house.RC2}. </p>`;
    return div;
  }

  hide() {
    this._element.innerHTML = '';
  }
}
