import React, { useState, useEffect } from 'react';
import './Mypage.css';
import { useNavigate } from 'react-router-dom';
import useUserData from '../useUserData';
import axios from 'axios';

function Mypage() {
  const navigate = useNavigate();
  const {
    name,
    student_num,
    birth,
    phone_num,
    id,
    password,
    setName,
    setStudent_num,
    setBirth,
    setPhone_num,
    setId,
    setPassword,
    handleSave,
    fetchUserData,
  } = useUserData();

  useEffect(() => {
    // useUserData.js에서 제공하는 fetchUserData를 호출하여 초기 데이터를 불러옴
    fetchUserData();
  }, []);

  // 학번, 연락처, 비밀번호만 변경 가능
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'student_num':
        setStudent_num(value);
        break;
      case 'phone_num':
        setPhone_num(value);
        break;
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

  // Select 속성의 css 속성 값

  //  const customSelectStyles1 = {
  //     control: (provided) => ({
  //       ...provided,
  //       width: '420px',
  //       height: '25px',
  //       border: '2px solid #b6bec6',
  //       borderRadius: '10px',
  //       fontSize: '1rem',
  //       fontWeight: '400',
  //       color: '#787878',
  //       paddingLeft: '4.5%',
  //       paddingBottom: '12%',
  //     }),
  //     menu: (provided) => ({
  //       ...provided,
  //       width: '420px',
  //     }),
  //     indicatorSeparator: (provided) => ({
  //       ...provided,
  //       display: 'none',
  //     }),
  //   };

  return (
    <div className="mypageAll">
      <h1>마이페이지</h1>
      <div className="myPage">
        <form onSubmit={handleSaveWrapper} className="userProfileForm">
          <div className="userProfileContainer">
            <div className="userProfile">
              <div className="userProfileText">
                <p className="outputName">{name}</p>
                <p className="outputStudent_num">{student_num}</p>
              </div>
              <div className="userProfileBtn">
                <button className="logoutBtn" onClick={handleLogout}>
                  LOGOUT
                </button>
                <button type="submit" className="saveBtn">
                  SAVE
                </button>
              </div>
            </div>
          </div>
          <hr className="divider" />
          <div className="inputSpace">
            <p>
              이름
              <input type="text" name="name" placeholder="이름" value={name} disabled />
            </p>
            <p>
              학번
              <input
                type="text"
                name="student_num"
                placeholder="학번"
                value={student_num}
                onChange={handleInputChange}
              />
            </p>
            <p>
              생년월일
              <input type="text" name="birth" placeholder="생년월일" value={birth} disabled />
            </p>
            <p>
              연락처
              <input type="text" name="phone_num" placeholder="연락처" value={phone_num} onChange={handleInputChange} />
            </p>
            <p>
              아이디
              <input type="text" name="id" placeholder="아이디" value={id} disabled />
            </p>
            <p>
              비밀번호
              <input
                type="password"
                name="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </p>
            {/* 성별
            <Select
              className="genderAlt"
              options={genderOptions}
              value={genderOptions.find((option) => option.value === gender)}
              onChange={handleGenderChange}
              placeholder="성별"
              styles={customSelectStyles1}
              isClearable
            /> */}
          </div>
        </form>
        <hr className="divider" />
      </div>
    </div>
  );
}

export default Mypage;
