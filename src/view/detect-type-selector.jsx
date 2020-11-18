import React from 'react';

export default function DetectTypeSelector(props) {
  const options = props.detectTypes.map((detectType) => {
    return <option value={detectType} key={detectType}>{detectType}</option>
  });
  return (
    <select
      id="detect-type"
      name="detect-type"
      value={props.detectType}
      onChange={props.onDetectTypeChange}
    >
      {options}
    </select>
  );
}
