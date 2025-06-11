// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLy0sDo5l0bd_xHjMbYR8HhC7EHqprHWM",
  authDomain: "memory-game-ranking.firebaseapp.com",
  projectId: "memory-game-ranking",
  storageBucket: "memory-game-ranking.firebasestorage.app",
  messagingSenderId: "579234923461",
  appId: "1:579234923461:web:d56bcfecb982a25bdfc1ac",
  measurementId: "G-2YNW58FN4R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);