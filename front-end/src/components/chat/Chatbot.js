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
              <strong
                className={msg.user === "내꿈코" ? "nickname-tiakko" : ""}
              >
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
          빈백 운영시간은 어떻게 돼?"
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
      </div>
    </div>
  );
};

export default Chatbot;
