const AI_SERVER_URL =
  "https://moneycare-u35o.onrender.com";

  import {
  chatWithFinanceAI
} from "./ai.js";

export async function analyzeTransactions(transactions) {
  const currentUser = JSON.parse(
    localStorage.getItem("moneycare_current_user")
  );

  const budget =
    Number(
      localStorage.getItem(
        `budget_${currentUser.email}`
      )
    ) || 0;

  const response = await fetch(
    AI_SERVER_URL + "/analyze-finance",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        transactions: transactions,
        budget: budget
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return `
      <div class="ai-card warning">
        AI đang gặp lỗi. Vui lòng thử lại sau.
      </div>
    `;
  }

  return `
    <div class="ai-card">
      ${data.result.replace(/\n/g, "<br>")}
    </div>
  `;
}

export async function chatWithFinanceAI(
  message,
  transactions
) {
  const currentUser = JSON.parse(
    localStorage.getItem("moneycare_current_user")
  );

  const budget =
    Number(
      localStorage.getItem(
        `budget_${currentUser.email}`
      )
    ) || 0;

  const response = await fetch(
    AI_SERVER_URL + "/chat-finance",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        message: message,
        transactions: transactions,
        budget: budget
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return "AI đang gặp lỗi. Bạn thử lại sau nha.";
  }

  return data.reply;
}