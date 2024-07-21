import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./Chatbot.css";
import chatbotImg from "../images/chatbotImg.png";
import sendBtn from "../images/sendBtn.png";

const socket = io();

const Chatbot = ({ currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit("join room", { user: currentUser });

    socket.on("init messages", (msgs) => {
      setMessages(msgs);
      scrollToBottom();
    });

    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on("update user list", (users) => {
      setUsers(users);
    });

    return () => {
      socket.off("chat message");
      socket.off("init messages");
      socket.off("update user list");
    };
  }, [currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input) {
      try {
        const response = await fetch("/ask-gpt4", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input }),
        });
        const data = await response.json();

        // 사용자가 입력한 메시지를 채팅에 추가합니다.
        socket.emit("chat message", { text: input, user: currentUser });

        // 0.5초 딜레이 후 서버로부터 받은 GPT 응답을 "티아코" 사용자로 채팅에 추가합니다.
        setTimeout(() => {
          socket.emit("chat message", {
            text: data.response,
            user: "내꿈코",
          });
        }, 500);
        setInput("");
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleButtonClick = (label, text) => {
    socket.emit("chat message", { text, user: currentUser });
    socket.emit("ask chatbot", label);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="chatbot-container-unique">
      <div className="chatbot-bot-intro-unique">
        <img src={chatbotImg} alt="chatBotprofile" />
        <p>
          안녕하세요! 동국대학교 꿈의 요정 내꿈코예용~!
          <br />
          빈백 사용법 및 정보 등에 대해서 궁금한 내용을 질문하면 답변해드릴게요!
        </p>
      </div>
      <div className="chatbot-chat-messages-unique">
        <ul id="chatbot-messages-unique">
          {messages.map((msg, index) => (
            <li
              key={index}
              className={
                msg.user === currentUser
                  ? "chatbot-message-right-unique"
                  : "chatbot-message-left-unique"
              }
            >
              <strong className={msg.user === "내꿈코" ? "nickname" : ""}>
                {msg.user}:
              </strong>{" "}
              {msg.text}
            </li>
          ))}
          <div ref={messagesEndRef} />
        </ul>
      </div>
      <div className="chatbot-button-group-unique">
        <button
          onClick={() =>
            handleButtonClick(
              "TEXT 1",
              "나의 공강을 책임질 빈백의 위치를 알려줘!"
            )
          }
        >
          나의 공강을 책임질 빈백의 위치를 알려줘!
        </button>
        <button
          onClick={() =>
            handleButtonClick("TEXT 2", "빈백 운영시간은 어떻게 돼?")
          }
        >
          빈백 운영시간은 어떻게 돼?
        </button>
        <button
          onClick={() =>
            handleButtonClick(
              "TEXT 3",
              "나의 완벽한 숙면을 위해 음악을 추천해줄래?"
            )
          }
        >
          나의 완벽한 숙면을 위해 음악을 추천해줄래?
        </button>
        <form id="chatbot-chatform-unique" onSubmit={handleSubmit}>
          <input
            id="chatbot-messageinput-unique"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
          />
          <button type="submit">
            <div className="sendBtn">
              <img src={sendBtn} alt="전송 아이콘"></img>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
