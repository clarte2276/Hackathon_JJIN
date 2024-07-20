import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/loginpage/process/login', {
        id,
        password,
      });
      const data = response.data;

      if (data.success) {
        alert('로그인 성공!');
        navigate('/'); // 로그인 성공 시 메인페이지 이동
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('로그인 요청 중 오류 발생:', error);
      alert('로그인 요청 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="loginPage">
      <h1>로그인</h1>
      <form className="loginPagecontent" onSubmit={handleSubmit}>
        <div className="textBox">
          <input type="text" placeholder="아이디" name="id" value={id} onChange={(e) => setId(e.target.value)} />
          <input
            type="password"
            placeholder="비밀번호"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="btnContent">
          <button type="submit" className="loginpageBtn">
            로그인
          </button>
          <button className="signuppageBtn">
            <Link to="/signuppage" className="signupLink">
              회원가입
            </Link>
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
