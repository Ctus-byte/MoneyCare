let chart;

export function renderChart(transactions, filterType) {
  const categoryTotals = {};

  transactions.forEach(function (item) {
    if (filterType === "all" || item.type === filterType) {
      const category = item.category || "Khác";

      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }

      categoryTotals[category] += Number(item.amount);
    }
  });

  const labels = Object.keys(categoryTotals).map(function (category) {
    if (category === "Ăn uống") return "🍜 Ăn uống";
    if (category === "Học tập") return "📚 Học tập";
    if (category === "Giải trí") return "🎮 Giải trí";
    if (category === "Nhà ở") return "🏠 Nhà ở";
    if (category === "Di chuyển") return "🚌 Di chuyển";

    return category;
  });

  const data = Object.values(categoryTotals);

  const ctx = document.getElementById("expense-chart");

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "doughnut",

    data: {
      labels: labels,

      datasets: [
        {
          label: "Chi tiêu theo danh mục",
          data: data,

          backgroundColor: [
            "#6366f1",
            "#ef4444",
            "#22c55e",
            "#f59e0b",
            "#8b5cf6",
            "#ec4899"
          ]
        }
      ]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      cutout: "65%",
      radius: "70%",

      plugins: {
        legend: {
          labels: {
            font: {
              size: 14
            },
            padding: 20
          }
        }
      }
    }
  });
}