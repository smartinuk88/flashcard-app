// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

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

// Add user with custom data
// const createUserDocument = async (uid, data) => {
//   const userRef = collection(db, "users").doc(uid);

//   // Check if the user document already exists
//   const userSnapshot = await userRef.get();

//   if (!userSnapshot.exists) {
//     // Create a new user document
//     await userRef.set(data);
//   } else {
//     // Update the existing user document
//     await userRef.update(data);
//   }
// };

// Add deck
// const addDeck = async (e) => {
//   e.preventDefault();
//   await addDoc(collection(db, "decks"), {
//     collection: newCollection,
//     createdBy: uid,
//     description: newDescription,
//     title: newTitle
//   });
//   setNewCollection("");
//   setNewDescription("");
//   setNewTitle("");
// };

const handleSignInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error("Error signing in with Google", err.message);
    });
};

const handleSignOut = () => {
  signOut(auth)
    .then(() => {
      console.log("Sign out succesful");
    })
    .catch((err) => {
      console.log("Sign out error: ", err);
    });
};

export { app, db, auth, provider, handleSignInWithGoogle, handleSignOut };
