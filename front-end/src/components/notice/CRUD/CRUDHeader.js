import React from 'react';
import './CRUD.css';

function CRUDHeader(props) {
  return (
    <>
      <h1 className="CRUDHeader">{props.title}</h1>
      <div className="borderLine" />
    </>
  );
}

export default CRUDHeader;
