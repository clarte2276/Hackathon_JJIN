import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CRUDHeader from '../../notice/CRUD/CRUDHeader';
import NavbarTop from '../../navbar/NavbarTop';
import Footer from '../../Footer';
import CreateComment from '../comments/CreateComment';
import './CRUD.css';

function ReadSuggest() {
  const { no } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const postResponse = await axios.get(`/suggest/PostView/${no}`);
        console.log('응답 데이터:', postResponse.data);
        setPost(postResponse.data.post);

        const commentsResponse = await axios.get(`/suggest/comments/${no}`);
        setComments(commentsResponse.data);

        // 이미지 로드
        if (postResponse.data.post.file_data) {
          const imageResponse = await axios.get(`/suggest/image/${no}`, {
            responseType: 'arraybuffer',
          });
          const base64 = btoa(
            new Uint8Array(imageResponse.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          setImageSrc(`data:image/jpeg;base64,${base64}`);
        }

        setLoading(false);
      } catch (error) {
        console.error('게시글을 불러오는 중 오류 발생:', error);
        setError('게시글을 불러오는 중 오류 발생');
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [no]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');

    if (confirmDelete) {
      try {
        await axios.delete(`/suggest/Postview/${no}/process/delete`);
        alert('게시글이 삭제되었습니다.');
        navigate('/suggest');
      } catch (error) {
        if (error.response && error.response.status === 403) {
          alert('삭제 권한이 없습니다.');
        } else {
          console.error('게시글 삭제 중 오류 발생:', error);
          alert('게시글 삭제 중 오류가 발생했습니다.');
        }
      }
    }
  };

  const handleCommentSubmit = async () => {
    // 댓글 등록 후 댓글 목록 다시 불러오기
    try {
      const commentsResponse = await axios.get(`/suggest/comments/${no}`);
      setComments(commentsResponse.data);
    } catch (error) {
      console.error('댓글 목록을 다시 불러오는 중 오류 발생:', error);
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  const { title, created_date, content } = post;

  return (
    <>
      <NavbarTop />
      <div className="Read_all">
        <div>
          <div className="header_layout">
            <CRUDHeader title="건의사항" />
          </div>
          <div className="ReadTitle">{title}</div>
          <div className="infoUpdateDelete">
            <div className="info">
              <div>익명</div>
              <div>{created_date}</div>
            </div>
            <div className="updateDelete">
              <div>
                <Link to={`/suggest/Postview/${no}/process/update`}>수정</Link>
                <div onClick={handleDelete} style={{ cursor: 'pointer' }}>
                  삭제
                </div>
              </div>
            </div>
          </div>
          <div className="ReadContent">
            {imageSrc && <img src={imageSrc} alt="Post" />}
            <p>{content}</p>
          </div>
          <div>댓글</div>
          <div>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div className="comment_all" key={comment.comment_no}>
                  <div>
                    <div className="commentNickname">{comment.nickname}</div>
                    <div>{comment.content}</div>
                    <div className="commentDate">{comment.created_date}</div>
                  </div>
                </div>
              ))
            ) : (
              <div>댓글이 없습니다.</div>
            )}
          </div>
          <div>
            <div>내 닉네임</div>
            <CreateComment postId={no} onCommentSubmit={handleCommentSubmit} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ReadSuggest;
