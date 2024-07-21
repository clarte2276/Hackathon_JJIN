import React, { useState, useEffect } from 'react';
import axios from 'axios';

const useUserData = (initialData = {}) => {
  const [name, setName] = useState(initialData.name || '');
  const [phone_num, setPhone_num] = useState(initialData.phone_num || '');
  const [id, setId] = useState(initialData.id || ''); // 학번으로 사용
  const [password, setPassword] = useState(initialData.password || '');

  const fetchUserData = async () => {
    try {
      // 사용자가 로그인한 후 호출 (유저정보 가져오기)
      const response = await axios.post('/mypage', {}, { withCredentials: true });
      const userData = response.data;

      setName(userData.name || '');
      setPhone_num(userData.phone_num || '');
      setId(userData.id || '');
      setPassword(userData.password || '');
    } catch (error) {
      console.error('사용자 데이터를 가져오는 중 오류 발생:', error);
    }
  };

  // 초기 유저정보 가져옴
  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      const updateData = {
        name,
        phone_num,
        id,
        password,
      };

      // 정보 수정 시 데이터 전달 경로
      console.log('Sending update data:', updateData);
      const response = await axios.post('/mypage/process/update', updateData);

      if (response.status === 200) {
        alert('변경사항이 저장되었습니다.');
      } else {
        fetchUserData(); // 변경사항 저장 후 유저정보를 다시 불러옴
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('변경사항을 저장하는 데 오류가 발생했습니다:', error);
      alert('변경사항을 저장하는 데 오류가 발생했습니다.');
    }
  };

  return {
    name,
    phone_num,
    id,
    password,
    setName,
    setPhone_num,
    setId,
    setPassword,
    handleSave,
    fetchUserData,
  };
};

export default useUserData;
