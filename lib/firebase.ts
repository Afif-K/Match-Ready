import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDPvX7dk6QE9zHLf44U779sPne6sZa6EI0",
  authDomain: "matchready-6f658.firebaseapp.com",
  projectId: "matchready-6f658",
  storageBucket: "matchready-6f658.firebasestorage.app",
  messagingSenderId: "435134477738",
  appId: "1:435134477738:web:83c9955569093bd8b5e7d3",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);