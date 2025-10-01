// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBt8MJ4sz7lwrvU1oIijEi1_mAObVZgyfM",
  authDomain: "helpinghands1-e155b.firebaseapp.com",
  projectId: "helpinghands1-e155b",
  storageBucket: "helpinghands1-e155b.firebasestorage.app",
  messagingSenderId: "712579614393",
  appId: "1:712579614393:web:a86c690d90b431befcbd68",
  measurementId: "G-S73M275XE3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore()
export const auth = getAuth();