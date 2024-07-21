// user.js
const express = require("express");
const mysql = require("mysql");
const db_config = require("../config/db_config.json");
const router = express.Router();
const cron = require("node-cron");
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
  pool.query("SELECT COUNT(*) AS total FROM bags", (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Database query error" });
    }
    const totalReserved = results[0].total;
    const availableSeats = 168 - totalReserved;
    res.json({ availableSeats });
  });
});

router.get("/api/empty2", (req, res) => {
  pool.query("SELECT COUNT(*) AS total FROM bags2", (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Database query error" });
    }
    const HtotalReserved = results[0].total;
    const HavailableSeats = 32 - HtotalReserved;
    res.json({ availableSeats: HavailableSeats });
  });
});

router.get("/api/empty_status", (req, res) => {
  pool.query("SELECT COUNT(*) AS total FROM bags", (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Database query error" });
    }
    const totalReserved = results[0].total;
    const availableSeats = 168 - totalReserved;
    res.json({ availableSeats });
  });
});

router.get("/api/empty_status2", (req, res) => {
  pool.query("SELECT COUNT(*) AS total FROM bags2", (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Database query error" });
    }
    const HtotalReserved = results[0].total;
    const HavailableSeats = 32 - HtotalReserved;
    res.json({ HavailableSeats });
  });
});

router.get("/api/user_reserve", (req, res) => {
  const { user_id } = req.query;
  pool.query(
    "SELECT reservation_count FROM user_reservations WHERE user_id = ? AND reservation_date = CURDATE()",
    [user_id],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Database query error" });
      }

      if (results.length === 0) {
        return res.json({ reservation_count: 0 });
      }

      const reservationCount = results[0].reservation_count;
      res.json({ reservation_count: reservationCount });
    }
  );
});

// API 라우트 추가
router.get("/api/messages", (req, res) => {
  pool.query("SELECT message FROM randomchat", (err, results) => {
    if (err) {
      console.error("Failed to fetch messages:", err);
      res.status(500).send("Failed to fetch messages");
    } else {
      res.json(results.map((row) => row.message));
    }
  });
});

router.post("/api/messages", (req, res) => {
  const message = req.body.message;
  if (!message || message.trim() === "") {
    return res.status(400).send("Message is empty");
  }

  pool.query(
    "INSERT INTO randomchat (message) VALUES (?)",
    [message],
    (err, result) => {
      if (err) {
        console.error("Failed to save message to database:", err);
        res.status(500).send("Failed to save message");
      } else {
        console.log("Message saved to database");
        res.json({ message });
      }
    }
  );
});

router.post("/api/notice", (req, res) => {
  const query = "SELECT no, title FROM notice ORDER BY created_date DESC";

  pool.query(query, (err, results) => {
    if (err) {
      console.error("게시글 목록 조회 중 오류 발생:", err);
      res.status(500).send("서버 오류");
      return;
    }

    res.json({ posts: results });
  });
});
// 매일 자정에 count 리셋
cron.schedule("0 0 * * *", () => {
  pool.query(
    "UPDATE user_reservations SET reservation_count = 0",
    (err, result) => {
      if (err) {
        console.error("예약 count 리셋 오류:", err);
      } else {
        console.log("예약 count가 리셋되었습니다.");
      }
    }
  );
});
cron.schedule("0 0 * * *", () => {
  pool.query("TRUNCATE TABLE bags", (err, result) => {
    if (err) {
      console.error("테이블 비우기 오류:", err);
    } else {
      console.log("bags 테이블이 초기화되었습니다.");
    }
  });
});

//랜덤채팅방 초기화
const initializeRandomChat = () => {
  pool.query("TRUNCATE TABLE randomchat", (err, result) => {
    if (err) {
      console.error("테이블 비우기 오류:", err);
    } else {
      console.log("randomchat 테이블이 초기화되었습니다.");
      const initialMessage = {
        message:
          "안녕하세요~ 랜덤채팅방입니다! 랜덤채팅방은 5분마다 초기화됩니다! 즐겁게 놀아보세용~",
        created_at: new Date(),
      };

      pool.query(
        "INSERT INTO randomchat SET ?",
        initialMessage,
        (err, result) => {
          if (err) {
            console.error("초기 메시지 삽입 오류:", err);
          } else {
            console.log("초기 메시지가 삽입되었습니다.");
          }
        }
      );
    }
  });
};

// 매 시간마다 실행
cron.schedule("*/5 * * * *", initializeRandomChat);

module.exports = router;
