import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

import TitleBody from './element/TitleBody.js';
import List from './element/List.js';
import ColumnList from './element/ColumnList.js';
import RowList from './element/RowList.js';
import CreateButton from './element/CreateButton.js';
import PaginationCustom from './element/PaginationCustom.js';
import NavbarTop from '../navbar/NavbarTop.js';
import Footer from '../Footer.js';

import searchicon from '../images/searchicon.png';

import './Notice.css';

const Notice = () => {
  const [dataList, setDataList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const postsPerPage = 10;
  const location = useLocation();

  const fetchData = async (keyword = '') => {
    try {
      const endpoint = keyword ? `/notice?keyword=${encodeURIComponent(keyword)}` : '/notice';
      const response = await axios.get(endpoint);
      console.log('응답 데이터:', response.data);
      if (response.data.admin !== undefined) {
        setIsAdmin(response.data.admin);
      }
      setDataList(Array.isArray(response.data.posts) ? response.data.posts : []);
    } catch (error) {
      console.error('There was an error fetching the posts!', error);
    }
  };

  useEffect(() => {
    fetchData(); // 컴포넌트가 마운트될 때 데이터 가져오기
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
    <>
      <NavbarTop />
      <div className="NoticeAll_layout">
        <div className="NoticeTop_layout">
          <TitleBody title="공지사항" />
        </div>
        <List headersName={['제목', '작성자', '작성일']}>
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
        </List>
        <div className="searchContent_layout">
          <form onSubmit={handleSearch} className="SearchForm">
            <input
              className="searchform_input"
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="검색어를 입력하세요"
            />
            <button className="searchform_button" type="submit">
              <img className="searchicon" src={searchicon} alt="searchicon" width={20} height={20} />
            </button>
          </form>
          {isAdmin && <CreateButton nextNo={getNextNo()} />}
        </div>
        <div className="PaginationCustom">
          <PaginationCustom
            currentPage={currentPage}
            totalPages={Math.ceil(dataList.length / postsPerPage)}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Notice;
