import React, { useState, useEffect } from 'react';
import './Mypage.css';
import { useNavigate } from 'react-router-dom';
import useUserData from '../useUserData';
import axios from 'axios';
import NavbarTop from '../navbar/NavbarTop';
import Footer from '../Footer';
import ReservationDetails from './ReservationDetails';

function Mypage() {
  const navigate = useNavigate();
  const { name, phone_num, id, password, setName, setPhone_num, setId, setPassword, handleSave, fetchUserData } =
    useUserData();

  useEffect(() => {
    fetchUserData();
  }, []);

  // 비밀번호만 변경 가능
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSaveWrapper = async (e) => {
    e.preventDefault();
    await handleSave();
    navigate('/');
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        '/process/logout',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        alert('로그아웃 되었습니다.');
        navigate('/'); // 로그아웃 후 메인 페이지로 이동하기
      } else {
        throw new Error('로그아웃에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('로그아웃 도중 오류 발생:', error);
      alert('로그아웃 도중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <NavbarTop></NavbarTop>
      <div className="mypageAll">
        <h1>마이페이지</h1>
        <div className="myPage">
          <form onSubmit={handleSaveWrapper} className="userProfileForm">
            <hr className="divider" />
            <div className="inputSpace">
              <div className="inputLeft">
                <p className="a_name">
                  이름
                  <input type="text" name="name" placeholder="이름" value={name} disabled />
                </p>
                <p className="a_id">
                  아이디
                  <input type="text" name="id" placeholder="아이디" value={id} disabled />
                </p>
              </div>
              <div className="inputRight">
                <p className="a_phone">
                  연락처
                  <input type="text" name="phone_num" placeholder="연락처" value={phone_num} disabled />
                </p>
                <p className="a_pw">
                  비밀번호
                  <input
                    type="password"
                    name="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </p>
              </div>
            </div>
          </form>
          <div className="userProfileBtn">
            <button type="submit" className="saveBtn">
              저장
            </button>
          </div>
        </div>
      </div>
      <ReservationDetails />
      <Footer />
    </div>
  );
}

export default Mypage;
