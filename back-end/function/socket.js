const socketIo = require("socket.io");
const mysql = require("mysql");
require("dotenv").config();

const predefinedPrompts = {
  "TEXT 1":
    "우리 학교의 빈백의 위치는 중앙도서관 3층, 그리고 학림관 1층에 있어용~!! 가서 함께 편히 쉬어볼까용?😚",
  "TEXT 2":
    "중앙도서관은 09:00 ~ 21:00에 운영하며 빈백 개수는 20개, 학림관은 10:00 ~ 17:00에 운영하며 빈백 개수는 4개가 있어용~~🥰",
  "TEXT 3":
    "저는 유튜브로 수면 ASMR 음악을 들어용~~! 유튜브 링크로 추천해드릴게용~~😉'https://www.youtube.com/results?search_query=%EC%88%98%EB%A9%B4+ASMR'",
};

const initSocket = (server, sessionMiddleware, dbConfig) => {
  const io = socketIo(server);
  const pool = mysql.createPool({
    connectionLimit: 10,
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    port: dbConfig.port,
    charset: "utf8mb4",
    debug: false,
  });

  const updateLoggedInUsers = (roomId) => {
    pool.query(
      "SELECT user FROM messages WHERE room_id = ? GROUP BY user",
      [roomId],
      (err, results) => {
        if (err) {
          console.error("Failed to load users:", err);
        } else {
          const users = results.map((result) => result.user);
          io.to(roomId).emit("update user list", users);
        }
      }
    );
  };

  io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
  });

  io.on("connection", (socket) => {
    const session = socket.request.session;
    if (session && session.user) {
      const user = session.user.name;
      const userId = session.user.id;

      pool.query(
        "SELECT room_id FROM user_rooms WHERE user_id = ?",
        [userId],
        (err, results) => {
          if (err) {
            console.error("Failed to get user room:", err);
            return;
          }
          let roomId;
          if (results.length > 0) {
            roomId = results[0].room_id;
          } else {
            pool.query(
              "INSERT INTO rooms (name) VALUES (?)",
              [`${user}'s room`],
              (err, result) => {
                if (err) {
                  console.error("Failed to create room:", err);
                  return;
                }
                roomId = result.insertId;
                pool.query(
                  "INSERT INTO user_rooms (user_id, room_id) VALUES (?, ?)",
                  [userId, roomId],
                  (err) => {
                    if (err) {
                      console.error("Failed to link user to room:", err);
                    }
                  }
                );
              }
            );
          }

          socket.join(roomId);

          pool.query(
            "SELECT * FROM messages WHERE room_id = ? ORDER BY timestamp ASC",
            [roomId],
            (err, results) => {
              if (err) {
                console.error("Failed to load messages:", err);
              } else {
                socket.emit("init messages", results);
                updateLoggedInUsers(roomId);
              }
            }
          );

          socket.on("chat message", (msg) => {
            if (session && session.user) {
              const message = {
                user: session.user.name,
                text: msg.text,
                room_id: roomId,
              };

              pool.query(
                "INSERT INTO messages (user, text, room_id) VALUES (?, ?, ?)",
                [message.user, message.text, message.room_id],
                (err) => {
                  if (err) {
                    console.error("Failed to save message:", err);
                  } else {
                    io.to(roomId).emit("chat message", message);
                    updateLoggedInUsers(roomId);
                  }
                }
              );
            }
          });

          socket.on("gpt response", (msg) => {
            const gptMessage = {
              user: "내꿈코",
              text: msg.text,
              room_id: roomId,
            };

            pool.query(
              "INSERT INTO messages (user, text, room_id) VALUES (?, ?, ?)",
              [gptMessage.user, gptMessage.text, gptMessage.room_id],
              (err) => {
                if (err) {
                  console.error("Failed to save GPT message:", err);
                } else {
                  io.to(roomId).emit("gpt response", gptMessage);
                  updateLoggedInUsers(roomId);
                }
              }
            );
          });

          socket.on("ask chatbot", (msg) => {
            const predefinedResponse = predefinedPrompts[msg.label];
            if (predefinedResponse) {
              const gptMessage = {
                user: "내꿈코",
                text: predefinedResponse,
                room_id: roomId,
              };

              setTimeout(() => {
                pool.query(
                  "INSERT INTO messages (user, text, room_id) VALUES (?, ?, ?)",
                  [gptMessage.user, gptMessage.text, gptMessage.room_id],
                  (err) => {
                    if (err) {
                      console.error("Failed to save GPT message:", err);
                    } else {
                      io.to(roomId).emit("gpt response", gptMessage);
                      updateLoggedInUsers(roomId);
                    }
                  }
                );
              }, 500);
            } else {
              console.error("Predefined response not found for:", msg.label);
            }
          });

          socket.on("disconnect", () => {
            const user = session.user.name;

            pool.query(
              "DELETE FROM messages WHERE (user = ? OR user = '내꿈코') AND room_id = ?",
              [user, roomId],
              (err, result) => {
                if (err) {
                  console.error("Failed to delete messages:", err);
                } else {
                  console.log(
                    `Deleted messages for user ${user} and 내꿈코 in room ${roomId}`
                  );
                  console.log(`Deleted ${result.affectedRows} rows`);
                  updateLoggedInUsers(roomId);
                }
              }
            );

            socket.leave(roomId);
          });
        }
      );
    } else {
      console.log("Session not found for user");
    }
  });
};

module.exports = initSocket;
