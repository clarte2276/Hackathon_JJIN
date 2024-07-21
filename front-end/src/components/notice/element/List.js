import React from "react";
import "./Element.css";

const List = (props) => {
  const { headersName, children } = props;

  return (
    <table className="List">
      <thead>
        <tr>
          {headersName.map((item, index) => (
            <td className="List-header-column" key={index}>
              {item}
            </td>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
};

export default List;
