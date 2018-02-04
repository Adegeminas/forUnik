import React from 'react';
import ReactDOM from 'react-dom';

import HouseAdder from './HouseAdder'

function TestApp() {
  return (
    <div>
      <HouseAdder />
    </div>
  )
}

ReactDOM.render(
  <TestApp />,
  document.getElementById('root')
);
