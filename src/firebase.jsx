// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAumpTNdc9omKsZok8SUqZplZ8QFg2CTu0",
  authDomain: "fir-auth-542d0.firebaseapp.com",
  projectId: "fir-auth-542d0",
  storageBucket: "fir-auth-542d0.appspot.com",
  messagingSenderId: "982379433363",
  appId: "1:982379433363:web:f8091e73928f92ab012c66",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
