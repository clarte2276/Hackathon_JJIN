import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavbarTop from '../navbar/NavbarTop';
import Footer from '../Footer';
import homechaticon from '../images/homechaticon.png';
import NoticeHome from './NoticeHome';
import './Home.css';
import SeatStatus from './SeatStatus';
import Header from './Header';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('/process/check-login', { withCredentials: true });
        setIsLoggedIn(response.data.loggedIn);
      } catch (error) {
        console.error('로그인 상태 확인 중 오류 발생:', error);
      }
    };

    checkLoginStatus();
  }, []);

  const handleChatbotClick = () => {
    if (isLoggedIn) {
      window.open('/chatbot', '_blank', 'width=600,height=800,left=850,top=100');
    } else {
      // 로그인되지 않은 경우, 로그인 페이지로 이동
      navigate('/loginpage');
    }
  };

  return (
    <>
      <NavbarTop />
      <div className="content">
        <div className="homechaticon_layout">
          <img className="homechaticon" src={homechaticon} width={150} onClick={handleChatbotClick} />
        </div>
        <Header />
        <NoticeHome />
        <SeatStatus />
      </div>
      <Footer />
    </>
  );
}

export default Home;
