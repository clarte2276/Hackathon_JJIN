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

// 관리자 확인 함수
const isAdmin = (req) => {
  return (
    req.session.user &&
    req.session.user.name === "Admin" &&
    req.session.user.id === 1111
  );
};

// 게시판 데이터 및 검색 기능 통합
router.get("/", (req, res) => {
    const adminStatus = isAdmin(req);
    const keyword = req.query.keyword ? `%${req.query.keyword}%` : '%';
  
    pool.query(
      `SELECT no, user_id, title, content, DATE_FORMAT(created_date, '%y.%m.%d') AS created_date, file_data 
       FROM notice 
       WHERE title LIKE ? OR content LIKE ? OR user_id LIKE ? 
       ORDER BY created_date DESC`,
      [keyword, keyword, keyword],
      (error, results) => {
        if (error) {
          console.error("데이터베이스 오류:", error);
          res.status(500).json({
            error: "서버에서 게시판 데이터를 불러오는 중 오류가 발생했습니다.",
          });
        } else {
          res.json({
            admin: adminStatus,
            user: req.session.user,
            posts: results,
          });
        }
      }
    );
  });

// 새 글 작성 (관리자만)
router.post("/process/new_Post", upload.single("file"), (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).send("작성 권한이 없습니다.");
  }

  const { title, content } = req.body;
  const user_id = req.session.user.id;
  const createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
  const fileData = req.file ? req.file.buffer : null;

  pool.query(
    `INSERT INTO notice (user_id, title, content, created_date, file_data) VALUES (?, ?, ?, ?, ?)`,
    [user_id, title, content, createdDate, fileData],
    (error, result) => {
      if (error) {
        console.error("SQL 실행 중 오류 발생:", error);
        return res.status(500).send("Query 실패");
      }
      res.json({ no: result.insertId });
    }
  );
});

// 게시글 상세 보기
router.get("/PostView/:no", (req, res) => {
  const postId = req.params.no;
  const adminStatus = isAdmin(req);

  pool.query(
    `SELECT no, user_id, title, content, DATE_FORMAT(created_date, '%y.%m.%d') AS created_date, file_data FROM notice WHERE no = ?`,
    [postId],
    (error, results) => {
      if (error) {
        console.error("게시글 조회 오류:", error);
        return res.status(500).send("서버 오류");
      }
      if (results.length > 0) {
        const post = results[0];
        // Ensure file_data is either null or a valid buffer
        if (post.file_data) {
          post.file_data = post.file_data.toString("base64"); // Base64 인코딩
        } else {
          post.file_data = null; // Ensure file_data is always defined
        }
        res.json({ admin: adminStatus, post }); // Return the post wrapped in an object
      } else {
        res.status(404).send("게시물을 찾을 수 없습니다.");
      }
    }
  );
});

// 게시글 삭제 (관리자만)
router.delete("/PostView/:no/process/delete", (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).send("삭제 권한이 없습니다.");
  }

  const postId = req.params.no;

  pool.query("DELETE FROM notice WHERE no = ?", [postId], (error) => {
    if (error) {
      console.error("게시글 삭제 중 오류 발생:", error);
      return res.status(500).send("내부 서버 오류");
    }
    res.sendStatus(204);
  });
});

// 게시글 수정 (관리자만)
router.post(
  "/PostView/:no/process/update",
  upload.single("file"),
  (req, res) => {
    if (!isAdmin(req)) {
      return res.status(403).send("수정 권한이 없습니다.");
    }

    const postId = req.params.no;
    const { title, content } = req.body;
    const fileData = req.file ? req.file.buffer : null;
    const updatedDate = moment().format("YYYY-MM-DD HH:mm:ss");

    pool.query(
      `UPDATE notice SET title = ?, content = ?, updated_date = ?, file_data = IFNULL(?, file_data) WHERE no = ?`,
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

// 게시글의 파일 삭제 (관리자만)
router.delete("/PostView/:no/process/deleteFile", (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).send("삭제 권한이 없습니다.");
  }

  const postId = req.params.no;

  pool.query(
    `UPDATE notice SET file_data = NULL WHERE no = ?`,
    [postId],
    (error) => {
      if (error) {
        console.error("파일 삭제 중 오류 발생:", error);
        return res.status(500).send("내부 서버 오류");
      }
      res.send("파일 삭제 완료");
    }
  );
});

// 이미지 파일 서빙
router.get("/image/:id", (req, res) => {
  const id = req.params.id;
  pool.query(
    `SELECT file_data FROM notice WHERE no = ?`,
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

router.use("/notice", router);

module.exports = router;
