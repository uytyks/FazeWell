// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2tSVBBwBZlw_Tj8JlezUbQLKieMU8kIw",
  authDomain: "fazewell-5541c.firebaseapp.com",
  projectId: "fazewell-5541c",
  storageBucket: "fazewell-5541c.appspot.com",
  messagingSenderId: "422869470702",
  appId: "1:422869470702:web:329d276a1ba59f695712ff",
  measurementId: "G-65Z2WCN23T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);