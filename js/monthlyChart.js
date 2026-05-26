let monthlyChart;

export function renderMonthlyChart(
  transactions
) {

  let income = 0;
  let expense = 0;

  transactions.forEach(function(item) {

    if (item.type === "income") {
      income += Number(item.amount);
    }

    if (item.type === "expense") {
      expense += Number(item.amount);
    }

  });

  const ctx =
    document.getElementById(
      "monthly-chart"
    );

  if (monthlyChart) {
    monthlyChart.destroy();
  }

  monthlyChart = new Chart(ctx, {

    type: "bar",

    data: {

      labels: [
        "Thu nhập",
        "Chi tiêu"
      ],

      datasets: [
        {
          label: "Số tiền",

          data: [
            income,
            expense
          ],

          barPercentage: 0.45,
          categoryPercentage: 0.5,

          borderRadius: 14,

          backgroundColor: [
            "#22c55e",
            "#ef4444"
          ]
        }
      ]
    },

    options: {

      responsive: true,

      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: false
        }
      },

      scales: {

        y: {
          beginAtZero: true,

          ticks: {
            callback: function(value) {
              return value + "đ";
            }
          }
        }
      }
    }
  });

}