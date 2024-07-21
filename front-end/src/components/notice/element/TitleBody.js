import React from 'react';
import './Element.css';

function TitleBody(props) {
  return (
    <>
      <h1>{props.title}</h1>
      <div>
        <div>{props.body}</div>
      </div>
    </>
  );
}

export default TitleBody;
