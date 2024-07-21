import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CRUD.css';
import axios from 'axios';
import CRUDHeader from '../../notice/CRUD/CRUDHeader';
import NavbarTop from '../../navbar/NavbarTop';
import Footer from '../../Footer';

function CreateSuggest() {
  const navigate = useNavigate();

  const [board, setBoard] = useState({
    title: '',
    body: '',
  });
  const [file, setFile] = useState(null);

  const { title, body } = board;

  const onChange = (event) => {
    const { value, name } = event.target;
    setBoard({
      ...board,
      [name]: value,
    });
  };

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const saveBoard = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('content', body);
    formData.append('created_date', new Date().toISOString());

    try {
      const response = await axios.post(`/suggest/process/new_Post`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const newPostId = response.data.no;
      alert('등록되었습니다.');
      navigate(`/suggest/PostView/${newPostId}`, { state: { newPost: response.data } });
    } catch (error) {
      console.error('Error saving post:', error);
      alert('글을 저장하는 도중 오류가 발생했습니다.');
    }
  };

  const backToList = () => {
    navigate('/suggest');
  };

  return (
    <>
      <NavbarTop />
      <div className="Create_all">
        <div>
          <div className="header_layout">
            <CRUDHeader title="건의사항 글쓰기" />
          </div>
          <form onSubmit={saveBoard}>
            <div className="titleBody_layout">
              <div>
                <p>
                  <span className="titleBody_name">제목</span>
                </p>
                <input
                  className="titleInput"
                  type="text"
                  name="title"
                  placeholder="제목을 입력하세요"
                  value={title}
                  onChange={onChange}
                />
              </div>
            </div>
            <br />
            <div className="titleBody_layout">
              <div>
                <p>
                  <span className="titleBody_name">내용</span>
                </p>
                <textarea
                  className="BodyInput"
                  name="body"
                  placeholder="내용을 입력하세요"
                  value={body}
                  onChange={onChange}
                ></textarea>
              </div>
            </div>
            <br />
            <div className="titleBody_layout">
              <div>
                <p>
                  <span className="titleBody_name">사진 업로드</span>
                </p>
                <input className="imgUp" type="file" onChange={onFileChange} />
              </div>
            </div>
            <br />
            <div className="btn_layout">
              <button className="backBtn" type="button" onClick={backToList}>
                취소
              </button>
              <input className="CreateBtn" type="submit" value="등록하기"></input>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CreateSuggest;
