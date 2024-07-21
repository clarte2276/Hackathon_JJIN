import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CRUDHeader from '../../notice/CRUD/CRUDHeader';
import NavbarTop from '../../navbar/NavbarTop';
import Footer from '../../Footer';
import '../../notice/CRUD/CRUD.css';
import axios from 'axios';

function UpdateSuggest() {
  const { no } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: '',
    body: '',
    file_data: null,
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    axios
      .get(`/suggest/PostView/${no}`)
      .then((response) => {
        const { post } = response.data;
        setPost({
          title: post.title,
          body: post.content,
          file_data: post.file_data,
        });
        setLoading(false);
        setCanEdit(true);
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          alert('수정 권한이 없습니다.');
          navigate(`/suggest/PostView/${no}`);
        } else {
          console.error('게시글을 불러오는 중 오류가 발생했습니다!', error);
          setError('게시글을 불러오는 중 오류가 발생했습니다!');
          setLoading(false);
        }
      });
  }, [no, navigate]);

  const onChange = (event) => {
    const { value, name } = event.target;
    setPost({
      ...post,
      [name]: value,
    });
  };

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const updatePost = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', post.title);
    formData.append('content', post.body);
    if (file) {
      formData.append('file', file);
    }

    try {
      await axios.post(`/suggest/PostView/${no}/process/update`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('수정되었습니다.');
      navigate(`/suggest/PostView/${no}`);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert('수정 권한이 없습니다.');
        navigate(`/suggest/PostView/${no}`);
      } else {
        console.error('게시글을 수정하는 중 오류가 발생했습니다:', error);
        alert('게시글을 수정하는 중 오류가 발생했습니다:');
      }
    }
  };

  const deleteFile = async () => {
    try {
      await axios.delete(`/suggest/PostView/${no}/process/deleteFile`, {
        withCredentials: true,
      });
      setPost({ ...post, file_data: null });
      alert('파일이 삭제되었습니다.');
    } catch (error) {
      console.error('파일 삭제 중 오류가 발생했습니다:', error);
      alert('파일 삭제 중 오류가 발생했습니다.');
    }
  };

  const backToList = () => {
    navigate(`/suggest/PostView/${no}`);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  if (!canEdit) {
    return <div>수정 권한이 없습니다.</div>;
  }

  return (
    <>
      <NavbarTop />
      <div>
        <CRUDHeader title="건의사항 글 수정" />
      </div>
      <form onSubmit={updatePost}>
        <div>
          <span>제목</span>
          <input type="text" name="title" placeholder="제목" value={post.title} onChange={onChange} />
        </div>
        <br />
        <div>
          <span>내용</span>
          <textarea name="body" placeholder="내용" value={post.body} onChange={onChange}></textarea>
        </div>
        <br />
        <div>
          <span>현재 업로드된 파일</span>
          {post.file_data ? (
            <>
              <img src={`data:image/jpeg;base64,${post.file_data}`} alt="Current Upload" width="200" />
              <br />
              <button type="button" onClick={deleteFile}>
                파일 삭제
              </button>
            </>
          ) : (
            <p>업로드된 파일이 없습니다.</p>
          )}
        </div>
        <div>
          <span>새로운 파일 업로드</span>
          <input type="file" onChange={onFileChange} />
        </div>
        <br />
        <button type="button" onClick={backToList}>
          취소
        </button>
        <input type="submit" value="수정하기" />
      </form>
      <Footer />
    </>
  );
}

export default UpdateSuggest;
