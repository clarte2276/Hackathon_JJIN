import React from 'react';
import { Link } from 'react-router-dom';

function CreateButtonNotice({ nextNo }) {
  return (
    <div className="CreateButton">
      <Link className="CreateButtonNotice" to={`/notice/process/new_Post`} state={{ nextNo }}>
        새 글 작성
      </Link>
    </div>
  );
}

export default CreateButtonNotice;
