import React from 'react';
import './SignUp.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useUserData from '../useUserData';

function Signup() {
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (name && birth && phone_num && id && password) {
      const signupData = {
        name,
        student_num,
        birth,
        phone_num,
        id,
        password,
      };

      try {
        // 회원가입 시 입력한 정보 전달 경로
        const response = await axios.post('/loginpage/process/signup', signupData);
        const result = response.data;

        if (result.success) {
          alert('회원가입 성공!');
          navigate('/loginpage');
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error('회원가입 요청 중 오류 발생:', error);
        alert('회원가입 요청 중 오류가 발생했습니다.');
      }
    } else {
      alert('필수 정보를 입력해주세요.');
    }
  };

  return (
    <div>
      <NavbarTopAll></NavbarTopAll>
      <div className="SignupPage">
        <h1>회원가입</h1>
        <form className="SignupContent" onSubmit={handleSubmit}>
          <div className="signupTextbox">
            <p>이름 *</p>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            <div className="studentnumBox">
              <p>학번</p>
              <p className="textType">(재학생만 입력)</p>
            </div>
            <input type="text" value={student_num} onChange={(e) => setStudent_num(e.target.value)} />
            <p>생년월일 *</p>
            <input
              type="text"
              placeholder="8자리를 입력해주세요 (ex. 20240718)"
              value={birth}
              onChange={(e) => setBirth(e.target.value)}
              required
            />
            <p>연락처 *</p>
            <input
              type="text"
              placeholder="- 제외하고 입력 (ex. 01012345678)"
              value={phone_num}
              onChange={(e) => setPhone_num(e.target.value)}
              required
            />
            <p>아이디 *</p>
            <input type="text" value={id} onChange={(e) => setId(e.target.value)} required />
            <p>비밀번호 *</p>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="btnContent">
            <button type="submit" className="signupBtn">
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
