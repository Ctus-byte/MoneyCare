export function createTransaction(name, amount, type, category, date) {
  return {
    id: Date.now(),
    name: name,
    amount: amount,
    type: type,
    category: category,
    date: date
  };
}

export function addTransaction(transactions, transaction) {
  transactions.push(transaction);
  return transactions;
}

export function deleteTransactionById(transactions, id) {
  return transactions.filter(function (item) {
    return item.id !== id;
  });
}