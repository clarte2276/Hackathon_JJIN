import React, { useState, useEffect } from 'react';
import './Reservation.css';
import { useNavigate } from 'react-router-dom';
import useUserData from '../useUserData';
import NavbarTop from '../navbar/NavbarTop';
import Footer from '../Footer';

function Reservation() {
  const navigate = useNavigate();
  const { name, id: user_id, phone_num } = useUserData();

  const [reservation_hour, setReservation_hour] = useState(null);
  const [bag_id, setBag_id] = useState(null);
  const [selectedBagLabel, setSelectedBagLabel] = useState('');
  const [availability, setAvailability] = useState({});
  const [canReserve, setCanReserve] = useState(0);

  const bagOptions = Array.from({ length: 14 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}번 빈백`,
  }));

  const timeOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 9,
    label: `${i + 9}:00 ~ ${i + 10}:00`,
  }));

  useEffect(() => {
    const fetchAvailability = async () => {
      const response = await fetch('/bags/form');
      if (response.ok) {
        const data = await response.json();
        setAvailability(data.availability);
      }
    };

    fetchAvailability();
  }, []);

  useEffect(() => {
    const fetchCanReserve = async () => {
      const response = await fetch(`/api/user_reserve?user_id=${user_id}`);
      if (response.ok) {
        const data = await response.json();
        setCanReserve(data.reservation_count);
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    };

    fetchCanReserve();
  }, [user_id]);

  const handleTimeClick = (time) => {
    setReservation_hour(time.value);
    setBag_id(null);
    setSelectedBagLabel('');
  };

  const handleBagClick = (id, label) => {
    if (isSlotAvailable(reservation_hour, id)) {
      setBag_id(id);
      setSelectedBagLabel(label);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!reservation_hour || !bag_id) {
      alert('모든 필드를 선택해 주세요.');
      return;
    }

    const requestBody = {
      userId: user_id,
      reservation_hour,
      bag_id,
    };

    const response = await fetch('/bags/form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const data = await response.json();
      alert(data.message);
      navigate('/mypage');
    } else {
      const errorData = await response.json();
      alert(errorData.message);
    }
  };

  const isSlotAvailable = (hour, bag) => {
    return availability[bag]?.[hour - 9] ?? true;
  };

  const isButtonEnabled = reservation_hour && bag_id && isSlotAvailable(reservation_hour, bag_id);

  return (
    <div>
      <NavbarTop />
      <div className="reservationPage">
        <div className="reservation_title">
          <h1>중앙도서관 빈백 예약하기</h1>
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
              [사용] 각 예약당 1시간, 일일 최대 2시간 예약 가능합니다.(학림관과 함께 계산됩니다.)
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
            <br></br>
            <div>
              <strong>예약 가능 횟수 : {2 - canReserve} / 2</strong>
            </div>
          </div>

          <form className="submitForm" onSubmit={handleSubmit}>
            <div className="form-hour">
              <h3>시간 선택</h3>
              <div className="time-bar">
                {timeOptions.map((time, index) => (
                  <div
                    key={index}
                    className={`time-slot ${reservation_hour === time.value ? 'selected' : ''}`}
                    onClick={() => handleTimeClick(time)}
                  >
                    {time.label}
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
                    className={`bag-seat ${bag_id === option.value ? 'selected' : ''} ${
                      !isSlotAvailable(reservation_hour, option.value) ? 'unavailable' : ''
                    }`}
                    onClick={() => handleBagClick(option.value, option.label)}
                  >
                    {option.label.split('번 빈백')[0]}
                  </div>
                ))}
              </div>
              {selectedBagLabel && <p className="selectedText">{selectedBagLabel}을 선택하셨습니다.</p>}
            </div>

            <div className="submitBtnPlace">
              <button
                type="submit"
                className={`submitBtn ${isButtonEnabled ? 'enabled' : ''}`}
                disabled={!isButtonEnabled}
              >
                예약완료
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Reservation;
