import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NoticeHome.css';
import notice from '../../images/notice.png';

function NoticeHome() {
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    // 백엔드에서 게시글 목록을 가져옴
    axios
      .post(`/notice`)
      .then((response) => {
        console.log('응답 데이터:', response.data); // 응답 데이터 출력
        setDataList(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the posts!', error);
      });
  }, []);

  return (
    <div className="Notice_all">
      <div className="nameLink_layout">
        <div className="notice_layout">
          <div className="notice_name">공지사항</div>
        </div>
      </div>
      <div className="Notice_title_body">
        {dataList.length > 0 ? (
          (() => {
            const items = [];
            for (let i = 0; i < Math.min(2, dataList.length); i++) {
              items.push(
                <div key={i} className="Notice_body">
                  <h3>{dataList[i].title}</h3>
                  <div className="Notice_body_body">
                    {dataList[i].content.length > 10
                      ? `${dataList[i].content.substring(0, 10)}...`
                      : dataList[i].content}
                  </div>
                  <div>{i === 0 && <div className="BorderLine"></div>}</div>
                </div>
              );
            }
            return items;
          })()
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}

export default NoticeHome;
