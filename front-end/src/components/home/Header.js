import React from 'react';
import mainImg from '../images/mainImg.png';
import './Header.css';

function Header() {
  return (
    <div className="headerAll">
      <div className="headerText">
        <p className="text1">
          <strong>welcome to</strong>
        </p>
        <h1>DreamBAG</h1>
        <p className="text2">동국대학생의 쉼을 꿈꾸는 드림백</p>
      </div>
      <div className="headerImg">
        <img className="mainImg" src={mainImg} />
      </div>
    </div>
  );
}

export default Header;
