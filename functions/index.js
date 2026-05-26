const functions = require("firebase-functions");

require("dotenv").config();

exports.analyzeFinance = functions.https.onRequest(
  async (req, res) => {

    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    try {

      const transactions =
        req.body.transactions || [];

      const budget =
        req.body.budget || 0;

      const prompt = `
Bạn là AI tài chính cá nhân cho ứng dụng MoneyCare.

Hãy phân tích dữ liệu sau bằng tiếng Việt.

- Nhận xét tình hình tài chính
- Chỉ ra điểm tốt/xấu
- Gợi ý tiết kiệm
- Viết tự nhiên, ngắn gọn, dễ hiểu

Ngân sách:
${budget}

Dữ liệu:
${JSON.stringify(transactions)}
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();

      const text =
        data.candidates?.[0]?.content?.parts?.[0]?.text
        || "AI chưa phản hồi.";

      res.json({
        result: text,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error: "AI error",
      });
    }
  }
);