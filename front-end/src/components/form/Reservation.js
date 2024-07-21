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
                <input type="radio" value="time1" checked={reservation_hour === 'time1'} onChange={handleHourChange} />
                9:00 ~ 10:00
              </label>
              <label>
                <input type="radio" value="time2" checked={reservation_hour === 'time2'} onChange={handleHourChange} />
                10:00 ~ 11:00
              </label>
              <label>
                <input type="radio" value="time3" checked={reservation_hour === 'time3'} onChange={handleHourChange} />
                11:00 ~ 12:00
              </label>
              <label>
                <input type="radio" value="time4" checked={reservation_hour === 'time4'} onChange={handleHourChange} />
                12:00 ~ 13:00
              </label>
              <label>
                <input type="radio" value="time5" checked={reservation_hour === 'time5'} onChange={handleHourChange} />
                13:00 ~ 14:00
              </label>
              <label>
                <input type="radio" value="time6" checked={reservation_hour === 'time6'} onChange={handleHourChange} />
                14:00 ~ 15:00
              </label>
            </div>
            <div>
              <label>
                <input type="radio" value="time7" checked={reservation_hour === 'time7'} onChange={handleHourChange} />
                15:00 ~ 16:00
              </label>
              <label>
                <input type="radio" value="time8" checked={reservation_hour === 'time8'} onChange={handleHourChange} />
                116:00 ~ 17:00
              </label>
              <label>
                <input type="radio" value="time9" checked={reservation_hour === 'time9'} onChange={handleHourChange} />
                17:00 ~ 18:00
              </label>
              <label>
                <input
                  type="radio"
                  value="time10"
                  checked={reservation_hour === 'time10'}
                  onChange={handleHourChange}
                />
                18:00 ~ 19:00
              </label>
              <label>
                <input
                  type="radio"
                  value="time11"
                  checked={reservation_hour === 'time11'}
                  onChange={handleHourChange}
                />
                19:00 ~ 20:00
              </label>
              <label>
                <input
                  type="radio"
                  value="time12"
                  checked={reservation_hour === 'time12'}
                  onChange={handleHourChange}
                />
                20:00 ~ 21:00
              </label>
            </div>
          </div>

          <div className="form-bag">
            <h3>빈백 선택</h3>
            <Select
              className="bagIdAlt"
              options={bagOptions}
              value={bagOptions.find((option) => option.value === bag_id)}
              onChange={handleBagChange}
              placeholder="빈백 번호를 선택해주세요."
              styles={customSelectStyle}
              isClearable
            />
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
