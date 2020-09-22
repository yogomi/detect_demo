import React from 'react';
import ReactDOM from 'react-dom';
import UploadFile from './upload-file';

function Root() {
  return (
    <div>
      <h1>Detect test</h1>
      <UploadFile />
    </div>
  );
}

ReactDOM.render(<Root />, document.getElementById('root'));
