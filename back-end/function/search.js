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

// 게시판 검색 기능 //제목, 내용, 작성자 검색 가능
const searchBoard = (boardType, keyword, res) => {
  const query = `SELECT no, title, nickname, content, DATE_FORMAT(created_date, '%Y년 %m월 %d일 %H시 %i분') AS created_date FROM community WHERE board_type = ? AND (title LIKE ? OR content LIKE ? OR nickname LIKE ?)`;
  const searchKeyword = `%${keyword}%`;
  executeQuery(query, [boardType, searchKeyword, searchKeyword, searchKeyword], res, (results) => {
    if (results.length === 0) {
      res.status(404).json({ message: '검색된 게시물이 없습니다.' });
    } else {
      res.json(results);
    }
  });
};

// 게시판 목록 가져오기 기능
const getBoardList = (boardType, res) => {
  const query = `SELECT no, title, nickname, content, DATE_FORMAT(created_date, '%Y년 %m월 %d일 %H시 %i분') AS created_date FROM community WHERE board_type = ?`;
  executeQuery(query, [boardType], res, (results) => {
    if (results.length === 0) {
      res.status(404).json({ message: '게시물이 없습니다.' });
    } else {
      res.json(results);
    }
  });
};

// 각각의 게시판 검색 라우터 생성
const createSearchRoutes = (boardType) => {
  // 검색 라우트 설정
  router.get(`/${boardType}/search`, (req, res) => {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).send('검색어를 입력하세요.');
    }
    searchBoard(boardType, keyword, res);
  });

  // 게시판 목록 가져오기 라우트 설정
  router.get(`/${boardType}`, (req, res) => {
    getBoardList(boardType, res);
  });
};

// 각각의 게시판 검색 및 목록 가져오기 라우트 설정 //수정할부분!!
const boards = ['joy', 'sadness', 'fear', 'anxiety'];
boards.forEach(board => createSearchRoutes(board));

module.exports = router;
