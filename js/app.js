
import { saveToLocalStorage, loadFromLocalStorage, clearLocalStorage } from "./storage.js";
import { renderTransactions, updateSummary } from "./ui.js";
import {
  createTransaction,
  addTransaction,
  deleteTransactionById
} from "./transaction.js";
import { renderChart } from "./chart.js";
import { showToast } from "./toast.js";
import { exportToCSV } from "./export.js";
import { analyzeTransactions } from "./ai.js";
import { renderBudget } from "./budget.js";
import {
  renderWeeklyChart
} from "./weeklyChart.js";
import { renderMonthlyChart }
from "./monthlyChart.js";
import {
  getUserTransactions,
  addUserTransaction,
  updateUserTransaction,
  deleteUserTransaction
} from "./firestoreService.js";
import {
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { auth } from "./firebase.js";

const currentUser = JSON.parse(
  localStorage.getItem("moneycare_current_user")
);

if (!currentUser) {
  window.location.href = "login.html";
}

const form = document.getElementById("transaction-form");
const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
dateInput.value = new Date().toISOString().split("T")[0];

const transactionList = document.getElementById("transaction-list");

const totalIncome = document.getElementById("total-income");
const totalExpense = document.getElementById("total-expense");
const balance = document.getElementById("balance");
const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("search-input");
const monthFilter = document.getElementById("month-filter");
const clearMonthBtn = document.getElementById("clear-month-btn");
const analyzeBtn = document.getElementById("analyze-btn");
const aiResult = document.getElementById("ai-result");

let currentMonth = "";

const resetBtn =
  document.getElementById("reset-btn");

const exportBtn =
  document.getElementById("export-btn");

const themeToggle =
  document.getElementById("theme-toggle");

let currentSearch = "";

let currentFilter = "all";

const transactionKey =
  `transactions_${currentUser.email}`;

let transactions = [];

let editId = null;

async function loadData() {

  transactions =
    await getUserTransactions(
      currentUser.uid
    );

  renderAll();
}

loadData();

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = nameInput.value;
  const amount = Number(amountInput.value);
  const type = typeInput.value;
  const category = categoryInput.value;
  const date = dateInput.value;

const transaction = {
  id: editId || Date.now(),
  name: name,
  amount: amount,
  type: type,
  category: category,
  date: date,
  userId: currentUser.uid
};

let isEditing = false;

if (editId) {

  isEditing = true;

  transactions = transactions.map(function (item) {

    if (item.id === editId) {
      return transaction;
    }

    return item;

  });

  await updateUserTransaction(
  String(editId),
  transaction
);

  editId = null;

} else {

 await addUserTransaction(
  transaction
);

transactions =
  await getUserTransactions(
    currentUser.uid
  );
}

if (isEditing) {
  showToast("Đã sửa giao dịch");
} else {
  showToast("Đã thêm giao dịch");
}

  renderAll();

  form.reset();
  dateInput.value = new Date().toISOString().split("T")[0];
});

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = button.dataset.filter;

    filterButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    renderAll();
  });
});

document.querySelector('[data-filter="all"]').classList.add("active");

searchInput.addEventListener("input", function () {
  currentSearch = searchInput.value.toLowerCase();
  renderAll();
});

monthFilter.addEventListener("change", function () {
  currentMonth = monthFilter.value;
  renderAll();
});

clearMonthBtn.addEventListener("click", function () {
  currentMonth = "";
  monthFilter.value = "";
  renderAll();
});

async function deleteTransaction(id) {

  await deleteUserTransaction(
    String(id)
  );

  transactions =
    await getUserTransactions(
      currentUser.uid
    );

  showToast("Đã xóa giao dịch");

  renderAll();
}

function renderAll() {
  let filteredTransactions = transactions;

  if (currentFilter !== "all") {
    filteredTransactions = filteredTransactions.filter(function (item) {
      return item.type === currentFilter;
    });
  }

  if (currentSearch !== "") {
    filteredTransactions = filteredTransactions.filter(function (item) {
      return item.name.toLowerCase().includes(currentSearch);
    });
  }

  if (currentMonth !== "") {
    filteredTransactions = filteredTransactions.filter(function (item) {
      return item.date && item.date.slice(0, 7) === currentMonth;
    });
  }

  renderTransactions(filteredTransactions, transactionList, deleteTransaction);

  updateSummary(filteredTransactions, totalIncome, totalExpense, balance);

  renderChart(filteredTransactions, currentFilter);
  renderMonthlyChart(filteredTransactions);
  renderWeeklyChart(filteredTransactions);
  renderBudget(filteredTransactions);
}

transactionList.addEventListener("click", function (e) {
  if (e.target.classList.contains("edit-btn")) {
    const id = Number(e.target.dataset.id);
    editTransaction(id);
  }
});

resetBtn.addEventListener("click", async function () {

  for (const item of transactions) {

    await deleteUserTransaction(
      String(item.id)
    );

  }

  transactions =
    await getUserTransactions(
      currentUser.uid
    );

  renderAll();

  showToast("Đã xóa toàn bộ dữ liệu");

});

themeToggle.addEventListener("click", function () {

  document.body.classList.toggle("dark-mode");

});

function editTransaction(id) {
  const transaction = transactions.find(function (item) {
    return item.id === id;
  });

  if (!transaction) return;

  nameInput.value = transaction.name;
  amountInput.value = transaction.amount;
  typeInput.value = transaction.type;
  categoryInput.value = transaction.category;
  dateInput.value = transaction.date;

  editId = transaction.id;
}

exportBtn.addEventListener("click", function () {

  exportToCSV(transactions);

  showToast("Đã xuất file Excel");

});

const saveBudgetBtn =
  document.getElementById(
    "save-budget-btn"
  );

saveBudgetBtn.addEventListener(
  "click",
  function () {

    const value =
      document.getElementById(
        "budget-input"
      ).value;

    localStorage.setItem(
      `budget_${currentUser.email}`,
      value
    );

    renderAll();

    showToast(
      "Đã lưu ngân sách"
    );

  }
);

const logoutBtn =
  document.getElementById("logout-btn");

logoutBtn.addEventListener(
  "click",
  async function () {

    await signOut(auth);

    localStorage.removeItem(
      "moneycare_current_user"
    );

    window.location.href =
      "login.html";

  }
);

const navButtons =
document.querySelectorAll(
".nav-btn[data-section]"
);

navButtons.forEach(function(button){

button.addEventListener(
"click",
function(){

const target =
button.dataset.section;

document
.querySelectorAll(".page-section")
.forEach(function(section){

section.classList.add(
"hidden"
);

});

document
.getElementById(target)
.classList.remove(
"hidden"
);

navButtons.forEach(function(btn){
btn.classList.remove(
"active"
);
});

button.classList.add(
"active"
);

}
);

});
const bottomButtons =
  document.querySelectorAll(".bottom-btn[data-section]");

function showSection(sectionId) {
  document.querySelectorAll(".page-section")
    .forEach(function(section) {
      section.classList.add("hidden");
    });

  document.getElementById(sectionId)
    .classList.remove("hidden");

  document.querySelectorAll(".nav-btn[data-section], .bottom-btn[data-section]")
    .forEach(function(btn) {
      btn.classList.remove("active");
    });

  document.querySelectorAll(`[data-section="${sectionId}"]`)
    .forEach(function(btn) {
      btn.classList.add("active");
    });
}

bottomButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    showSection(button.dataset.section);
  });
});

const mobileMenuBtn =
document.getElementById(
  "mobile-menu-btn"
);

const sidebar =
document.querySelector(
  ".sidebar"
);

if (
  mobileMenuBtn &&
  sidebar
) {

  sidebar.classList.add(
    "mobile-hidden"
  );

  mobileMenuBtn.addEventListener(
    "click",
    function () {

      sidebar.classList.toggle(
        "mobile-hidden"
      );

    }
  );

}
const aiInput =
  document.getElementById("ai-input");

const sendAiBtn =
  document.getElementById("send-ai-btn");

const aiChatBox =
  document.getElementById("ai-chat-box");

function addAIMessage(text, type) {
  const div =
    document.createElement("div");

  div.className =
    "ai-message " + type;

  div.innerHTML =
    text.replace(/\n/g, "<br>");

  aiChatBox.appendChild(div);

  aiChatBox.scrollTop =
    aiChatBox.scrollHeight;
}

if (aiInput && sendAiBtn && aiChatBox) {

  sendAiBtn.addEventListener(
    "click",
    async function () {

      const question =
        aiInput.value.trim();

      if (!question) return;

      addAIMessage(question, "user");

      aiInput.value = "";

      addAIMessage(
        "⏳ AI đang suy nghĩ...",
        "ai"
      );

      const loadingMessage =
        aiChatBox.lastChild;

      const reply =
        await chatWithFinanceAI(
          question,
          transactions
        );

      loadingMessage.innerHTML =
        reply.replace(/\n/g, "<br>");

    }
  );

  aiInput.addEventListener(
    "keydown",
    function (e) {

      if (e.key === "Enter") {
        sendAiBtn.click();
      }

    }
  );

}