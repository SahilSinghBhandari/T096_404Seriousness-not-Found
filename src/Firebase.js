// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwZ4_WCY_4ACVDfs53hjh7AuWg9D8653A",
  authDomain: "helpinghands-e62c5.firebaseapp.com",
  projectId: "helpinghands-e62c5",
  storageBucket: "helpinghands-e62c5.firebasestorage.app",
  messagingSenderId: "856312333431",
  appId: "1:856312333431:web:64b7fe6865f0b607433272",
  measurementId: "G-8FT4TLXH1Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore()
export const auth = getAuth();