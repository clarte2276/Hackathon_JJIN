import React from 'react';
import { Link } from 'react-router-dom';
import './Element.css';

function CreateButton({ nextNo }) {
  return (
    <div className="CreateButton_layout">
      <Link className="CreateButton" to={`/notice/process/new_Post`} state={{ nextNo }}>
        새 글 작성
      </Link>
    </div>
  );
}

export default CreateButton;
