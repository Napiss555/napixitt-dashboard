here
import "./style.css";
import { auth, db } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

import {
  collection,
  getDocs,
  query,
  orderBy,
  limit
} from "firebase/firestore";

const app = document.querySelector("#app");

app.innerHTML = `
  <main class="container">
    <h1>NAPixitt</h1>
    <p>ADMIN CONTROL PANEL</p>

    <section id="login">
      <h2>Admin Login</h2>
      <input id="email" type="email" placeholder="Email admin">
      <input id="password" type="password" placeholder="Password">
      <button id="loginBtn">LOGIN</button>
      <p id="error"></p>
    </section>

    <section id="panel" hidden>
      <h2>Dashboard</h2>
      <p id="account"></p>

      <div class="stats">
        <h3>Device Overview</h3>
        <p id="deviceCount">Memuat data...</p>
      </div>

      <div class="stats">
        <h3>Activity Logs</h3>
        <div id="logs">Memuat aktivitas...</div>
      </div>

      <button id="refreshBtn">REFRESH</button>
      <button id="logoutBtn">LOGOUT</button>
    </section>
  </main>
`;

const loginSection = document.querySelector("#login");
const panel = document.querySelector("#panel");
const errorBox = document.querySelector("#error");

document.querySelector("#loginBtn").onclick = async () => {
  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value;

  errorBox.textContent = "Memproses login...";

  try {
    await signInWithEmailAndPassword(auth, email, password);
    errorBox.textContent = "";
  } catch (error) {
    errorBox.textContent = "Login gagal. Periksa akun atau koneksi.";
  }
};

document.querySelector("#logoutBtn").onclick = async () => {
  await signOut(auth);
};

document.querySelector("#refreshBtn").onclick = loadDashboard;

async function loadDashboard() {
  const deviceCount = document.querySelector("#deviceCount");
  const logs = document.querySelector("#logs");

  deviceCount.textContent = "Memuat...";
  logs.textContent = "Memuat...";

  try {
    const devices = await getDocs(collection(db, "devices"));
    deviceCount.textContent =
      `${devices.size} perangkat terdaftar`;

    const logsQuery = query(
      collection(db, "activity_logs"),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    const logSnapshot = await getDocs(logsQuery);

    if (logSnapshot.empty) {
      logs.textContent = "Belum ada aktivitas.";
      return;
    }

    logs.innerHTML = "";

    logSnapshot.forEach((item) => {
      const data = item.data();
      const entry = document.createElement("p");

      entry.textContent =
        data.message || data.action || "Aktivitas tercatat";

      logs.appendChild(entry);
    });

  } catch (error) {
    deviceCount.textContent = "Gagal memuat data.";
    logs.textContent = "Periksa koneksi dan Security Rules.";
  }
}

onAuthStateChanged(auth, async (user) => {
  loginSection.hidden = !!user;
  panel.hidden = !user;

  if (user) {
    document.querySelector("#account").textContent =
      `Login sebagai ${user.email}`;

    await loadDashboard();
  }
});
