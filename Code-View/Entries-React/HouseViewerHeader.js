import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class HouseViewerHeader extends Component{

  constructor(props) {
    super(props);
  }

  render() {
    const { house } = this.props;
    const body = house &&
      <div>
        <legend> Общие сведения </legend>
        <h4> {
               house.address.split(',')[0] + ', ' +
               house.address.split(',')[1] + ' ' +
               house.address.split(',')[2] + ', ' +
               house.address.split(',')[3]
        } </h4>
        <p> Площадь: { house.square } </p>
        <p> Общий счетчик тепла и ГВС: {house.sameCounter ? 'Да' : 'Нет'} </p>
        <p> РЦ тепло: { house.RC1 } </p>
        <p> РЦ энергосбережение: { house.RC2 } </p>
      </div>;

    return (
      <div>
        { body }
      </div>
    );
  }
}

export default HouseViewerHeader;
