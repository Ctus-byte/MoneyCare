import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {

  apiKey:
    "AIzaSyCCEQf3iWxkN3bDaOCm8b-M4qCJ_w7wNHY",

  authDomain:
    "moneycare-6a1df.firebaseapp.com",

  projectId:
    "moneycare-6a1df",

  storageBucket:
    "moneycare-6a1df.firebasestorage.app",

  messagingSenderId:
    "698961879898",

  appId:
    "1:698961879898:web:ead7a0d5c3a9f88b680963"
};

const app =
  initializeApp(firebaseConfig);

export const auth =
  getAuth(app);

export const db =
  getFirestore(app);