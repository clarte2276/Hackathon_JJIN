import React from 'react';
import './ElementNotice.css';

function TitleBodyNotice(props) {
  return (
    <>
      <h1>{props.title}</h1>
      <div>
        <div>{props.body}</div>
      </div>
    </>
  );
}

export default TitleBodyNotice;
