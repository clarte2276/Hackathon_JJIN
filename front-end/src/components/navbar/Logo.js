import React from 'react';
import { Link } from 'react-router-dom';
import DreamBAG from '../images/DreamBAG.png';

import './Logo.css';

function Logo() {
  return (
    <>
      <Link to={'/'}>
        <img className="DreamBAG" src={DreamBAG} alt="DreamBAG" width={153} height={80} />
      </Link>
    </>
  );
}

export default Logo;
