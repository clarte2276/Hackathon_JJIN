import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dongguklogo from '../images/dongguklogo.png';

import './ClickIcon.css';

function ClickIcon() {
  const navigate = useNavigate();

  return (
    <>
      <div className="ClickIcon_layout">
        <a href="https://www.dongguk.edu/main" target="_blank">
          <img className="ClickIcon_icon1" src={dongguklogo} alt="dongguk" width={50} height={50} />
        </a>
        <a href="https://www.dongguk.edu/main" target="_blank">
          <img className="ClickIcon_icon2" src={dongguklogo} alt="dongguk" width={50} height={50} />
        </a>
      </div>
    </>
  );
}

export default ClickIcon;
