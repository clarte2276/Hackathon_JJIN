import React from 'react';
import './ElementNotice.css';

function TitleBodyNotice(props) {
  return (
    <>
      <h1>{props.title} 게시판</h1>
      <div>
        <div className="TitleBodyNotice_body">이곳은 {props.title} 게시판입니다.</div>
        <div>{props.body}</div>
      </div>
    </>
  );
}

export default TitleBodyNotice;
