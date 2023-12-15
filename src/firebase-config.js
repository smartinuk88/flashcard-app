// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCf_ixKclZTGemkFJGZTzT1f8VodJI-EcY",
  authDomain: "flashcard-app-ef223.firebaseapp.com",
  projectId: "flashcard-app-ef223",
  storageBucket: "flashcard-app-ef223.appspot.com",
  messagingSenderId: "189058797870",
  appId: "1:189058797870:web:bcc3be1919391581c0eabf",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error("Error signing in with Google", err.message);
    });
};

export { app, db, auth, provider, signInWithGoogle };
