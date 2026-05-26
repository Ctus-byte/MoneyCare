export function analyzeTransactions(transactions) {
  if (transactions.length === 0) {
    return `
      <div class="ai-card">
        📭 Chưa có dữ liệu để phân tích. Hãy thêm giao dịch đầu tiên.
      </div>
    `;
  }

  let income = 0;
  let expense = 0;
  const categoryTotals = {};
  const dailyTotals = {};

  transactions.forEach(function (item) {
    const amount = Number(item.amount);

    if (item.type === "income") {
      income += amount;
      return;
    }

    expense += amount;

    const category = item.category || "Khác";
    categoryTotals[category] = (categoryTotals[category] || 0) + amount;

    const date = item.date || "Không rõ ngày";
    dailyTotals[date] = (dailyTotals[date] || 0) + amount;
  });

  const balance = income - expense;
  const savingRate = income > 0 ? Math.round((balance / income) * 100) : 0;

  const sortedCategories = Object.entries(categoryTotals)
    .sort(function (a, b) {
      return b[1] - a[1];
    });

  const topCategory = sortedCategories[0]?.[0] || "Chưa có";
  const topAmount = sortedCategories[0]?.[1] || 0;
  const topPercent = expense > 0 ? Math.round((topAmount / expense) * 100) : 0;

  const sortedDays = Object.entries(dailyTotals)
    .sort(function (a, b) {
      return b[1] - a[1];
    });

  const highestDay = sortedDays[0]?.[0] || "Chưa có";
  const highestDayAmount = sortedDays[0]?.[1] || 0;

  const budget = Number(
    localStorage.getItem(
      `budget_${JSON.parse(localStorage.getItem("moneycare_current_user")).email}`
    )
  ) || 0;

  const budgetPercent = budget > 0 ? Math.round((expense / budget) * 100) : 0;

  let score = 100;

  if (expense > income) score -= 35;
  if (savingRate < 20) score -= 15;
  if (topPercent > 50) score -= 15;
  if (budget > 0 && expense > budget) score -= 25;
  if (budget > 0 && budgetPercent >= 80) score -= 10;

  if (score < 0) score = 0;

  let scoreColor = "#22c55e";

  if (score < 70) scoreColor = "#f59e0b";
  if (score < 40) scoreColor = "#ef4444";

  let html = "";

  html += `
    <div class="ai-score" style="background:${scoreColor}">
      Financial Health Score: ${score}/100
    </div>

    <div class="ai-progress">
      <div
        class="ai-progress-bar"
        style="width:${score}%; background:${scoreColor};"
      ></div>
    </div>
  `;

  html += `
    <div class="ai-card">
      📊 Danh mục chi nhiều nhất là
      <strong>${topCategory}</strong>,
      chiếm <strong>${topPercent}%</strong> tổng chi tiêu.
    </div>
  `;

  if (balance < 0) {
    html += `
      <div class="ai-card warning">
        ⚠️ Bạn đang chi nhiều hơn thu nhập.
        Hiện âm <strong>${Math.abs(balance).toLocaleString()}đ</strong>.
      </div>
    `;
  } else {
    html += `
      <div class="ai-card success">
        ✅ Bạn còn dư <strong>${balance.toLocaleString()}đ</strong>.
        Tỷ lệ tiết kiệm khoảng <strong>${savingRate}%</strong>.
      </div>
    `;
  }

  if (budget > 0) {
    if (expense > budget) {
      html += `
        <div class="ai-card warning">
          🚨 Bạn đã vượt ngân sách
          <strong>${(expense - budget).toLocaleString()}đ</strong>.
        </div>
      `;
    } else {
      html += `
        <div class="ai-card success">
          🎯 Bạn đã dùng <strong>${budgetPercent}%</strong> ngân sách.
        </div>
      `;
    }
  }

  html += `
    <div class="ai-card">
      📅 Ngày chi nhiều nhất là <strong>${highestDay}</strong>,
      với <strong>${highestDayAmount.toLocaleString()}đ</strong>.
    </div>
  `;

  if (topPercent > 50) {
    html += `
      <div class="ai-card tip">
        💡 Gợi ý: hãy đặt giới hạn riêng cho
        <strong>${topCategory}</strong>, vì mục này đang chiếm quá nhiều.
      </div>
    `;
  } else {
    html += `
      <div class="ai-card tip">
        💡 Gợi ý: chi tiêu của bạn đang phân bổ khá đều.
        Hãy tiếp tục theo dõi mỗi tuần.
      </div>
    `;
  }

  return html;
}