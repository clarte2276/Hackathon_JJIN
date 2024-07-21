import React from 'react';
import hanulLogo from './images/hanulLogo.png';
import './Footer.css';

function Footer() {
  return (
    <div className="Footer_layout">
      <div className="textLogo_layout">
        <div>
          <p className="hanul_name">Campathon_05 "한울"</p>
          <p className="hanul_place">
            04620 서울특별시 중구 필동로 1길 30 동국대학교
            <br />
            정보문화관 P 2층 407-211 AI융합대학 학생회실
            <br />
            <br />
            Copyright(c) 2023 HANOOL. ALL RIGHTS RESERVED.
          </p>
        </div>
        <div className="hanulLogo">
          <img src={hanulLogo} alt="한울 로고" width={100} height={100} />
        </div>
      </div>
    </div>
  );
}

export default Footer;
