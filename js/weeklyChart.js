let weeklyChart;

export function renderWeeklyChart(transactions) {
  const canvas = document.getElementById("weekly-chart");

  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext("2d");

  const last7Days = [];
  const totals = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const formatted = date.toISOString().split("T")[0];

    last7Days.push(formatted.slice(5));

    let total = 0;

    transactions.forEach(function (item) {
      if (item.type === "expense" && item.date === formatted) {
        total += Number(item.amount);
      }
    });

    totals.push(total);
  }

  if (weeklyChart) {
    weeklyChart.destroy();
  }

  const gradient = ctx.createLinearGradient(0, 0, 0, 320);

  gradient.addColorStop(0, "rgba(124,58,237,0.45)");
  gradient.addColorStop(1, "rgba(124,58,237,0)");

  weeklyChart = new Chart(ctx, {
    type: "line",

    data: {
      labels: last7Days,

      datasets: [
        {
          label: "Chi tiêu",
          data: totals,
          borderColor: "#7c3aed",
          backgroundColor: gradient,
          fill: true,
          tension: 0.5,
          borderWidth: 3,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBorderWidth: 2,
          pointBorderColor: "#fff",
          pointBackgroundColor: "#7c3aed"
        }
      ]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 1,

      layout: {
        padding: 10
      },

      animation: false,
      plugins: {
        legend: {
          display: false
        }
      },

      scales: {
        x: {
          ticks: {
            maxRotation: 0,
            minRotation: 0,
            font: {
              size: 9
            }
          }
        },

        y: {
          beginAtZero: true,

          ticks: {
            font: {
              size: 9
            },

            callback: function (value) {
              if (value === 0) {
                return "";
              }

              return value + "đ";
            }
          }
        }
      }
    }
  });
}