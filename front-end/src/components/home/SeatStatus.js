// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './SeatStatus.css';

// const SeatStatus = () => {
//   const [availableSeats, setAvailableSeats] = useState(0);
//   const [HavailableSeats, setHAvailableSeats] = useState(0);

//   useEffect(() => {
//     const fetchSeatData = async () => {
//       try {
//         const response = await axios.get('/api/empty_status');
//         setAvailableSeats(response.data.availableSeats);
//       } catch (error) {
//         console.error('Error fetching seat data:', error);
//       }
//     };

//     fetchSeatData();
//   }, []);

//   useEffect(() => {
//     const fetchSeatData = async () => {
//       try {
//         const response = await axios.get('/api/empty_status2');
//         setHAvailableSeats(response.data.HavailableSeats);
//       } catch (error) {
//         console.error('Error fetching seat data:', error);
//       }
//     };

//     fetchSeatData();
//   }, []);

//   return (
//     <div className="seat-status-container">
//       <div className="seat-status-header">
//         <h3>빈백 예약현황</h3>
//       </div>
//       <hr className="divider" />
//       <div className="seat-status-content">
//         <div className="seat-room">
//           <div className="room-name">중앙도서관</div>
//           <div className="room-seats">
//             <span className="available-seats">
//               <p>가능한 예약 갯수 : </p>
//               {availableSeats} / 168
//             </span>
//           </div>
//           <button className="reserve-button">
//             <Link to="/bag/form" className="reserveLink">
//               예약하기
//             </Link>
//           </button>
//         </div>
//         <hr className="divider_middle" />
//         <div className="seat-room">
//           <div className="room-name">학림관</div>
//           <div className="room-seats">
//             <span className="available-seats">
//               <p>가능한 예약 갯수 :</p>
//               {HavailableSeats} / 32
//             </span>
//           </div>
//           <button className="reserve-button">
//             {' '}
//             <Link to="/bag/form2" className="reserveLink">
//               예약하기
//             </Link>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SeatStatus;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SeatStatus.css';

const SeatStatus = () => {
  const [availableSeats, setAvailableSeats] = useState(0);
  const [HavailableSeats, setHAvailableSeats] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeatData = async () => {
      try {
        const response = await axios.get('/api/empty_status');
        setAvailableSeats(response.data.availableSeats);
      } catch (error) {
        console.error('Error fetching seat data:', error);
      }
    };

    fetchSeatData();
  }, []);

  useEffect(() => {
    const fetchSeatData = async () => {
      try {
        const response = await axios.get('/api/empty_status2');
        setHAvailableSeats(response.data.HavailableSeats);
      } catch (error) {
        console.error('Error fetching seat data:', error);
      }
    };

    fetchSeatData();
  }, []);

  const handleReserveClick = (path) => {
    window.scrollTo(0, 0); // 스크롤을 맨 위로 이동
    navigate(path);
  };

  return (
    <div className="seat-status-container">
      <div className="seat-status-header">
        <h3>빈백 예약현황</h3>
      </div>
      <hr className="divider" />
      <div className="seat-status-content">
        <div className="seat-room">
          <div className="room-name">중앙도서관</div>
          <div className="room-seats">
            <span className="available-seats">
              <p>예약 가능 갯수 : </p>
              {availableSeats} / 168
            </span>
          </div>
          <button className="reserve-button" onClick={() => handleReserveClick('/bag/form')}>
            예약하기
          </button>
        </div>
        <hr className="divider_middle" />
        <div className="seat-room">
          <div className="room-name">학림관</div>
          <div className="room-seats">
            <span className="available-seats">
              <p>예약 가능 갯수 :</p>
              {HavailableSeats} / 32
            </span>
          </div>
          <button className="reserve-button" onClick={() => handleReserveClick('/bag/form2')}>
            예약하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatStatus;
