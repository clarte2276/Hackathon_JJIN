// import React, { useState } from 'react';
// import axios from 'axios';

// function CreateComment({ postId, onCommentSubmit }) {
//   const [content, setContent] = useState('');

//   const handleChange = (event) => {
//     setContent(event.target.value);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const newComment = {
//       content,
//     };

//     try {
//       await axios.post(`/suggest/PostView/${postId}/comments`, newComment, { withCredentials: true });
//       onCommentSubmit(); // 댓글 등록 후 부모 컴포넌트에 콜백 호출
//       setContent(''); // 입력창 초기화
//     } catch (error) {
//       console.error('댓글 작성 중 오류 발생:', error);
//       alert('댓글을 작성하는 도중 오류가 발생했습니다.');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <textarea
//           className="commentInput"
//           name="content"
//           placeholder="댓글을 남겨보세요"
//           value={content}
//           onChange={handleChange}
//         ></textarea>
//       </div>
//       <div>
//         <input type="submit" value="등록"></input>
//       </div>
//     </form>
//   );
// }

// export default CreateComment;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  const handleDelete = async (commentId) => {
    const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');

    if (confirmDelete) {
      try {
        await axios.delete(`/comments/${commentId}`, { withCredentials: true });
        // 댓글 목록 다시 불러오기
        const response = await axios.get(`/suggest/comments/${postId}`);
        setComments(response.data);
      } catch (error) {
        console.error('댓글 삭제 중 오류 발생:', error);
        alert('댓글 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <textarea
            className="commentInput"
            name="content"
            placeholder="댓글을 남겨보세요"
            value={content}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <input type="submit" value="등록"></input>
        </div>
      </form>

      <div>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div className="comment_all" key={comment.comment_no}>
              <div>
                <div className="commentNickname">익명</div>
                <div>{comment.content}</div>
                <div className="commentDate">{comment.created_date}</div>
                <div>
                  <button onClick={() => handleDelete(comment.comment_no)}>삭제</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>댓글이 없습니다.</div>
        )}
      </div>
    </div>
  );
}

export default CreateComment;
