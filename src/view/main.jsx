import React from 'react';
import ReactDOM from 'react-dom';
import Sub from './sub';

function Root() {
  return (
    <div>
      <h1>Hello World!!!!!!!</h1>
      <Sub />
    </div>
  );
}

ReactDOM.render(<Root />, document.getElementById('root'));
