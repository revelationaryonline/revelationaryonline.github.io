// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDgoPfvvGHxWtEDDE6re8rHae8uJfdWDPU",
  authDomain: "revelationary-d26b7.firebaseapp.com",
  projectId: "revelationary-d26b7",
  storageBucket: "revelationary-d26b7.firebasestorage.app",
  messagingSenderId: "60379647013",
  appId: "1:60379647013:web:8f089f73e594031e9b83cc",
  measurementId: "G-WW682ZF4VG"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);