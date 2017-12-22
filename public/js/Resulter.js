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

  renderHouse(house) {

    //
    // html += `<button type="button" onclick="
    //       document.getElementById('newPeriod').hidden = !document.getElementById('newPeriod').hidden;
    //     ">Добавить отчетный период</button>`;
    //
    // html += `
    //     <form id='newPeriod' hidden='true'>
    //       <table>
    //         <tr>
    //           <td>
    //             Год
    //           </td>
    //           <td>
    //             <select name="year">
    //               <option>2015</option>
    //               <option>2016</option>
    //               <option>2017</option>
    //               <option>2018</option>
    //             </select>
    //           </td>
    //         </tr>
    //         <tr>
    //           <td>
    //             Месяц
    //           </td>
    //           <td>
    //             <select name="month">
    //               <option>01</option>
    //               <option>02</option>
    //               <option>03</option>
    //               <option>04</option>
    //               <option>05</option>
    //               <option>10</option>
    //               <option>11</option>
    //               <option>12</option>
    //             </select>
    //           </td>
    //         </tr>
    //         <tr>
    //           <td>
    //             Продано энергосбережение
    //           </td>
    //           <td>
    //             <select name="isBasic">
    //               <option value="true">Нет</option>
    //               <option value="false">Да</option>
    //             </select>
    //           </td>
    //         </tr>
    //         <tr>
    //           <td>
    //             Прибор учета работал
    //           </td>
    //           <td>
    //             <select name="shouldCount">
    //               <option value="true">Да</option>
    //               <option value="false">Нет</option>
    //             </select>
    //           </td>
    //         </tr>
    //         <tr>
    //           <td>
    //             УК
    //           </td>
    //           <td>
    //             <input type="text" name="company" value="Сторм">
    //           </td>
    //         </tr>
    //         <tr>
    //           <td>
    //             Данные РЦ без вычета ГВС
    //           </td>
    //           <td>
    //             <input type="text" name="O" value="">
    //           </td>
    //         </tr>
    //         <tr>
    //           <td>
    //             Данные РЦ с вычетом ГВС
    //           </td>
    //           <td>
    //             <input type="text" name="P" value="">
    //           </td>
    //         </tr>
    //         <tr>
    //           <td>
    //             Данные ОДПУ без вычета ГВС
    //           </td>
    //           <td>
    //             <input type="text" name="Q" value="">
    //           </td>
    //         </tr>
    //         <tr>
    //           <td>
    //             Данные по нормативу
    //           </td>
    //           <td>
    //             <input type="text" name="R" value="">
    //           </td>
    //         </tr>
    //       </table>
    //
    //       <button type="button" onclick="
    //         let form = document.getElementById('newPeriod');
    //         let flag = form.elements.O.value.length > 0 ||
    //                    form.elements.P.value.length > 0 ||
    //                    form.elements.Q.value.length > 0 ||
    //                    form.elements.R.value.length > 0;
    //         flag = flag && form.elements.company.value.length > 0;
    //         if (!flag) {
    //           alert('Заполните все поля!');
    //         } else {
    //           form.hidden = true;
    //           let newPeriod = {
    //             month: form.elements.month.value + '-' + form.elements.year.value,
    //             isBasic: form.elements.isBasic.value,
    //             shouldCount: form.elements.shouldCount.value,
    //             company: form.elements.company.value,
    //             O: form.elements.O.value,
    //             P: form.elements.P.value,
    //             Q: form.elements.Q.value,
    //             R: form.elements.R.value,
    //           };
    //           socket.emit('addNewPeriod', {
    //             address: document.getElementById('address').innerHTML,
    //           }, newPeriod);
    //         }
    //       ">Сохранить</button>
    //     </form>
    // `;
  }
}
