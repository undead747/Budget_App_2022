// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJwuGS7fRl9ZU6vUwD-6z60OudeSqE9XI",
  authDomain: "budget-app-2022.firebaseapp.com",
  projectId: "budget-app-2022",
  storageBucket: "budget-app-2022.appspot.com",
  messagingSenderId: "4131391791",
  appId: "1:4131391791:web:8fd4241ed0bb73c345f9da",
  measurementId: "G-YQG61BQENL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const fireStoreInst = getFirestore(app); 

export {app, auth, fireStoreInst };