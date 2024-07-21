// user.js
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

// 사용자 정보 조회 (GET)
router.get("/api/user", (req, res) => {
  const session_id = req.session.user ? req.session.user.id : null;

  if (!session_id) {
    return res.status(401).send("Unauthorized");
  }

  pool.query(
    "SELECT name FROM users WHERE id = ?",
    [session_id],
    (error, results) => {
      if (error) {
        console.error("Error fetching user info:", error);
        return res.status(500).send("서버 오류");
      }
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).send("User not found");
      }
    }
  );
});

router.get("/api/empty", (req, res) => {
  pool.query(
    "SELECT * FROM empty_space WHERE reserved = FALSE",
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Database query error" });
      }
      res.json(results);
    }
  );
});

module.exports = router;
