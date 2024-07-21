const express = require("express");
const mysql = require("mysql");
const path = require("path");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const db_config = require("./config/db_config.json");
const app = express();
const cors = require("cors");
const http = require("http");

// MySQL 세션 스토어 옵션
const sessionStoreOptions = {
  host: db_config.host,
  port: db_config.port,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
};

const sessionStore = new MySQLStore(sessionStoreOptions);

// URL을 인코딩하는 코드
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const sessionMiddleware = session({
  key: "session_cookie_name",
  secret: "your_secret_key",
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
  },
});
app.use(sessionMiddleware);

// 정적 파일 제공
app.use(express.static(path.join(__dirname, "../front-end/build")));
app.use(express.static(path.join(__dirname, "public")));

// js파일 연동
const mypageRoutes = require("./function/mypage");
const loginRoutes = require("./function/login");
const signupRoutes = require("./function/signup");
const chatbotRoutes = require("./function/chatbot");
const userdataRoutes = require("./function/userdata");
const check_loginRoutes = require("./function/check_login");
const boardRoutes = require("./function/board");

app.use("/", mypageRoutes);
app.use("/", loginRoutes);
app.use("/", check_loginRoutes);
app.use("/", signupRoutes);
app.use("/", userdataRoutes);
app.use("/", chatbotRoutes);
app.use("/", socketRoutes);
app.use("/", boardRoutes);

// 서버 및 Socket.IO 설정
const server = http.createServer(app);

// Socket.IO 초기화
const initSocket = require("./function/chatbot");
initSocket(server, sessionMiddleware, db_config);

// 모든 요청은 build/index.html로
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../front-end/build", "index.html"));
});

// 서버 시작
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`);
});
