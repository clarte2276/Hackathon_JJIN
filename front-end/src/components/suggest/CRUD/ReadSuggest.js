import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavbarTop from '../../navbar/NavbarTop';
import Footer from '../../Footer';
import CreateComment from '../comments/CreateComment';
import commenticon from '../../images/commenticon.png';
import './CRUD.css';

function ReadSuggest() {
  const { no } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageSrc, setImageSrc] = useState('');
  const [currentUser, setCurrentUser] = useState(null); // 현재 사용자 정보

  useEffect(() => {
    // 현재 로그인한 사용자 정보 가져오기
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('/current_user', { withCredentials: true });
        setCurrentUser(response.data);
      } catch (error) {
        console.error('사용자 정보를 불러오는 중 오류 발생:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const postResponse = await axios.get(`/suggest/PostView/${no}`);
        console.log('응답 데이터:', postResponse.data);
        setPost(postResponse.data.post);

        const commentsResponse = await axios.get(`/suggest/comments/${no}`);
        // commentsResponse.data가 배열인지 확인
        setComments(Array.isArray(commentsResponse.data) ? commentsResponse.data : []);

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
      // commentsResponse.data가 배열인지 확인
      setComments(Array.isArray(commentsResponse.data) ? commentsResponse.data : []);
    } catch (error) {
      console.error('댓글 목록을 다시 불러오는 중 오류 발생:', error);
    }
  };

  const handleCommentDelete = async (commentId) => {
    const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');

    if (confirmDelete) {
      try {
        await axios.delete(`/comments/${commentId}`, { withCredentials: true });
        const commentsResponse = await axios.get(`/suggest/comments/${no}`);
        setComments(Array.isArray(commentsResponse.data) ? commentsResponse.data : []);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          alert('삭제 권한이 없습니다.');
        } else {
          console.error('댓글 삭제 중 오류 발생:', error);
          alert('댓글 삭제 중 오류가 발생했습니다.');
        }
      }
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

  const backToList = () => {
    navigate('/suggest');
  };

  const { title, created_date, content } = post;

  return (
    <>
      <NavbarTop />
      <div className="Read_all">
        <div>
          <div className="orangeSuggest">건의사항</div>
          <div className="ReadTitle">{title}</div>
          <div className="infoUpdateDelete">
            <div className="info">
              <div>익명</div>
              <div className="commentDate">{created_date}</div>
            </div>
            <div className="updateDelete">
              <Link className="ReadUpdate" to={`/suggest/Postview/${no}/process/update`}>
                수정
              </Link>
              <div onClick={handleDelete} style={{ cursor: 'pointer' }}>
                삭제
              </div>
            </div>
          </div>
          <div className="Suggest_underline"></div>
          <div className="ReadContent">
            {imageSrc && <img src={imageSrc} alt="Post" />}
            <p>{content}</p>
          </div>
          <div className="ReadBackBtn_layout">
            <button className="Read_backBtn" type="button" onClick={backToList}>
              이전 페이지
            </button>
          </div>
          <div className="commentLogo">
            <img src={commenticon} alt="댓글 로고" width={27} height={26} />
            <div>댓글</div>
          </div>
          <div>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div className="comment_all" key={comment.comment_no}>
                  <div className="comment_width">
                    <div className="commentNickname">익명</div>
                    <br />
                    <div>{comment.content}</div>
                    <br />
                    <div className="commentdateDelete_layout">
                      <div className="commentDate">{comment.created_date}</div>
                      <div>
                        {currentUser && currentUser.id === comment.user_id && (
                          <button className="commentDelete" onClick={() => handleCommentDelete(comment.comment_no)}>
                            삭제
                          </button>
                        )}
                      </div>
                    </div>
                    <br />
                  </div>
                </div>
              ))
            ) : (
              <div>댓글이 없습니다.</div>
            )}
          </div>
          <div>
            <CreateComment postId={no} onCommentSubmit={handleCommentSubmit} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ReadSuggest;
