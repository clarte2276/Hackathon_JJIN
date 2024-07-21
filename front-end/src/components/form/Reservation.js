import React, { useState, useEffect } from 'react';
import './Reservation.css';
import { useNavigate } from 'react-router-dom';
import useUserData from '../../useUserData';

function Reservation() {
  const navigate = useNavigate();
  const { name, id: user_id, phone_num } = useUserData();

  const [reservation_hour, setReservation_hour] = useState(null);
  const [bag_id, setBag_id] = useState(null); // 빈백 좌석 번호

  const handleHourChange = (event) => {
    setReservation_hour(event.target.value);
  };

  const handleBagChange = (event) => {
    setBag_id(event.target.value);
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

  // 버튼 활성화 조건 확인
  const isButtonEnabled = reservation_hour && bag_id;

  return (
    <div className="reservationPage">
      <div className="reservation_title">
        <h1>예약하기</h1>
      </div>
      <div className="reservation-container">
        <div className="notice-section">
          <h2>주의사항</h2>
          <p>
            - 대운동장의 총 수용 인원은 20,000명입니다.
            <br />
            - 귀중품은 소지하지 않을 것을 권장합니다.
            <br />
            * 대운동장 내 분실물에 대한 책임은 본인에게 있음을 사전에 알립니다.
            <br />
            - 건강상에 문제가 있는 분들은 관람을 삼가 주시기 바랍니다.
            <br />
            * 개인의 질병으로 인한 불가피한 사고에 대해 주최 측은 책임지지 않습니다.
            <br />
            - 출연진과의 동선 근거리 접근을 제한합니다.
            <br />
            * 음식물과 선물 반입을 제한하오니 양해 부탁드립니다.
            <br />
            - 싸이 무대 중 물대포 사용으로 옷이 젖을 수 있음을 안내드립니다.
            <br />- 방송국 촬영으로 인해 이후 송출될 수 있음을 미리 고지드립니다.
          </p>
        </div>
        <div className="form-userInfo">
          <h3>예약자 확인</h3>
          <p>이름: {name}</p>
          <p>학번: {user_id}</p>
          <p>연락처: {phone_num}</p>
        </div>
        <form className="submitForm" onSubmit={handleSubmit}>
          <div className="form-hour">
            <h3>시간 선택</h3>
            <div>
              <label>
                <input type="radio" value="time1" checked={date === 'time1'} onChange={handleHourChange} />
                9:00 ~ 10:00
              </label>
              <label>
                <input type="radio" value="time2" checked={date === 'time2'} onChange={handleHourChange} />
                10:00 ~ 11:00
              </label>
              <label>
                <input type="radio" value="time3" checked={date === 'time3'} onChange={handleHourChange} />
                11:00 ~ 12:00
              </label>
              <label>
                <input type="radio" value="time4" checked={date === 'time4'} onChange={handleHourChange} />
                12:00 ~ 13:00
              </label>
              <label>
                <input type="radio" value="time5" checked={date === 'time5'} onChange={handleHourChange} />
                13:00 ~ 14:00
              </label>
              <label>
                <input type="radio" value="time6" checked={date === 'time6'} onChange={handleHourChange} />
                14:00 ~ 15:00
              </label>
            </div>
            <div>
              <label>
                <input type="radio" value="time7" checked={date === 'time7'} onChange={handleHourChange} />
                15:00 ~ 16:00
              </label>
              <label>
                <input type="radio" value="time8" checked={date === 'time8'} onChange={handleHourChange} />
                116:00 ~ 17:00
              </label>
              <label>
                <input type="radio" value="time9" checked={date === 'time9'} onChange={handleHourChange} />
                17:00 ~ 18:00
              </label>
              <label>
                <input type="radio" value="time10" checked={date === 'time10'} onChange={handleHourChange} />
                18:00 ~ 19:00
              </label>
              <label>
                <input type="radio" value="time11" checked={date === 'time11'} onChange={handleHourChange} />
                19:00 ~ 20:00
              </label>
              <label>
                <input type="radio" value="time12" checked={date === 'time12'} onChange={handleHourChange} />
                20:00 ~ 21:00
              </label>
            </div>
          </div>

          <div className="form-bag">
            <h3>좌석 선택</h3>
            <label>
              <input type="radio" value="time1" checked={date === 'time1'} onChange={handleHourChange} />
              9:00 ~ 10:00
            </label>

            <label>
              <input
                type="radio"
                value="bag1"
                checked={student_state === 'students'}
                onChange={handleStudentStateChange}
              />
              재학생
            </label>
            <label>
              <input
                type="radio"
                value="others"
                checked={student_state === 'others'}
                onChange={handleStudentStateChange}
              />
              외부인
            </label>
            {student_state === 'students' && (
              <p className="state_notice">재학생인 경우 증빙자료를 제출하셔야 합니다.</p>
            )}
          </div>
          {student_state === 'students' && (
            <div className="form-imgupload">
              <h3>동국대학교 재학생 증빙서류 제출</h3>
              <div className="imguploadBtn">
                <input type="file" id="file" onChange={handleFileChange} style={{ display: 'none' }} />
                <label htmlFor="file" className="file-label">
                  파일 선택
                </label>
                {file && <span className="file-name">{file.name}</span>}
              </div>
            </div>
          )}
          <div className="form-payment">
            <h3>결제</h3>
            <p>무통장입금 : 국민 1000000000000000</p>
            <p className="payment-notice">
              24시간 내로 입금하셔야 예매가 확정됩니다. 입금하시지 않는 경우 자동취소됩니다. 은행에 따라 밤 11시 30분
              이후로는 온라인 입금이 제한될 수 있습니다.
            </p>
          </div>
          <div className="submitBtnPlace">
            <button type="submit" className={`submitBtn ${isButtonEnabled ? 'enabled' : ''}`}>
              예매완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Reservation;
