import React from 'react';
import mainServiceImg from '../images/mainServiceImg.png';
import { Link, useNavigate } from 'react-router-dom';
import './Service.css';

function Service() {
  return (
    <div className="servicePage">
      <div className="serviceImg">
        <img className="mainServiceImg" src={mainServiceImg} alt="Service" />
      </div>
      <div className="serviceText">
        <h1>Our Service</h1>
        <p>
          드림백은 동국대학교 학생들이 학기중 공강에 빈백을 더 원활하게 사용할 수 <br></br> 있도록 도와주는 예약
          서비스입니다.
          <br></br>
          각각 한시간씩, 일일 최대 두시간의 빈백 예약을 지원합니다.
          <br></br>
          <br></br>
          여러분의 편안한 휴식과 행복한 꿈을 바라는 내꿈코와 함께 학교에서의 <br></br>시간을 즐겨보세요.
        </p>
        <button className="serviceBtn">
          <Link to="/select/space" className="serviceLink">
            빈백 예약하러 가기
          </Link>
        </button>
      </div>
    </div>
  );
}

export default Service;
