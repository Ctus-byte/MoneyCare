export function renderTransactions(
  transactions,
  transactionList,
  deleteTransaction,
  editTransaction
) {
  transactionList.innerHTML = "";
  if (transactions.length === 0) {

  transactionList.innerHTML = `
    <div class="empty-state">

      <div class="empty-icon">
        📭
      </div>

      <h3>
        Chưa có giao dịch nào
      </h3>

      <p>
        Hãy thêm giao dịch đầu tiên để bắt đầu quản lý chi tiêu.
      </p>

    </div>
  `;

  return;
}

  transactions.forEach(function (item) {
    const typeClass =
  item.type === "income"
    ? "income-item"
    : "expense-item";
    const icon =
  item.type === "income"
    ? "💰"
    : "💸";
    const li = document.createElement("li");

    li.classList.add(typeClass);

    if (item.type === "income") {
      li.style.borderLeft = "5px solid green";
    } else {
      li.style.borderLeft = "5px solid red";
    }

    const categoryIcon = {
  "Ăn uống": "🍜",
  "Học tập": "📚",
  "Giải trí": "🎮",
  "Nhà ở": "🏠",
  "Di chuyển": "🚌",
  "Khác": "📦"
};

li.innerHTML = `
  <div class="transaction-info">

    <strong>
      ${categoryIcon[item.category] || "📦"} ${item.name}
    </strong>

    <small>
      ${item.category || "Khác"}
      ·
      ${item.date || "Chưa có ngày"}
      ·
      ${item.type === "income" ? "Thu nhập" : "Chi tiêu"}
    </small>

  </div>

  <div class="transaction-right">

    <strong class="transaction-amount">
      ${item.amount.toLocaleString()}đ
    </strong>

    <button
      class="edit-btn"
      data-id="${item.id}"
    >
      Sửa
    </button>

    <button
      class="delete-btn"
      data-id="${item.id}"
    >
      Xóa
    </button>

  </div>
`;
    transactionList.appendChild(li);
  });

  const deleteButtons = document.querySelectorAll(".delete-btn");

  deleteButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const id = Number(button.dataset.id);
      deleteTransaction(id);
    });
  });
}

const editButtons = document.querySelectorAll(".edit-btn");

editButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const id = Number(button.dataset.id);
    editTransaction(id);
  });
});

export function updateSummary(transactions, totalIncome, totalExpense, balance) {
  let income = 0;
  let expense = 0;

  transactions.forEach(function (item) {
    if (item.type === "income") {
      income += Number(item.amount);
    } else {
      expense += Number(item.amount);
    }
  });

  totalIncome.textContent = income.toLocaleString() + "đ";
  totalExpense.textContent = expense.toLocaleString() + "đ";
  balance.textContent = (income - expense).toLocaleString() + "đ";
}