import React from 'react';
import ReactDOM from 'react-dom';
import DetectPicture from './detect-picture';

function Root() {
  return (
    <div>
      <h1>Detect test</h1>
      <DetectPicture />
    </div>
  );
}

ReactDOM.render(<Root />, document.getElementById('root'));
