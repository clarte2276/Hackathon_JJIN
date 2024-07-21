import React from 'react';
import mainImg from '../images/mainImg.png';
import './Header.css';
import HeaderImg from '../images/header.png';

function Header() {
  return (
    <div className="headerAll">
      <img className="HeaderImg" src={HeaderImg} />
    </div>
  );
}

export default Header;
