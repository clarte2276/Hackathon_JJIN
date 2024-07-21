import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RandomChat.css";

function RandomChat() {
  const [randomMessage, setRandomMessage] = useState("");
  const [randomMessages, setRandomMessages] = useState([]);

  useEffect(() => {
    // 서버에서 메시지를 받아와서 설정하는 부분
    axios
      .get("/api/messages")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setRandomMessages(response.data);
        } else {
          setRandomMessages([]);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch messages:", error);
        setRandomMessages([]);
      });

    return () => {
      // Clean up
    };
  }, []);

  const sendRandomMessage = (e) => {
    e.preventDefault();
    if (randomMessage.trim()) {
      console.log("Sending random message:", randomMessage); // 메시지 로그 찍기
      axios
        .post("/api/messages", { message: randomMessage })
        .then((response) => {
          setRandomMessages([...randomMessages, response.data.message]);
          setRandomMessage("");
        })
        .catch((error) => {
          console.error("Failed to send message:", error);
        });
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>익명 랜덤 단체 채팅방</h1>
      </header>
      <div className="chat-box">
        <ul className="messages">
          {randomMessages.map((msg, index) => (
            <li key={index} className="message">
              {msg}
            </li>
          ))}
        </ul>
      </div>
      <form className="chat-form" onSubmit={sendRandomMessage}>
        <input
          className="message-input"
          placeholder="하고 싶은 말을 입력하세요..."
          autoComplete="off"
          value={randomMessage}
          onChange={(e) => setRandomMessage(e.target.value)}
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
}

export default RandomChat;
