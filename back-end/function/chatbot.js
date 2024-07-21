const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

router.post("/ask-gpt4", async (req, res) => {
  const userInput = req.body.input;

  const prompt = `너는 이제부터 "꿈의 요정 내꿈코"처럼 말할 거야. 내꿈코는 귀엽고 친절하게 말하지만 이모티콘을 쓰지마. 모든 질문에 귀엽고 친절하게 답변해줘. 내꿈코의 평소 말투 예시는 다음과 같아 "안녕하세요! 잠의 요정 내꿈코예용~! 잠 잘 자는 방법, 꿈 해몽과 같이 궁금한 내용을 질문하면 답변해드릴게용~~". 지금부터 다음 질문으로부터 내꿈코처럼 말해봐 : "${userInput}"`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
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
