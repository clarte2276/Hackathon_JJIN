import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./Chatbot.css";
import chatbotImg from "../images/chatbotImg.png";
import sendBtn from "../images/sendBtn.png";

const socket = io();
const aiuser = "내꿈코";

const Chatbot = ({ currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit("join room", { user: currentUser });

    socket.on("init messages", (msgs) => {
      setMessages(msgs);
      scrollToBottom();
    });

    socket.on("chat message", (msg) => {
      console.log("Received message: ", msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on("gpt response", (msg) => {
      console.log("Received GPT response: ", msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("chat message");
      socket.off("init messages");
      socket.off("gpt response");
    };
  }, [currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input) {
      // 사용자 메시지 전송
      socket.emit("chat message", { text: input, user: currentUser });

      try {
        const response = await fetch("/ask-gpt4", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input }),
        });
        const data = await response.json();
        console.log("Server response: ", data);

        // GPT 응답을 내꿈코로 전송
        socket.emit("gpt response", {
          text: data.response,
          user: aiuser,
        });

        setInput("");
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleButtonClick = (label, text) => {
    socket.emit("chat message", { text, user: currentUser });
    socket.emit("ask chatbot", { label });
  };

  const handleSeatsButtonClick = async () => {
    const userText = "현재 좌석 현황을 알려주라";
    // 사용자 메시지 전송
    socket.emit("chat message", { text: userText, user: currentUser });

    try {
      const response = await fetch("/api/empty");
      const data = await response.json();
      const availableSeats = data.length;
      const text = `현재 이용 가능한 좌석은 ${availableSeats}개입니다.`;
      // 내꿈코 메시지로 전송
      socket.emit("gpt response", { text, user: aiuser });
    } catch (error) {
      console.error("Error fetching empty seats:", error);
    }
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
                msg.user === aiuser
                  ? "chatbot-message-left-unique"
                  : "chatbot-message-right-unique"
              }
            >
              <div className="message-content">
                <strong className={msg.user === aiuser ? "nickname" : ""}>
                  {msg.user}:
                </strong>{" "}
                {msg.text}
              </div>
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
        <button onClick={handleSeatsButtonClick}>
          현재 좌석의 현황을 알려주라
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
