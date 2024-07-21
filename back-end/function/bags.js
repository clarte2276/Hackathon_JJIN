const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const db_config = require("../config/db_config.json");

// MySQL 연결 설정
const pool = mysql.createPool({
  connectionLimit: 10,
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
  port: db_config.port,
  debug: false,
});

// 예약 가능 시간대 확인 및 예약 페이지
router.get("/bags/form", (req, res) => {
  const currentDate = new Date();
  const dateString = currentDate.toISOString().split("T")[0];

  pool.query(
    `
    SELECT bag_id, reservation_hour
    FROM bags
    WHERE reservation_date = ?
  `,
    [dateString],
    (err, rows) => {
      if (err) {
        console.error("예약 가능 시간대 확인 오류:", err);
        return res.status(500).json({ message: "서버 내부 오류" });
      }

      const availability = {};
      for (let i = 1; i <= 14; i++) {
        // 좌석 수를 14로 수정
        availability[i] = Array(12).fill(true); // 9시부터 21시까지 12시간
      }

      rows.forEach((row) => {
        availability[row.bag_id][row.reservation_hour - 9] = false;
      });

      res.json({ availability });
    }
  );
});

// 예약하기
router.post("/bags/form", (req, res) => {
  const { userId, reservation_hour, bag_id } = req.body;

  if (!userId || !bag_id || reservation_hour === undefined) {
    return res.status(400).json({ message: "모든 필드를 입력하세요." });
  }

  const currentDate = new Date();
  const currentDateString = currentDate.toISOString().split("T")[0];

  pool.query(`SELECT NOW()`, (err, currentHourRows) => {
    if (err) {
      console.error("현재 시간 확인 오류:", err);
      return res.status(500).json({ message: "서버 내부 오류" });
    }

    const serverDate = new Date(currentHourRows[0]["NOW()"]);
    const serverDateString = serverDate.toISOString().split("T")[0];

    if (currentDateString !== serverDateString) {
      return res.status(400).json({ message: "당일 예약만 가능합니다." });
    }

    // 이미 동일 시간대에 동일 좌석이 예약되었는지 확인
    pool.query(
      `
      SELECT COUNT(*) as count
      FROM bags
      WHERE bag_id = ? AND reservation_hour = ? AND reservation_date = ?
    `,
      [bag_id, reservation_hour, currentDateString],
      (err, existingReservations) => {
        if (err) {
          console.error("예약 확인 오류:", err);
          return res.status(500).json({ message: "서버 내부 오류" });
        }

        if (existingReservations[0].count > 0) {
          return res.status(400).json({ message: "이미 예약된 좌석입니다." });
        }

        // 사용자의 동일 시간대 예약 여부 확인
        pool.query(
          `
        SELECT COUNT(*) as count
        FROM bags
        WHERE user_id = ? AND reservation_hour = ? AND reservation_date = ?
      `,
          [userId, reservation_hour, currentDateString],
          (err, userSameTimeReservations) => {
            if (err) {
              console.error("사용자 동일 시간대 예약 확인 오류:", err);
              return res.status(500).json({ message: "서버 내부 오류" });
            }

            if (userSameTimeReservations[0].count > 0) {
              return res.status(400).json({
                message: "동일 시간대에 이미 예약한 좌석이 있습니다.",
              });
            }

            // 사용자의 당일 예약 횟수 확인
            pool.query(
              `
          SELECT reservation_count
          FROM user_reservations
          WHERE user_id = ? AND reservation_date = ?
        `,
              [userId, currentDateString],
              (err, userReservations) => {
                if (err) {
                  console.error("사용자 예약 확인 오류:", err);
                  return res.status(500).json({ message: "서버 내부 오류" });
                }

                const reservationCount =
                  userReservations.length > 0
                    ? userReservations[0].reservation_count
                    : 0;

                if (reservationCount >= 2) {
                  return res.status(400).json({
                    message: "하루 최대 예약 가능 시간은 2시간입니다.",
                  });
                }

                // 예약 삽입
                pool.query(
                  `
            INSERT INTO bags (user_id, bag_id, reservation_hour, reservation_date)
            VALUES (?, ?, ?, ?)
          `,
                  [userId, bag_id, reservation_hour, currentDateString],
                  (err) => {
                    if (err) {
                      if (err.code === "ER_DUP_ENTRY") {
                        // 중복 예약인 경우
                        console.error("예약 시 오류 (중복):", err);
                        return res
                          .status(400)
                          .json({ message: "이미 예약된 좌석입니다." });
                      } else {
                        // 기타 오류
                        console.error("예약 시 오류:", err);
                        return res
                          .status(500)
                          .json({ message: "서버 에러가 발생했습니다." });
                      }
                    }

                    // 예약 성공 시 해당 사용자의 예약 횟수를 증가시킴
                    pool.query(
                      `
              INSERT INTO user_reservations (user_id, reservation_date, reservation_count)
              VALUES (?, ?, 1)
              ON DUPLICATE KEY UPDATE reservation_count = reservation_count + 1
            `,
                      [userId, currentDateString],
                      (err) => {
                        if (err) {
                          console.error("예약 횟수 업데이트 오류:", err);
                          return res
                            .status(500)
                            .json({ message: "서버 에러가 발생했습니다." });
                        }

                        res
                          .status(201)
                          .json({ message: "예약이 완료되었습니다." });
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  });
});

// 예약 내역 확인
router.get("/api/reservations", (req, res) => {
  const userId = req.query.user_id;

  if (!userId) {
    return res.status(400).send("사용자 ID가 필요합니다.");
  }

  pool.query(
    "SELECT * FROM bags WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.error("예약 내역 가져오기 오류:", err);
        return res.status(500).send("서버 내부 오류");
      }

      res.status(200).json(results);
    }
  );
});

// 예약 취소
router.delete("/api/reservations/:id", (req, res) => {
  const { user_id, bag_id, reservation_hour } = req.query;

  if (!user_id || !bag_id || reservation_hour === undefined) {
    return res.status(400).json({ message: "모든 필드를 입력하세요." });
  }

  pool.query(
    `
    DELETE FROM bags WHERE user_id = ? AND bag_id = ? AND reservation_hour = ? AND reservation_date = CURDATE()
  `,
    [user_id, bag_id, reservation_hour],
    (err, result) => {
      if (err) {
        console.error("예약 취소 오류:", err);
        return res.status(500).json({ message: "서버 내부 오류" });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "해당 예약을 찾을 수 없습니다." });
      }

      res.status(200).json({ message: "예약이 성공적으로 취소되었습니다." });
    }
  );
});

module.exports = router;
