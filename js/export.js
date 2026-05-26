export function exportToCSV(transactions) {

  let csv =
    "Tên,Số tiền,Loại,Danh mục,Ngày\n";

  transactions.forEach(function (item) {

    csv +=
      `${item.name},${item.amount},${item.type},${item.category},${item.date}\n`;

  });

  const blob =
    new Blob([csv], {
      type: "text/csv"
    });

  const url =
    window.URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;

  a.download =
    "transactions.csv";

  a.click();

  window.URL.revokeObjectURL(url);

}