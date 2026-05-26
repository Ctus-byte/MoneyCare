import {
  db
} from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const COLLECTION_NAME = "transactions";

export async function addUserTransaction(transaction) {

  await addDoc(
    collection(db, COLLECTION_NAME),
    transaction
  );

}

export async function getUserTransactions(userId) {

  const q = query(
    collection(db, COLLECTION_NAME),
    where("userId", "==", userId)
  );

  const querySnapshot =
    await getDocs(q);

  const transactions = [];

  querySnapshot.forEach(function(docItem) {

    transactions.push({
      firestoreId: docItem.id,
      ...docItem.data()
    });

  });

  return transactions;

}

export async function deleteUserTransaction(id) {

  const q = query(
    collection(db, COLLECTION_NAME),
    where("id", "==", Number(id))
  );

  const querySnapshot =
    await getDocs(q);

  querySnapshot.forEach(async function(item) {

    await deleteDoc(
      doc(db, COLLECTION_NAME, item.id)
    );

  });

}

export async function updateUserTransaction(id, newData) {

  const q = query(
    collection(db, COLLECTION_NAME),
    where("id", "==", Number(id))
  );

  const querySnapshot =
    await getDocs(q);

  querySnapshot.forEach(async function(item) {

    await updateDoc(
      doc(db, COLLECTION_NAME, item.id),
      newData
    );

  });

}