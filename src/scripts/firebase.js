const firebaseConfig = {
  apiKey: "AIzaSyBLy0sDo5l0bd_xHjMbYR8HhC7EHqprHWM",
  authDomain: "memory-game-ranking.firebaseapp.com",
  projectId: "memory-game-ranking",
  storageBucket: "memory-game-ranking.firebasestorage.app",
  messagingSenderId: "579234923461",
  appId: "1:579234923461:web:d56bcfecb982a25bdfc1ac",
  measurementId: "G-2YNW58FN4R"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();