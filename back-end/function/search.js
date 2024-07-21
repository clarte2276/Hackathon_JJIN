// 게시판 검색기능, sql이름, 보드타입 바꾸기
const express = require('express');
const mysql = require('mysql');
const db_config = require('../config/db_config.json');
const router = express.Router();

// MySQL 연결 풀 생성
const pool = mysql.createPool({
  connectionLimit: 10,
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
  port: db_config.port,
  debug: false,
});

// 유틸리티 함수: 쿼리 실행
const executeQuery = (query, params, res, callback) => {
  pool.getConnection((err, conn) => {
    if (err) {
      console.error('MySQL Connection Error', err);
      return res.status(500).send('DB 서버 연결 실패');
    }
    conn.query(query, params, (err, results) => {
      conn.release();
      if (err) {
        console.error('SQL 실행 시 오류 발생', err);
        return res.status(500).send('Query 실패');
      }
      callback(results);
    });
  });
};

// 게시판 검색 기능 (제목, 내용, 작성자 검색 가능)
const searchBoard = (keyword, res) => {
  const query = `SELECT no, user_id, title, content, DATE_FORMAT(created_date, '%Y년 %m월 %d일 %H시 %i분') AS created_date FROM notice WHERE (title LIKE ? OR content LIKE ? OR user_id LIKE ?) ORDER BY created_date DESC`;
  const searchKeyword = `%${keyword}%`;
  executeQuery(query, [searchKeyword, searchKeyword, searchKeyword], res, (results) => {
    if (results.length === 0) {
      res.status(404).json({ message: '검색된 게시물이 없습니다.' });
    } else {
      res.json(results);
    }
  });
};

// 게시판 목록 가져오기 기능
const getBoardList = (res) => {
  const query = `SELECT no, user_id, title, content, DATE_FORMAT(created_date, '%Y년 %m월 %d일 %H시 %i분') AS created_date FROM notice ORDER BY created_date DESC`;
  executeQuery(query, [], res, (results) => {
    if (results.length === 0) {
      res.status(404).json({ message: '게시물이 없습니다.' });
    } else {
      res.json(results);
    }
  });
};

// 검색 라우트 설정
router.get('/notice/search', (req, res) => {
  const { keyword } = req.query;
  if (!keyword) {
    return res.status(400).send('검색어를 입력하세요.');
  }
  searchBoard(keyword, res);
});

// 게시판 목록 가져오기 라우트 설정
router.get('/notice', (req, res) => {
  getBoardList(res);
});

module.exports = router;