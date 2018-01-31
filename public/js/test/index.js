import React from 'react';
import ReactDOM from 'react-dom';
import str from './test2'

function TestApp() {
  return (
    <div>
      <h1> { str + '123555'} </h1>
      <h2> { str + '441114' } </h2>
    </div>
  )
}

ReactDOM.render(
  <TestApp />,
  document.getElementById('root')
);
