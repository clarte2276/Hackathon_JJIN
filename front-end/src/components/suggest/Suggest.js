import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

import TitleBody from '../notice/element/TitleBody.js';
import List from '../notice/element/List.js';
import ColumnList from '../notice/element/ColumnList.js';
import RowList from '../notice/element/RowList.js';
import CreateButton from '../notice/element/CreateButton.js';
import PaginationCustom from '../notice/element/PaginationCustom.js';
import NavbarTop from '../navbar/NavbarTop.js';
import Footer from '../Footer.js';

import searchicon from '../images/searchicon.png';

import './Suggest.css';

const Suggest = () => {
  const [dataList, setDataList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const postsPerPage = 10;
  const location = useLocation();

  const fetchData = async (keyword = '') => {
    try {
      const endpoint = keyword ? `/suggest/search?keyword=${encodeURIComponent(keyword)}` : '/suggest';
      const response = await axios.get(endpoint);
      console.log('응답 데이터:', response.data);
      setDataList(response.data);
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
    <>
      <NavbarTop />
      <div className="SuggestAll_layout">
        <div className="SuggestTop_layout">
          <TitleBody
            title="건의사항"
            body1="본 게시판은 동국대학교 학생들의 만족스러운 학교생활을 위해 적극 반영될 예정입니다."
            body2="동국대학교 학생 여러분들의 자유롭고 다양한 의견을 기다립니다."
          />
          <div className="graynotice">
            <div className="graynotice1">*욕설 및 비속어를 사용한 게시물은 관리자에 의해 삭제될 수 있습니다.</div>
            <div className="graynotice2">
              *허위 사실이나 타인의 명예를 훼손하는 내용이 포함된 게시물은 관리자에 의해 삭제될 수 있습니다.{' '}
            </div>
          </div>
        </div>
        <List headersName={['제목', '작성자', '작성일']}>
          {currentPosts.length > 0 ? (
            currentPosts.map((item, index) => (
              <RowList key={index}>
                <ColumnList>
                  <Link to={`/suggest/PostView/${item.no}`} style={{ textDecoration: 'none' }}>
                    <div className="List_title">{item.title}</div>
                  </Link>
                </ColumnList>
                <ColumnList>익명</ColumnList>
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
          <CreateButton nextNo={getNextNo()} />
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

export default Suggest;
