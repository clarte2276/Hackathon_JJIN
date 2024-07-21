import React from 'react';
import Logo from './Logo.js';
import ClickIcon from './ClickIcon.js';
import UserInfo from './UserInfo.js';

import './NavbarTop.css';

function NavbarTop() {
  return (
    <>
      <div className="NavbarTop_layout">
        <div className="LogoIcon_layout">
          <Logo />
          <ClickIcon />
        </div>
        <div className="UserInfo_layout">
          <UserInfo />
        </div>
      </div>
    </>
  );
}

export default NavbarTop;
