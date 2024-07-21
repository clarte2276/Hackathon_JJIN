// import React, { useState, useEffect } from 'react';
// import './Reservation.css';
// import { useNavigate } from 'react-router-dom';
// import useUserData from '../useUserData';
// import NavbarTop from '../navbar/NavbarTop';
// import Footer from '../Footer';

// function Reservation() {
//   const navigate = useNavigate();
//   const { name, id: user_id, phone_num } = useUserData();

//   const [reservation_hour, setReservation_hour] = useState(null);
//   const [bag_id, setBag_id] = useState(null); // 빈백 좌석 번호
//   const [selectedBagLabel, setSelectedBagLabel] = useState('');

//   const bagOptions = Array.from({ length: 14 }, (_, i) => ({
//     value: i + 1,
//     label: `${i + 1}번 빈백`,
//   }));

//   // const timeOptions = [
//   //   '9:00 ~ 10:00',
//   //   '10:00 ~ 11:00',
//   //   '11:00 ~ 12:00',
//   //   '12:00 ~ 13:00',
//   //   '13:00 ~ 14:00',
//   //   '14:00 ~ 15:00',
//   //   '15:00 ~ 16:00',
//   //   '16:00 ~ 17:00',
//   //   '17:00 ~ 18:00',
//   //   '18:00 ~ 19:00',
//   //   '19:00 ~ 20:00',
//   //   '20:00 ~ 21:00',
//   // ];

//   const timeOptions = Array.from({ length: 12 }, (_, i) => ({
//     value: i + 9, // 9부터 시작하여 21까지
//     label: `${i + 9}:00 ~ ${i + 10}:00`,
//   }));

//   const handleTimeClick = (time) => {
//     setReservation_hour(time.value); // 객체 대신 값만 저장
//   };
//   const handleBagChange = (selectedOption) => {
//     if (selectedOption) {
//       setBag_id(selectedOption.value);
//       setSelectedBagLabel(selectedOption.label);
//     } else {
//       setBag_id(null);
//       setSelectedBagLabel('');
//     }
//   };

//   const handleBagClick = (id, label) => {
//     setBag_id(id);
//     setSelectedBagLabel(label);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!reservation_hour || !bag_id) {
//       alert('모든 필드를 선택해 주세요.');
//       return;
//     }

//     const requestBody = {
//       userId: user_id,
//       reservation_hour: reservation_hour,
//       bag_id,
//     };

//     const response = await fetch('/bags/form', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(requestBody),
//     });

//     if (response.ok) {
//       const data = await response.json();
//       alert(data.message);
//       navigate('/mypage');
//     } else {
//       const errorData = await response.json();
//       alert(errorData.message);
//     }
//   };

//   // 버튼 활성화 조건 확인
//   const isButtonEnabled = reservation_hour && bag_id;

//   return (
//     <div>
//       <NavbarTop></NavbarTop>
//       <div className="reservationPage">
//         <div className="reservation_title">
//           <h1>빈백 예약하기</h1>
//         </div>
//         <div className="reservation-container">
//           <div className="notice-section">
//             <h2>※안내사항※</h2>
//             <p>
//               [위치] 빈백은 중앙 도서관 3층 안내데스크 반대 방향에 있습니다.
//               <br />
//               [시간] 빈백 사용 가능시간은 평일 오전 9시부터 저녁 9시까지입니다.
//               <br />
//               [주의] 가져오신 짐, 쓰레기는 사용 종료시 꼭 챙겨주세요!!
//               <br />
//               [사용] 각 예약당 1시간, 일일 최대 2시간 예약 가능합니다.
//             </p>
//           </div>
//           <div className="form-userInfo">
//             <h3>예약자 확인</h3>
//             <div className="userInfo-row">
//               <span className="userInfo-label">이름</span>
//               <span className="userInfo-value">{name}</span>
//             </div>
//             <div className="userInfo-row">
//               <span className="userInfo-label">학번</span>
//               <span className="userInfo-value">{user_id}</span>
//             </div>
//             <div className="userInfo-row">
//               <span className="userInfo-label">연락처</span>
//               <span className="userInfo-value">{phone_num}</span>
//             </div>
//           </div>

//           <form className="submitForm" onSubmit={handleSubmit}>
//             <div className="form-hour">
//               <h3>시간 선택</h3>
//               <div className="time-bar">
//                 {timeOptions.map((time, index) => (
//                   <div
//                     key={index}
//                     className={`time-slot ${reservation_hour === time.value ? 'selected' : ''}`}
//                     onClick={() => handleTimeClick(time)}
//                   >
//                     {time.label}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="form-bag">
//               <h3>빈백 좌석 선택</h3>
//               <div className="bag-seats">
//                 {bagOptions.map((option) => (
//                   <div
//                     key={option.value}
//                     className={`bag-seat ${bag_id === option.value ? 'selected' : ''}`}
//                     onClick={() => handleBagClick(option.value, option.label)}
//                   >
//                     {option.label.split('번 빈백')[0]}
//                   </div>
//                 ))}
//               </div>
//               {selectedBagLabel && <p>{selectedBagLabel}을 선택하셨습니다.</p>}
//             </div>

//             <div className="submitBtnPlace">
//               <button type="submit" className={`submitBtn ${isButtonEnabled ? 'enabled' : ''}`}>
//                 예약완료
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }

// export default Reservation;

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
      <NavbarTop></NavbarTop>
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
                    className={`bag-seat ${bag_id === option.value ? 'selected' : ''} ${!isSlotAvailable(reservation_hour, option.value) ? 'unavailable' : ''}`}
                    onClick={() => handleBagClick(option.value, option.label)}
                  >
                    {option.label.split('번 빈백')[0]}
                  </div>
                ))}
              </div>
              {selectedBagLabel && <p>{selectedBagLabel}을 선택하셨습니다.</p>}
            </div>

            <div className="submitBtnPlace">
              <button type="submit" className={`submitBtn ${isButtonEnabled ? 'enabled' : ''}`} disabled={!isButtonEnabled}>
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
