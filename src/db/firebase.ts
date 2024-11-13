// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyANM9qDaDUt3RgBJooVXzFDNPQXE4NkLb4",
  authDomain: "final-book-ae7ff.firebaseapp.com",
  projectId: "final-book-ae7ff",
  storageBucket: "final-book-ae7ff.appspot.com",
  messagingSenderId: "250792972969",
  appId: "1:250792972969:web:f335e4dd669bb2300c8fb8",
  measurementId: "G-BBV6FHMK25"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
