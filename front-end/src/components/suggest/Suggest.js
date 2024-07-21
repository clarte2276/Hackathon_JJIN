import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

import TitleBody from "../notice/element/TitleBody.js";
import List from "../notice/element/List.js";
import ColumnList from "../notice/element/ColumnList.js";
import RowList from "../notice/element/RowList.js";
import CreateButton from "../notice/element/CreateButton.js";
import PaginationCustom from "../notice/element/PaginationCustom.js";
import NavbarTop from "../navbar/NavbarTop.js";
import Footer from "../Footer.js";

import "./Suggest.css";

const Suggest = () => {
  const [dataList, setDataList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const postsPerPage = 10;
  const location = useLocation();

  const fetchData = async (keyword = "") => {
    try {
      const endpoint = keyword
        ? `/suggest/search?keyword=${encodeURIComponent(keyword)}`
        : "/suggest";
      const response = await axios.get(endpoint);
      console.log("응답 데이터:", response.data);
      setDataList(response.data);
    } catch (error) {
      console.error("There was an error fetching the posts!", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (location.state && location.state.newPost) {
      console.log("새 게시글 추가:", location.state.newPost);
      setDataList((prevDataList) => [location.state.newPost, ...prevDataList]);
    }
  }, [location.state]);

  const getNextNo = () => {
    return dataList.length > 0
      ? Math.max(...dataList.map((post) => post.no)) + 1
      : 1;
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
          <TitleBody title="건의사항" body="이곳은 건의사항 페이지입니다" />
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
        <List headersName={["제목", "작성자", "작성일"]}>
          {currentPosts.length > 0 ? (
            currentPosts.map((item, index) => (
              <RowList key={index}>
                <ColumnList>
                  <Link
                    to={`/suggest/PostView/${item.no}`}
                    style={{ textDecoration: "none" }}
                  >
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
        <CreateButton nextNo={getNextNo()} />
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
