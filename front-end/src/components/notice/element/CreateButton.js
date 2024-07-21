import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Element.css';

function CreateButton({ nextNo }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleCreateClick = () => {
    window.scrollTo(0, 0); // 페이지 상단으로 스크롤
    let newPostPath;
    if (location.pathname === '/notice') {
      newPostPath = '/notice/process/new_Post';
    } else if (location.pathname === '/suggest') {
      newPostPath = '/suggest/process/new_Post';
    }
    navigate(newPostPath, { state: { nextNo } });
  };

  return (
    <div className="CreateButton_layout">
      <button className="CreateButton" onClick={handleCreateClick}>
        새 글 작성
      </button>
    </div>
  );
}

export default CreateButton;
