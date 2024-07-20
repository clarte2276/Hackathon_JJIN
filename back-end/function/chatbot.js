const socketIo = require("socket.io");
const mysql = require("mysql");
const axios = require("axios");
require("dotenv").config();

const predefinedPrompts = {
  "TEXT 1":
    "이번 공연 라인업은 뉴진스, 싸이, 제이팍, 방탄소년단이 옵니당!! 정말 기대되죠?? ㅎ_ㅎ",
  "TEXT 2":
    "이번 공연은 18:30에 시작합니다!! 그 전에는 동아리 공연이 있으니 함께 즐겨봐용~~",
  "TEXT 3":
    "티켓 수령은 본인이 직접 와서 해야하며, 주민등록증 또는 운전면허증으로 본인 대조를 합니당!! 신분증 꼭 챙겨와주세용~~",
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

  let loggedInUsers = [];

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
              [user + "'s room"],
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
                const formattedMessages = results.map((msg) => {
                  if (msg.user === "With 티아코") {
                    return { ...msg, user: user };
                  }
                  return msg;
                });
                socket.emit("init messages", formattedMessages);
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

          socket.on("ask chatbot", async (msg) => {
            const predefinedResponse = predefinedPrompts[msg];
            if (predefinedResponse) {
              const gptMessage = {
                user: "티아코",
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
                      io.to(roomId).emit("chat message", gptMessage);
                      updateLoggedInUsers(roomId);
                    }
                  }
                );
              }, 500);
            } else {
              try {
                const prompt = `너는 이제부터 "동국대학교 티케팅요정 티아코"처럼 말할 거야. 티아코는 친절하게 말해. 티아코의 평소 말투 예시는 다음과 같아 "안녕하세요! 동국대학교 티케팅요정 티아코예용~!
티켓팅 방법, 축제 등에 대해서 궁금한 내용을 질문하면 답변해드릴게용~~" 지금부터 티아코처럼 답변하되 이모지는 절대로 사용하지마.: "${msg}"`;

                const response = await axios.post(
                  "https://api.openai.com/v1/chat/completions",
                  {
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: 150,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                      "Content-Type": "application/json",
                    },
                  }
                );

                const gptResponse =
                  response.data.choices[0].message.content.trim();
                const gptMessage = {
                  user: "티아코",
                  text: gptResponse,
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
                        io.to(roomId).emit("chat message", gptMessage);
                        updateLoggedInUsers(roomId);
                      }
                    }
                  );
                }, 500);
              } catch (error) {
                console.error("Error fetching from OpenAI:", error);
              }
            }
          });

          socket.on("disconnect", () => {
            const user = session.user.name;
            const specialUser = "티아코";
            const withSpecialUser = "With 티아코";

            pool.query(
              "DELETE FROM messages WHERE (user = ? OR user = ? OR user = ?) AND room_id = ?",
              [user, specialUser, withSpecialUser, roomId],
              (err, result) => {
                if (err) {
                  console.error("Failed to delete messages:", err);
                } else {
                  console.log(
                    `Deleted messages for user ${user}, ${specialUser}, and ${withSpecialUser} in room ${roomId}`
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
