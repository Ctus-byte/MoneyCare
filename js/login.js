import {
  signInWithEmailAndPassword
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { auth }
from "./firebase.js";

const emailInput =
document.getElementById(
"login-email"
);

const passwordInput =
document.getElementById(
"login-password"
);

const loginBtn =
document.getElementById(
"login-btn"
);

const message =
document.getElementById(
"auth-message"
);

loginBtn.addEventListener(
"click",
function () {

const email =
emailInput.value.trim();

const password =
passwordInput.value;

signInWithEmailAndPassword(
auth,
email,
password
)

.then(function(userCredential) {

const user =
userCredential.user;

localStorage.setItem(
"moneycare_current_user",

JSON.stringify({
uid: user.uid,
email: user.email
})
);

window.location.href =
"index.html";

})

.catch(function(error) {

message.textContent =
"Email hoặc mật khẩu không đúng";

console.log(error);

});


});