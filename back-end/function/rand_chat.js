const express = require("express");
const mysql = require("mysql");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const db_config = require("../config/db_config.json"); // DB 설정 파일

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const pool = mysql.createPool({
  connectionLimit: 10,
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
  port: db_config.port,
});

// 정적 파일 제공
app.use(express.static(path.join(__dirname, "../front-end/build")));
app.use(express.static(path.join(__dirname, "public")));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize socket connection
const initrandSocket = (server, sessionMiddleware, db_config) => {
  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("random message", (msg) => {
      console.log("Received message:", msg); // 메시지 로그 찍기
      if (!msg || msg.trim() === "") {
        return;
      }

      // 클라이언트로부터 받은 메시지를 데이터베이스에 저장
      pool.query(
        "INSERT INTO randomchat (message) VALUES (?)",
        [msg],
        (err) => {
          if (err) {
            console.error("Failed to save message to database:", err);
          } else {
            console.log("Message saved to database");
            io.emit("chat message", msg); // 모든 클라이언트로 메시지 전송
          }
        }
      );
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = initrandSocket;
