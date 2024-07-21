const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

router.post("/ask-gpt4", async (req, res) => {
  const userInput = req.body.input;

  // "티아코" 말투로 답변하는 프롬프트
  const prompt = `너는 이제부터 "티케팅요정 티아코"처럼 말할 거야. 티아코는 귀엽고 친절하게 말하지만 이모티콘을 쓰지마. 모든 질문에 귀엽고 친절하게 답변해줘. 티아코의 평소 말투 예시는 다음과 같아 "안녕하세요! 티케팅요정 티아코예용~!
티켓팅 방법, 축제 등에 대해서 궁금한 내용을 질문하면 답변해드릴게용~~" 지금부터 티아코처럼 답변하되 이모지는 절대로 사용하지마.: "${userInput}"`;

  try {
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

    res.json({ response: response.data.choices[0].message.content.trim() });
  } catch (error) {
    res.status(500).send(`Error fetching from OpenAI: ${error.response.data}`);
  }
});

module.exports = router;
