export function renderBudget(transactions) {

  const currentUser = JSON.parse(
  localStorage.getItem(
    "moneycare_current_user"
  )
);

  const budget =
  Number(
    localStorage.getItem(
      `budget_${currentUser.email}`
    )
  ) || 0;

  let totalExpense = 0;

  transactions.forEach(function(item) {

    if (item.type === "expense") {
      totalExpense += Number(item.amount);
    }

  });

  const left = budget - totalExpense;

  document.getElementById(
    "budget-total"
  ).textContent =
    budget.toLocaleString() + "đ";

  document.getElementById(
    "budget-used"
  ).textContent =
    totalExpense.toLocaleString() + "đ";

  document.getElementById(
    "budget-left"
  ).textContent =
    left.toLocaleString() + "đ";

  const percent =
    budget > 0
      ? Math.min(
          (totalExpense / budget) * 100,
          100
        )
      : 0;
      document.getElementById(
  "budget-percent"
).textContent =
  "Đã sử dụng " +
  Math.round(percent) +
  "% ngân sách";

  const bar =
    document.getElementById("budget-bar");

  bar.style.width = percent + "%";

  if (percent < 70) {
    bar.style.background =
      "linear-gradient(90deg,#22c55e,#84cc16)";
  }

  if (percent >= 70) {
    bar.style.background =
      "linear-gradient(90deg,#f59e0b,#f97316)";
  }

  if (percent >= 90) {
    bar.style.background =
      "linear-gradient(90deg,#ef4444,#dc2626)";
  }
const budgetLeft =
  document.getElementById(
    "budget-left"
  );

if (left < 0) {

  budgetLeft.style.color =
    "#ef4444";

} else {

  budgetLeft.style.color =
    "#22c55e";

}
}