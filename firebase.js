import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC3Fl8Q1Ep0ishR-C3rCFGtrmx66NzJWKc",
  authDomain: "napixitt-rat.firebaseapp.com",
  projectId: "napixitt-rat",
  storageBucket: "napixitt-rat.firebasestorage.app",
  messagingSenderId: "728808359615",
  appId: "1:728808359615:web:8419c5441cf68e7e7da80a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
