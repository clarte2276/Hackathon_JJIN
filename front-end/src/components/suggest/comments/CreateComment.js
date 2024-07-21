import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateComment.css';

function CreateComment({ postId, onCommentSubmit }) {
  const [content, setContent] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // 댓글 목록 불러오기
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/suggest/comments/${postId}`);
        setComments(response.data);
      } catch (error) {
        console.error('댓글 목록 불러오기 중 오류 발생:', error);
      }
    };

    fetchComments();
  }, [postId]);

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newComment = {
      content,
    };

    try {
      await axios.post(`/suggest/PostView/${postId}/comments`, newComment, { withCredentials: true });
      onCommentSubmit(); // 댓글 등록 후 부모 컴포넌트에 콜백 호출
      setContent(''); // 입력창 초기화
      // 댓글 목록 다시 불러오기
      const response = await axios.get(`/suggest/comments/${postId}`);
      setComments(response.data);
    } catch (error) {
      console.error('댓글 작성 중 오류 발생:', error);
      alert('댓글을 작성하는 도중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="commentInput_layout">
          <textarea
            className="commentInput"
            name="content"
            placeholder="댓글을 남겨보세요"
            value={content}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="commentCreateBtn_layout">
          <input className="comment_CreateBtn" type="submit" value="등록"></input>
        </div>
      </form>
    </div>
  );
}

export default CreateComment;
