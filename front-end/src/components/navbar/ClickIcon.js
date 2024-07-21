import React from 'react';
import donggukIcon from '../images/donggukIcon.png';
import libraryIcon from '../images/libraryIcon.png';

import './ClickIcon.css';

function ClickIcon() {
  return (
    <>
      <div className="ClickIcon_layout">
        <a className="navbar_icon1" href="https://www.dongguk.edu/main" target="_blank">
          <img className="ClickIcon_icon1" src={donggukIcon} alt="dongguk" width={50} height={50} />
        </a>
        <a className="navbar_icon2" href="https://lib.dongguk.edu/" target="_blank">
          <img className="ClickIcon_icon2" src={libraryIcon} alt="dongguk" width={50} height={50} />
        </a>
      </div>
    </>
  );
}

export default ClickIcon;
