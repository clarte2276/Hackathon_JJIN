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
            user: "티아코",
          });
        }, 500);

        // 입력 필드를 초기화합니다.
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
          안녕하세요! 동국대학교 티케팅요정 티아코예용~!
          <br />
          티켓팅 방법, 축제 등에 대해서 궁금한 내용을 질문하면 답변해드릴게요!
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
                className={msg.user === "티아코" ? "nickname-tiakko" : ""}
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
            handleButtonClick("TEXT 1", "이번 공연의 가수는 누가 나오나요?")
          }
        >
          이번 공연의 가수는 누가 나오나요?
        </button>
        <button
          onClick={() =>
            handleButtonClick("TEXT 2", "연예인 공연 몇 시에 시작하나요?")
          }
        >
          연예인 공연 몇 시에 시작하나요?
        </button>
        <button
          onClick={() =>
            handleButtonClick("TEXT 3", "티켓 수령 본인 확인은 어떻게 하나요?")
          }
        >
          티켓 수령 본인 확인은 어떻게 하나요?
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
