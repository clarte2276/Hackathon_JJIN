// suggest 게시판 기능
const express = require("express");
const mysql = require("mysql");
const db_config = require("../config/db_config.json");
const moment = require("moment");
const multer = require("multer");
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

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 파일 사이즈 제한 20MB
});

// 로그인 확인 함수
const isLoggedIn = (req) => {
  return req.session.user;
};

// 게시판 데이터 가져오기
router.post("/suggest", (req, res) => {
  pool.query(
    `SELECT no, user_id, title, content, DATE_FORMAT(created_date, '%y.%m.%d %H:%i') AS created_date FROM suggests ORDER BY created_date DESC`,
    (error, results) => {
      if (error) {
        console.error("데이터베이스 오류:", error);
        res
          .status(500)
          .json({
            error: "서버에서 게시판 데이터를 불러오는 중 오류가 발생했습니다.",
          });
      } else {
        res.json(results);
      }
    }
  );
});

// 새 글 작성
router.post("/suggest/process/new_Post", upload.single("file"), (req, res) => {
  if (!isLoggedIn(req)) {
    return res.status(403).send("로그인해야 게시글을 작성할 수 있습니다.");
  }

  const { title, content } = req.body;
  const user_id = req.session.user.id;
  const createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
  const fileData = req.file ? req.file.buffer : null;

  pool.query(
    `INSERT INTO suggests (user_id, title, content, created_date, file_data) VALUES (?, ?, ?, ?, ?)`,
    [user_id, title, content, createdDate, fileData],
    (error, result) => {
      if (error) {
        console.error("게시글 등록 중 오류 발생:", error);
        res.status(500).json({ error: "게시글 등록 중 오류가 발생했습니다." });
      } else {
        const newPostId = result.insertId;
        res.json({ no: newPostId });
      }
    }
  );
});

// 게시글 상세 보기
router.get("/suggest/PostView/:no", (req, res) => {
  const postId = req.params.no;

  pool.query(
    `SELECT no, user_id, title, content, DATE_FORMAT(created_date, '%y.%m.%d %H:%i') AS created_date, file_data FROM suggests WHERE no = ?`,
    [postId],
    (error, results) => {
      if (error) {
        console.error("게시글 조회 오류:", error);
        return res.status(500).send("서버 오류");
      }
      if (results.length > 0) {
        const post = results[0];
        if (post.file_data) {
          post.file_data = post.file_data.toString("base64"); // Base64 인코딩
        } else {
          post.file_data = null;
        }
        res.json({ post });
      } else {
        res.status(404).send("게시물을 찾을 수 없습니다.");
      }
    }
  );
});

// 게시글 삭제
router.delete("/suggest/PostView/:no/process/delete", (req, res) => {
  if (!isLoggedIn(req)) {
    return res.status(403).send("로그인해야 게시글을 삭제할 수 있습니다.");
  }

  const postId = req.params.no;
  const userId = req.session.user.id;

  pool.query(
    "SELECT user_id FROM suggests WHERE no = ?",
    [postId],
    (error, results) => {
      if (error) {
        console.error("쿼리 실행 중 오류 발생: ", error);
        return res.status(500).send("내부 서버 오류");
      }
      if (results.length === 0) {
        return res.status(404).send("게시물을 찾을 수 없습니다.");
      }
      if (results[0].user_id !== userId) {
        return res.status(403).send("삭제 권한이 없습니다.");
      }
      pool.query("DELETE FROM suggests WHERE no = ?", [postId], (error) => {
        if (error) {
          console.error("게시글 삭제 중 오류 발생:", error);
          return res.status(500).send("내부 서버 오류");
        }
        res.sendStatus(204);
      });
    }
  );
});

// 게시글 수정
router.post(
  "/suggest/PostView/:no/process/update",
  upload.single("file"),
  (req, res) => {
    if (!isLoggedIn(req)) {
      return res.status(403).send("로그인해야 게시글을 수정할 수 있습니다.");
    }

    const postId = req.params.no;
    const { title, content } = req.body;
    const fileData = req.file ? req.file.buffer : null;
    const updatedDate = moment().format("YYYY-MM-DD HH:mm:ss");
    const userId = req.session.user.id;

    pool.query(
      "SELECT user_id FROM suggests WHERE no = ?",
      [postId],
      (error, results) => {
        if (error) {
          console.error("쿼리 실행 중 오류 발생: ", error);
          return res.status(500).send("내부 서버 오류");
        }
        if (results.length === 0) {
          return res.status(404).send("게시물을 찾을 수 없습니다.");
        }
        if (results[0].user_id !== userId) {
          return res.status(403).send("수정 권한이 없습니다.");
        }
        pool.query(
          `UPDATE suggests SET title = ?, content = ?, updated_date = ?, file_data = IFNULL(?, file_data) WHERE no = ?`,
          [title, content, updatedDate, fileData, postId],
          (error) => {
            if (error) {
              console.error("게시글 수정 중 오류 발생:", error);
              return res.status(500).send("내부 서버 오류");
            }
            res.send("게시물 수정 완료");
          }
        );
      }
    );
  }
);

// 게시글의 파일 삭제
router.delete("/suggest/PostView/:no/process/deleteFile", (req, res) => {
  if (!isLoggedIn(req)) {
    return res.status(403).send("로그인해야 파일을 삭제할 수 있습니다.");
  }

  const postId = req.params.no;
  const userId = req.session.user.id;

  pool.query(
    "SELECT user_id FROM suggests WHERE no = ?",
    [postId],
    (error, results) => {
      if (error) {
        console.error("쿼리 실행 중 오류 발생: ", error);
        return res.status(500).send("내부 서버 오류");
      }
      if (results.length === 0) {
        return res.status(404).send("게시물을 찾을 수 없습니다.");
      }
      if (results[0].user_id !== userId) {
        return res.status(403).send("삭제 권한이 없습니다.");
      }
      pool.query(
        `UPDATE suggests SET file_data = NULL WHERE no = ?`,
        [postId],
        (error) => {
          if (error) {
            console.error("파일 삭제 중 오류 발생:", error);
            return res.status(500).send("내부 서버 오류");
          }
          res.send("파일 삭제 완료");
        }
      );
    }
  );
});

// 이미지 파일 서빙
router.get("/suggest/image/:id", (req, res) => {
  const id = req.params.id;
  pool.query(
    `SELECT file_data FROM suggests WHERE no = ?`,
    [id],
    (error, results) => {
      if (error) {
        console.error("이미지 조회 오류:", error);
        return res.status(500).send("서버 오류");
      }
      if (results.length === 0 || !results[0].file_data) {
        return res.status(404).send("이미지를 찾을 수 없습니다.");
      }
      res.writeHead(200, { "Content-Type": "image/jpeg" });
      res.end(results[0].file_data);
    }
  );
});

// 댓글 등록
router.post("/suggest/PostView/:no/comments", (req, res) => {
  if (!isLoggedIn(req)) {
    return res.status(403).send("로그인해야 댓글을 작성할 수 있습니다.");
  }

  const postId = req.params.no;
  const { content } = req.body;
  const name = "익명"; // 댓글 작성자의 이름 (익명으로 설정)
  const createdDate = moment().format("YYYY-MM-DD HH:mm:ss");

  pool.query(
    `INSERT INTO comments (board_no, name, content, created_date) VALUES (?, ?, ?, ?)`,
    [postId, name, content, createdDate],
    (error) => {
      if (error) {
        console.error("댓글 등록 중 오류 발생:", error);
        res.status(500).json({ error: "댓글 등록 중 오류가 발생했습니다." });
      } else {
        res.json({ message: "댓글이 성공적으로 등록되었습니다." });
      }
    }
  );
});

// 댓글 목록 불러오기
router.get("/suggest/comments/:no", (req, res) => {
  const postId = req.params.no;

  pool.query(
    'SELECT comment_no, name, content, DATE_FORMAT(created_date, "%y.%m.%d %H:%i") as created_date FROM comments WHERE board_no = ? ORDER BY created_date ASC',
    [postId],
    (error, results) => {
      if (error) {
        console.error("댓글 목록 불러오기 중 오류 발생:", error);
        res
          .status(500)
          .json({ error: "댓글 목록을 불러오는 중 오류가 발생했습니다." });
      } else {
        res.json(results);
      }
    }
  );
});

// // 댓글 삭제
// router.delete('/comments/:comment_no', (req, res) => {
//   if (!isLoggedIn(req)) {
//     return res.status(403).send('로그인해야 댓글을 삭제할 수 있습니다.');
//   }

//   const commentId = req.params.comment_no;
//   const userId = req.session.user.id;

//   pool.query('SELECT user_id FROM comments WHERE comment_no = ?', [commentId], (error, results) => {
//     if (error) {
//       console.error('쿼리 실행 중 오류 발생: ', error);
//       return res.status(500).send('내부 서버 오류');
//     }
//     if (results.length === 0) {
//       return res.status(404).send('댓글을 찾을 수 없습니다.');
//     }
//     if (results[0].user_id !== userId) {
//       return res.status(403).send('삭제 권한이 없습니다.');
//     }
//     pool.query('DELETE FROM comments WHERE comment_no = ?', [commentId], (error) => {
//       if (error) {
//         console.error('댓글 삭제 중 오류 발생:', error);
//         return res.status(500).send('내부 서버 오류');
//       }
//       res.sendStatus(204);
//     });
//   });
// });

// 댓글 삭제
router.delete("/comments/:comment_no", (req, res) => {
  if (!isLoggedIn(req)) {
    return res.status(403).send("로그인해야 댓글을 삭제할 수 있습니다.");
  }

  const commentId = req.params.comment_no;
  // 댓글 삭제 요청 시 userId를 사용하지 않고 바로 삭제
  pool.query(
    "DELETE FROM comments WHERE comment_no = ?",
    [commentId],
    (error) => {
      if (error) {
        console.error("댓글 삭제 중 오류 발생:", error);
        return res.status(500).send("내부 서버 오류");
      }
      res.sendStatus(204);
    }
  );
});

module.exports = router;
