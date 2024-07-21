import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserInfo.css';

function UserInfo() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkLoginStatus(); // 초기 로그인 상태 체크
  }, []);

  const checkLoginStatus = async () => {
    try {
      // 사용자가 로그인한 상태인지 서버에 요청
      const response = await axios.get('/process/check-login', {
        withCredentials: true, // 쿠키를 서버로 전송
      });
      const { loggedIn } = response.data;

      setIsLoggedIn(loggedIn);
    } catch (error) {
      console.error('로그인 상태 확인 중 오류 발생:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('/process/logout', null, {
        withCredentials: true, // 쿠키를 서버로 전송
      });
      if (response.status === 200) {
        setIsLoggedIn(false); // 로그아웃 처리 후 로그인 상태 변경
        navigate('/');
      }
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  const handleMypageClick = () => {
    if (!isLoggedIn) {
      // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
      navigate('/loginpage');
    } else {
      // 로그인한 경우 마이페이지로 이동
      navigate('/mypage');
    }
  };

  return (
    <div className="UserInfo_layout">
      {isLoggedIn ? (
        <>
          <button className="userinfo_link" onClick={handleLogout}>
            로그아웃
          </button>
          <button className="userinfo_link" onClick={handleMypageClick}>
            마이페이지
          </button>
        </>
      ) : (
        <>
          <div className="UserInfo_layout">
            <Link className="userinfo_link" to={'/loginpage'}>
              로그인
            </Link>
            <Link className="userinfo_link" to={'/signuppage'}>
              회원가입
            </Link>
            <button className="userinfo_link" onClick={handleMypageClick}>
              마이페이지
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default UserInfo;
