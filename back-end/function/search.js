const express = require("express");
const mysql = require("mysql");
const db_config = require("../config/db_config.json");
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

const executeQuery = (query, params, res, callback) => {
  pool.getConnection((err, conn) => {
    if (err) {
      console.error("MySQL Connection Error", err);
      return res.status(500).send("DB 서버 연결 실패");
    }
    conn.query(query, params, (err, results) => {
      conn.release();
      if (err) {
        console.error("SQL 실행 시 오류 발생", err);
        return res.status(500).send("Query 실패");
      }
      callback(results);
    });
  });
};

const searchNoticeBoard = (keyword, res) => {
  const query = `SELECT no, user_id, title, content, DATE_FORMAT(created_date, '%Y년 %m월 %d일 %H시 %i분') AS created_date FROM notice WHERE (title LIKE ? OR content LIKE ? OR user_id LIKE ?) ORDER BY created_date DESC`;
  const searchKeyword = `%${keyword}%`;
  executeQuery(
    query,
    [searchKeyword, searchKeyword, searchKeyword],
    res,
    (results) => {
      if (results.length === 0) {
        res.status(404).json({ message: "검색된 게시물이 없습니다." });
      } else {
        res.json(results);
      }
    }
  );
};

const getNoticeBoardList = (res) => {
  const query = `SELECT no, user_id, title, content, DATE_FORMAT(created_date, '%Y년 %m월 %d일 %H시 %i분') AS created_date FROM notice ORDER BY created_date DESC`;
  executeQuery(query, [], res, (results) => {
    if (results.length === 0) {
      res.status(404).json({ message: "게시물이 없습니다." });
    } else {
      res.json(results);
    }
  });
};

router.get("/notice/search", (req, res) => {
  const { keyword } = req.query;
  if (!keyword) {
    return res.status(400).send("검색어를 입력하세요.");
  }
  searchNoticeBoard(keyword, res);
});

router.get("/notice", (req, res) => {
  getNoticeBoardList(res);
});

const searchSuggestBoard = (keyword, res) => {
  const query = `SELECT no, user_id, title, content, DATE_FORMAT(created_date, '%Y년 %m월 %d일 %H시 %i분') AS created_date FROM suggests WHERE (title LIKE ? OR content LIKE ? OR user_id LIKE ?) ORDER BY created_date DESC`;
  const searchKeyword = `%${keyword}%`;
  executeQuery(
    query,
    [searchKeyword, searchKeyword, searchKeyword],
    res,
    (results) => {
      if (results.length === 0) {
        res.status(404).json({ message: "검색된 게시물이 없습니다." });
      } else {
        res.json(results);
      }
    }
  );
};

const getSuggestBoardList = (res) => {
  const query = `SELECT no, user_id, title, content, DATE_FORMAT(created_date, '%Y년 %m월 %d일 %H시 %i분') AS created_date FROM suggests ORDER BY created_date DESC`;
  executeQuery(query, [], res, (results) => {
    if (results.length === 0) {
      res.status(404).json({ message: "게시물이 없습니다." });
    } else {
      res.json(results);
    }
  });
};

router.get("/suggest/search", (req, res) => {
  const { keyword } = req.query;
  if (!keyword) {
    return res.status(400).send("검색어를 입력하세요.");
  }
  searchSuggestBoard(keyword, res);
});

router.get("/suggest", (req, res) => {
  getSuggestBoardList(res);
});

module.exports = router;
