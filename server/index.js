const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/analyze-finance", async function (req, res) {
  try {
    const transactions = req.body.transactions || [];
    const budget = req.body.budget || 0;

    if (!transactions.length) {
      return res.json({
        result:
          "Bạn chưa có dữ liệu giao dịch. Hãy thêm vài giao dịch để AI phân tích chính xác hơn."
      });
    }

    const prompt = `
Bạn là AI tài chính cá nhân cho ứng dụng MoneyCare.

Hãy phân tích dữ liệu chi tiêu sau bằng tiếng Việt.

Yêu cầu:
- Viết tự nhiên, dễ hiểu.
- Không nói chung chung.
- Chỉ dựa vào dữ liệu được gửi.
- Nhận xét tình hình tài chính hiện tại.
- Chỉ ra danh mục chi nhiều nhất.
- Cảnh báo nếu chi tiêu không ổn.
- Đưa ra 3 gợi ý cụ thể để cải thiện.
- Trình bày gọn, rõ ràng.

Ngân sách tháng: ${budget} VND

Dữ liệu giao dịch:
${JSON.stringify(transactions, null, 2)}
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("Gemini response:", JSON.stringify(data, null, 2));

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "AI chưa tạo được phân tích. Vui lòng thử lại.";

    res.json({
      result: text
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Có lỗi khi phân tích bằng AI."
    });
  }
});

app.post("/chat-finance", async function (req, res) {
  try {
    const message = req.body.message || "";
    const transactions = req.body.transactions || [];
    const budget = req.body.budget || 0;

    if (!message.trim()) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const prompt = `
Bạn là AI trợ lý tài chính cá nhân trong ứng dụng MoneyCare.

Nhiệm vụ:
- Trả lời như một trợ lý thân thiện.
- Dùng tiếng Việt đơn giản, dễ hiểu.
- Chỉ tư vấn tài chính cá nhân, chi tiêu, tiết kiệm, ngân sách.
- Nếu câu hỏi không liên quan tài chính, nhẹ nhàng kéo về chủ đề tài chính.
- Dựa vào dữ liệu giao dịch nếu có.
- Không bịa số liệu ngoài dữ liệu được cung cấp.
- Trả lời ngắn gọn, rõ ràng.

Ngân sách tháng: ${budget} VND

Dữ liệu giao dịch:
${JSON.stringify(transactions, null, 2)}

Câu hỏi của người dùng:
${message}
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("Gemini response:", JSON.stringify(data, null, 2));

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Mình chưa trả lời được câu này. Bạn thử hỏi lại ngắn gọn hơn nha.";

    res.json({
      reply: text
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "AI chat error"
    });
  }
});

app.get("/", function (req, res) {
  res.send("MoneyCare AI Server is running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log("Server running on port " + PORT);
});