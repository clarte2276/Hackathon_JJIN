// 게시판 댓글 기능, sql이름, 게시판 이름 확인
const express = require("express");
const mysql = require("mysql");
const db_config = require("../config/db_config.json");
const moment = require("moment");
const router = express.Router();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
  port: db_config.port,
  debug: false,
});

// 댓글 데이터 가져오기
const getComments = (boardType, boardNo, res) => {
    pool.query(
      `SELECT comment_no, nickname, content, created_date FROM comments WHERE board_type = ? AND board_no = ?`,
      [boardType, boardNo],
      (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).send("서버 오류");
        } else {
          res.json(results);
        }
      }
    );
  };
  
  // 댓글 등록
  const insertComment = (boardType, boardNo, nickname, content, createdDate, res) => {
    pool.getConnection((err, conn) => {
      if (err) {
        console.log("MySQL Connection Error", err);
        res.status(500).send("DB 서버 연결 실패");
        return;
      }
  
      conn.query(
        `INSERT INTO comments (board_no, board_type, nickname, content, created_date) VALUES (?, ?, ?, ?, ?)`,
        [boardNo, boardType, nickname, content, createdDate],
        (err, result) => {
          conn.release();
          if (err) {
            console.log("SQL 실행 시 오류 발생", err);
            res.status(500).send("Query 실패");
            return;
          }
          res.json({ success: true, message: "댓글이 등록되었습니다." });
        }
      );
    });
  };
  
  // 댓글 수정
  const updateComment = (commentNo, content, updatedDate, req, res) => {
    pool.query(
      `SELECT nickname FROM comments WHERE comment_no = ?`,
      [commentNo],
      (error, results) => {
        if (error) {
          console.error("쿼리 실행 중 오류 발생: ", error);
          res.status(500).send("내부 서버 오류");
          return;
        }
  
        if (results.length > 0 && results[0].nickname === req.session.user.nickname) {
          pool.query(
            `UPDATE comments SET content = ?, created_date = ? WHERE comment_no = ?`,
            [content, updatedDate, commentNo],
            (error) => {
              if (error) {
                console.error("쿼리 실행 중 오류 발생: ", error);
                res.status(500).send("내부 서버 오류");
              } else {
                console.log("댓글 수정 완료");
                res.json({ success: true, message: "댓글이 수정되었습니다." });
              }
            }
          );
        } else {
          res.status(403).send("수정 권한이 없습니다.");
        }
      }
    );
  };
  
  // 댓글 삭제
  const deleteComment = (commentNo, req, res) => {
    pool.query(
      `SELECT nickname FROM comments WHERE comment_no = ?`,
      [commentNo],
      (error, results) => {
        if (error) {
          console.error("쿼리 실행 중 오류 발생: ", error);
          res.status(500).send("내부 서버 오류");
          return;
        }
  
        if (results.length > 0 && results[0].nickname === req.session.user.nickname) {
          pool.query(
            `DELETE FROM comments WHERE comment_no = ?`,
            [commentNo],
            (error) => {
              if (error) {
                console.error("쿼리 실행 중 오류 발생: ", error);
                res.status(500).send("내부 서버 오류");
              } else {
                console.log("댓글 삭제 완료");
                res.json({ success: true, message: "댓글이 삭제되었습니다." });
              }
            }
          );
        } else {
          res.status(403).send("삭제 권한이 없습니다.");
        }
      }
    );
  };
  
// 댓글 작성 게시판 타입 //수정할부분
const boards = ["joy", "sadness", "fear", "anxiety"];

boards.forEach((board) => {
  // 댓글 데이터 가져오기
  router.get(`/${board}/comments/:boardNo`, (req, res) => {
    getComments(board, req.params.boardNo, res);
  });

  // 댓글 등록
  router.post(`/${board}/writecomments/:boardNo`, (req, res) => {
    const { content } = req.body;
    const nickname = req.session.user.nickname;
    const createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
    insertComment(board, req.params.boardNo, nickname, content, createdDate, res);
  });

  // 댓글 수정
  router.put(`/${board}/process/updatecomments/:commentNo`, (req, res) => {
    const { content } = req.body;
    const updatedDate = moment().format("YYYY-MM-DD HH:mm:ss");
    updateComment(req.params.commentNo, content, updatedDate, req, res);
  });

  // 댓글 삭제
  router.delete(`/${board}/process/deletecomments/:commentNo`, (req, res) => {
    deleteComment(req.params.commentNo, req, res);
  });
});

router.use("{board}/Postview/:no", router);
module.exports = router;