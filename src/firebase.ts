import { initializeApp, FirebaseApp } from "firebase/app"
import { getFirestore, Firestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  "xxxxxx"
};
const myapp: FirebaseApp = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(myapp);
export const auth = getAuth(myapp);
