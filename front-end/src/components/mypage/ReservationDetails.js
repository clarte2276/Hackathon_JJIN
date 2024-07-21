import React, { useEffect, useState } from 'react';
import './ReservationDetails.css';
import axios from 'axios';
import useUserData from '../useUserData';

function ReservationDetails() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id: user_id } = useUserData();

  useEffect(() => {
    // Fetch reservation data from the server
    const fetchReservations = async () => {
      try {
        const response = await axios.get('/api/reservations', {
          params: { user_id },
        });
        setReservations(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reservation data:', error);
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user_id]);

  const handleCancelReservation = async (reservation) => {
    const confirmCancel = window.confirm('정말로 이 예약을 취소하시겠습니까?');
    if (!confirmCancel) return;

    try {
      const response = await axios.delete(`/api/reservations/${reservation.id}`, {
        params: {
          user_id: user_id,
          bag_id: reservation.bag_id,
          reservation_hour: reservation.reservation_hour,
        },
      });
      alert(response.data.message);
      setReservations(reservations.filter((res) => res.id !== reservation.id));
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      alert('예약 취소 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="reservation-details">
      <h2>예약내역</h2>
      <div className="reservation-underline"></div>
      {reservations.length === 0 ? (
        <p className="no-reservations">예약 내역이 없습니다.</p>
      ) : (
        <table>
          <thead>
            <tr className="ReservationDetails_tr">
              <th className="ReservationDetails_th">빈백 좌석 번호</th>
              <th className="ReservationDetails_th">예약 시간</th>
              <th className="ReservationDetails_th">취소</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr className="ReservationDetails_tr" key={reservation.id}>
                <td className="ReservationDetails_td">{reservation.bag_id}번 빈백</td>
                <td className="ReservationDetails_td">{reservation.reservation_hour}</td>
                <td className="ReservationDetails_td">
                  <div className="cancelBtnContent">
                    <button className="cancelBtn" onClick={() => handleCancelReservation(reservation)}>
                      취소
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ReservationDetails;
