import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Element.css';

function CreateButton({ nextNo }) {
  const location = useLocation();

  let newPostPath;
  if (location.pathname === '/notice') {
    newPostPath = '/notice/process/new_Post';
  } else if (location.pathname === '/suggest') {
    newPostPath = '/suggest/process/new_Post';
  }

  return (
    <div className="CreateButton_layout">
      <Link className="CreateButton" to={newPostPath} state={{ nextNo }}>
        새 글 작성
      </Link>
    </div>
  );
}

export default CreateButton;
