import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

import TitleBodyNotice from './element/TitleBodyNotice.js';
import ListNotice from './element/ListNotice.js';
import ColumnList from './element/ColumnList.js';
import RowList from './element/RowList.js';
import CreateButtonNotice from './element/CreateButtonNotice.js';
import PaginationCustom from './element/PaginationCustom.js';
import Footer from '../Footer.js';

import './Notice.css';

const Notice = () => {
  const [dataList, setDataList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const postsPerPage = 10;
  const location = useLocation();

  const fetchData = async (keyword = '') => {
    try {
      const endpoint = keyword ? `/notice/search?keyword=${encodeURIComponent(keyword)}` : '/notice';
      const response = await axios.get(endpoint);
      console.log('응답 데이터:', response.data);
      setDataList(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('There was an error fetching the posts!', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (location.state && location.state.newPost) {
      console.log('새 게시글 추가:', location.state.newPost);
      setDataList((prevDataList) => [location.state.newPost, ...prevDataList]);
    }
  }, [location.state]);

  const getNextNo = () => {
    return dataList.length > 0 ? Math.max(...dataList.map((post) => post.no)) + 1 : 1;
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = dataList.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData(searchKeyword);
  };

  return (
    <div className="NoticeAll_layout">
      <div className="NoticeTop_layout">
        <TitleBodyNotice title="공지사항" body="이곳은 공지사항 안내하는 페이지입니다" />
        <form onSubmit={handleSearch} className="SearchForm">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="검색어를 입력하세요"
          />
          <button type="submit">검색</button>
        </form>
      </div>
      <ListNotice headersName={['제목', '작성자', '작성일']}>
        {currentPosts.length > 0 ? (
          currentPosts.map((item, index) => (
            <RowList key={index}>
              <ColumnList>
                <Link to={`/notice/PostView/${item.no}`} style={{ textDecoration: 'none' }}>
                  <div className="List_title">{item.title}</div>
                </Link>
              </ColumnList>
              <ColumnList>관리자</ColumnList>
              <ColumnList>{item.created_date}</ColumnList>
            </RowList>
          ))
        ) : (
          <div>게시글이 없습니다.</div>
        )}
      </ListNotice>
      <CreateButtonNotice nextNo={getNextNo()} />
      <div className="PaginationCustom">
        <PaginationCustom
          currentPage={currentPage}
          totalPages={Math.ceil(dataList.length / postsPerPage)}
          onPageChange={handlePageChange}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Notice;
