import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavbarTop from '../navbar/NavbarTop';
import Footer from '../Footer';
import space1Img from '../images/space1Img.png';
import space2Img from '../images/space2Img.png';
import './SelectSpace.css';

function SelectSpace() {
  return (
    <div>
      <NavbarTop></NavbarTop>
      <div className="selectspacePageAll">
        <h1>
          <strong>이용장소 선택</strong>
        </h1>
        <div className="selectspacePage">
          <hr className="divider" />
          <div className="spaceContentAll">
            <div className="space1Content">
              <img className="space1Img" src={space1Img} />
              <button className="spaceBtn">
                <Link to="/bag/form" className="formLink">
                  중앙도서관
                </Link>
              </button>
            </div>
            <div className="space2Content">
              <img className="space2Img" src={space2Img} />
              <button className="spaceBtn">
                <Link to="/bag/form2" className="formLink">
                  학림관
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SelectSpace;
