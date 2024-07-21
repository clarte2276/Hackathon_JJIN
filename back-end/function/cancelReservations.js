const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const db_config = require("../config/db_config.json");
const pool = mysql.createPool({
  connectionLimit: 10,
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
  port: db_config.port,
  debug: false,
});
// 예약 취소
router.delete("/api/reservations/:id", (req, res) => {
  const { user_id, bag_id, reservation_hour } = req.query;

  if (!user_id || !bag_id || reservation_hour === undefined) {
    return res.status(400).json({ message: "모든 필드를 입력하세요." });
  }

  // 트랜잭션 시작
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("데이터베이스 연결 오류:", err);
      return res.status(500).json({ message: "서버 내부 오류" });
    }

    connection.beginTransaction((err) => {
      if (err) {
        console.error("트랜잭션 시작 오류:", err);
        connection.release();
        return res.status(500).json({ message: "서버 내부 오류" });
      }

      // bags 테이블에서 예약 취소 쿼리
      const deleteReservationQuery1 = `
        DELETE FROM bags 
        WHERE user_id = ? AND bag_id = ? AND reservation_hour = ? AND reservation_date = CURDATE()
      `;
      // bags2 테이블에서 예약 취소 쿼리
      const deleteReservationQuery2 = `
        DELETE FROM bags2 
        WHERE user_id = ? AND bag_id = ? AND reservation_hour = ? AND reservation_date = CURDATE()
      `;

      connection.query(
        deleteReservationQuery1,
        [user_id, bag_id, reservation_hour],
        (err, result1) => {
          if (err) {
            console.error("bags 테이블 예약 취소 오류:", err);
            return connection.rollback(() => {
              connection.release();
              return res.status(500).json({ message: "서버 내부 오류" });
            });
          }

          connection.query(
            deleteReservationQuery2,
            [user_id, bag_id, reservation_hour],
            (err, result2) => {
              if (err) {
                console.error("bags2 테이블 예약 취소 오류:", err);
                return connection.rollback(() => {
                  connection.release();
                  return res.status(500).json({ message: "서버 내부 오류" });
                });
              }

              if (result1.affectedRows === 0 && result2.affectedRows === 0) {
                return connection.rollback(() => {
                  connection.release();
                  return res
                    .status(404)
                    .json({ message: "해당 예약을 찾을 수 없습니다." });
                });
              }

              // 예약 카운트 감소 쿼리
              const updateReservationCountQuery = `
                UPDATE user_reservations 
                SET reservation_count = reservation_count - 1 
                WHERE user_id = ? AND reservation_date = CURDATE() AND reservation_count > 0
              `;
              connection.query(
                updateReservationCountQuery,
                [user_id],
                (err, result) => {
                  if (err) {
                    console.error("예약 카운트 감소 오류:", err);
                    return connection.rollback(() => {
                      connection.release();
                      return res
                        .status(500)
                        .json({ message: "서버 내부 오류" });
                    });
                  }

                  connection.commit((err) => {
                    if (err) {
                      console.error("트랜잭션 커밋 오류:", err);
                      return connection.rollback(() => {
                        connection.release();
                        return res
                          .status(500)
                          .json({ message: "서버 내부 오류" });
                      });
                    }

                    connection.release();
                    return res
                      .status(200)
                      .json({ message: "예약이 성공적으로 취소되었습니다." });
                  });
                }
              );
            }
          );
        }
      );
    });
  });
});

module.exports = router;
