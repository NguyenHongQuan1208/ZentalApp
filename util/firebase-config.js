// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8PVnvThQNPDDggiK1qTXqncZtAq98Y1Y",
  authDomain: "zentalapp.firebaseapp.com",
  databaseURL:
    "https://zentalapp-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "zentalapp",
  storageBucket: "zentalapp.firebasestorage.app",
  messagingSenderId: "499461199840",
  appId: "1:499461199840:web:b3ef468ca202f5304ffd85",
  measurementId: "G-CNSQQ9YXWV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
export const database = getDatabase(app);
