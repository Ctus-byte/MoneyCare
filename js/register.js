import {
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { auth } from "./firebase.js";

const nameInput = document.getElementById("register-name");
const emailInput = document.getElementById("register-email");
const passwordInput = document.getElementById("register-password");
const confirmInput = document.getElementById("register-confirm");
const registerBtn = document.getElementById("register-btn");
const message = document.getElementById("auth-message");

registerBtn.addEventListener("click", function () {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirm = confirmInput.value;

  if (!name || !email || !password || !confirm) {
    message.textContent = "Vui lòng nhập đầy đủ thông tin";
    return;
  }

  if (password !== confirm) {
    message.textContent = "Mật khẩu nhập lại không khớp";
    return;
  }

  if (password.length < 6) {
    message.textContent = "Mật khẩu phải có ít nhất 6 ký tự";
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(function (userCredential) {
      return updateProfile(userCredential.user, {
        displayName: name
      });
    })
    .then(function () {
      message.textContent = "Đăng ký thành công";

      setTimeout(function () {
        window.location.href = "login.html";
      }, 1000);
    })
    .catch(function (error) {
      message.textContent = error.message;
      console.log(error);
    });
});