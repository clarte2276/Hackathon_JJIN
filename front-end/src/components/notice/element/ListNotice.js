import React from 'react';
import './ElementNotice.css';

const ListNotice = (props) => {
  const { headersName, children } = props;

  return (
    <table className="ListNotice">
      <thead>
        <tr>
          {headersName.map((item, index) => {
            return (
              <td className="ListNotice-header-column" key={index}>
                {item}
              </td>
            );
          })}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
};

export default ListNotice;
