import React, { useState, useEffect } from 'react';
import './Reservation.css';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import useUserData from '../useUserData';

function Reservation() {
  const navigate = useNavigate();
  const { name, id: user_id, phone_num } = useUserData();

  const [reservation_hour, setReservation_hour] = useState(null);
  const [bag_id, setBag_id] = useState(null); // 빈백 좌석 번호
  const [selectedBagLabel, setSelectedBagLabel] = useState('');

  const bagOptions = [
    { value: 'bag1', label: '1번 빈백' },
    { value: 'bag2', label: '2번 빈백' },
    { value: 'bag3', label: '3번 빈백' },
    { value: 'bag4', label: '4번 빈백' },
    { value: 'bag5', label: '5번 빈백' },
    { value: 'bag6', label: '6번 빈백' },
    { value: 'bag7', label: '7번 빈백' },
    { value: 'bag8', label: '8번 빈백' },
    { value: 'bag9', label: '9번 빈백' },
    { value: 'bag10', label: '10번 빈백' },
    { value: 'bag11', label: '11번 빈백' },
    { value: 'bag12', label: '12번 빈백' },
    { value: 'bag13', label: '13번 빈백' },
    { value: 'bag14', label: '14번 빈백' },
  ];

  const timeOptions = [
    '9:00 ~ 10:00',
    '10:00 ~ 11:00',
    '11:00 ~ 12:00',
    '12:00 ~ 13:00',
    '13:00 ~ 14:00',
    '14:00 ~ 15:00',
    '15:00 ~ 16:00',
    '16:00 ~ 17:00',
    '17:00 ~ 18:00',
    '18:00 ~ 19:00',
    '19:00 ~ 20:00',
    '20:00 ~ 21:00',
  ];

  const handleBagChange = (selectedOption) => {
    if (selectedOption) {
      setBag_id(selectedOption.value);
      setSelectedBagLabel(selectedOption.label);
    } else {
      setBag_id(null);
      setSelectedBagLabel('');
    }
  };

  const handleBagClick = (id, label) => {
    setBag_id(id);
    setSelectedBagLabel(label);
  };

  const handleTimeClick = (time) => {
    setReservation_hour(time);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!reservation_hour || !bag_id) {
      alert('모든 필드를 선택해 주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('reservation_hour', reservation_hour);
    formData.append('bag_id', bag_id);

    const response = await fetch('/bag/form', {
      method: 'POST',
      body: formData,
    });

    const data = await response.text();
    alert(data);

    if (response.ok) {
      navigate('/mypage');
    }
  };

  const customSelectStyle = {
    control: (provided) => ({
      ...provided,
      borderColor: 'lightgray',
      boxShadow: 'none',
      '&:hover': {
        borderColor: 'blue',
      },
    }),
  };

  // 버튼 활성화 조건 확인
  const isButtonEnabled = reservation_hour && bag_id;

  return (
    <div className="reservationPage">
      <div className="reservation_title">
        <h1>빈백 예약하기</h1>
      </div>
      <div className="reservation-container">
        <div className="notice-section">
          <h2>※안내사항※</h2>
          <p>
            [위치] 빈백은 중앙 도서관 3층 안내데스크 반대 방향에 있습니다.
            <br />
            [시간] 빈백 사용 가능시간은 평일 오전 9시부터 저녁 9시까지입니다.
            <br />
            [주의] 가져오신 짐, 쓰레기는 사용 종료시 꼭 챙겨주세요!!
            <br />
            [사용] 각 예약당 1시간, 일일 최대 2시간 예약 가능합니다.
          </p>
        </div>
        <div className="form-userInfo">
          <h3>예약자 확인</h3>
          <div className="userInfo-row">
            <span className="userInfo-label">이름</span>
            <span className="userInfo-value">{name}</span>
          </div>
          <div className="userInfo-row">
            <span className="userInfo-label">학번</span>
            <span className="userInfo-value">{user_id}</span>
          </div>
          <div className="userInfo-row">
            <span className="userInfo-label">연락처</span>
            <span className="userInfo-value">{phone_num}</span>
          </div>
        </div>

        <form className="submitForm" onSubmit={handleSubmit}>
          <div className="form-hour">
            <h3>시간 선택</h3>
            <div className="time-bar">
              {timeOptions.map((time, index) => (
                <div
                  key={index}
                  className={`time-slot ${reservation_hour === time ? 'selected' : ''}`}
                  onClick={() => handleTimeClick(time)}
                >
                  {time}
                </div>
              ))}
            </div>
          </div>

          <div className="form-bag">
            <h3>빈백 좌석 선택</h3>
            <div className="bag-seats">
              {bagOptions.map((option) => (
                <div
                  key={option.value}
                  className={`bag-seat ${bag_id === option.value ? 'selected' : ''}`}
                  onClick={() => handleBagClick(option.value, option.label)}
                >
                  {option.label.split('번 빈백')[0]}
                </div>
              ))}
            </div>
            {selectedBagLabel && <p>{selectedBagLabel}을 선택하셨습니다.</p>}
          </div>

          <div className="submitBtnPlace">
            <button type="submit" className={`submitBtn ${isButtonEnabled ? 'enabled' : ''}`}>
              예약완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Reservation;
