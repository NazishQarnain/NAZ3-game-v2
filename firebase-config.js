// Firebase configuration and initialization
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyB9wB0iA4N5WQEM08AmONMSZsxqZ1niC0Y",
  authDomain: "naz3-game.firebaseapp.com",
  projectId: "naz3-game",
  storageBucket: "naz3-game.firebasestorage.app",
  messagingSenderId: "97109882574",
  appId: "1:97109882574:web:3733493a188f80a60639db",
  measurementId: "G-MDMES4P1LS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
