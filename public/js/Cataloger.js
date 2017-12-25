class Cataloger {
  constructor(element, options = {}, controller) {
    this._element = element;
  }

  render(catalogue) {
    if (!catalogue) return;

    let html = '';

    if (catalogue.streets) {
      html += '<datalist id="streetList1">';
      catalogue.streets.forEach((street) => {
        html += `<option value="${street}"></option>`;
      });
      html += '</datalist>';
    }

    if (catalogue.companies) {
      html += '<datalist id="companiesList1">';
      catalogue.companies.forEach((company) => {
        html += `<option value="${company}"></option>`;
      });
      html += '</datalist>';
    }

    this._element.innerHTML = html;
  }
}
