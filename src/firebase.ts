import { initializeApp, FirebaseApp } from "firebase/app"
import { getFirestore, Firestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDcZHqZbA7G7-6QzWdMhY5BQ79RgQ32w2g",
  authDomain: "fitness-tracker-4c5cc.firebaseapp.com",
  projectId: "fitness-tracker-4c5cc",
  storageBucket: "fitness-tracker-4c5cc.firebasestorage.app",
  messagingSenderId: "492362558709",
  appId: "1:492362558709:web:c4895eca4dc54cfc56a9bc",
  measurementId: "G-Y91FD0X3JM"
};
const myapp: FirebaseApp = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(myapp);
export const auth = getAuth(myapp);