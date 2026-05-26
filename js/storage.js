const STORAGE_KEY = "moneycare_transactions";

export function saveToLocalStorage(transactions) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(transactions)
  );
}

export function loadFromLocalStorage() {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return [];
  }

  return JSON.parse(data);
}

export function clearLocalStorage() {
  localStorage.removeItem(STORAGE_KEY);
}