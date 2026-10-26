import { FirebaseApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDcZHqZbA7G7-6QzWdMhY5BQ79RgQ32w2g",
  authDomain: "fitness-tracker-4c5cc.firebaseapp.com",
  projectId: "fitness-tracker-4c5cc",
  storageBucket: "fitness-tracker-4c5cc.firebasestorage.app",
  messagingSenderId: "492362558709",
  appId: "1:492362558709:web:3fd8f053efcd09df56a9bc",
  measurementId: "G-TGWVF0NS4Q"
};
export const myapp: FirebaseApp = initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(myapp);
export const auth = getAuth(myapp);
