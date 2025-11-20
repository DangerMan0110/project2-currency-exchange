// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwmoDO0tXxjkRS-g3lqr7ENExmUVrWfSs",
  authDomain: "currency-exchange-daniel.firebaseapp.com",
  projectId: "currency-exchange-daniel",
  storageBucket: "currency-exchange-daniel.firebasestorage.app",
  messagingSenderId: "664381717246",
  appId: "1:664381717246:web:1eca72e1338cb1488803af"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);