import React from 'react';
import './Element.css';

function TitleBody(props) {
  return (
    <>
      <h1>{props.title}</h1>
      <div>
        <div className="TitleBody_body1">{props.body1}</div>
        <div className="TitleBody_body2">{props.body2}</div>
      </div>
    </>
  );
}

export default TitleBody;
