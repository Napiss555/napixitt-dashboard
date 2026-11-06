import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

const app = document.querySelector("#app");

app.innerHTML = `
  <main class="container">
    <h1>NAPixitt Dashboard</h1>
    <p>Admin Control Panel</p>

    <section id="login">
      <input id="email" type="email" placeholder="Email admin">
      <input id="password" type="password" placeholder="Password">
      <button id="loginBtn">Login</button>
      <p id="error"></p>
    </section>

    <section id="panel" hidden>
      <h2>Dashboard</h2>
      <p id="status">Memeriksa akun...</p>
      <button id="logoutBtn">Logout</button>
    </section>
  </main>
`;

const login = document.querySelector("#login");
const panel = document.querySelector("#panel");

document.querySelector("#loginBtn").onclick = async () => {
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const error = document.querySelector("#error");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    error.textContent = "";
  } catch {
    error.textContent = "Login gagal. Periksa email dan password.";
  }
};

document.querySelector("#logoutBtn").onclick = () => signOut(auth);

onAuthStateChanged(auth, (user) => {
  login.hidden = !!user;
  panel.hidden = !user;

  if (user) {
    document.querySelector("#status").textContent =
      `Login sebagai ${user.email}`;
  }
});
