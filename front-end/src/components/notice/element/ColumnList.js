import React from 'react';

const ColumnList = ({ children, isTitleColumn }) => {
  return <td className={`List-column ${isTitleColumn ? 'title-column' : ''}`}>{children}</td>;
};

export default ColumnList;
