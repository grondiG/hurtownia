// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1IT3aNsJG5FxpOS1pCyZqiWQW4MCjKDM",
  authDomain: "hurtownia-3bb65.firebaseapp.com",
  projectId: "hurtownia-3bb65",
  storageBucket: "hurtownia-3bb65.appspot.com",
  messagingSenderId: "27925512455",
  appId: "1:27925512455:web:9bf59959a9aa87658f85a2",
  measurementId: "G-H3N7R5KDJQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;