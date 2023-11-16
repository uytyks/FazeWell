const firebaseConfig = {
  apiKey: "AIzaSyD2tSVBBwBZlw_Tj8JlezUbQLKieMU8kIw",
  authDomain: "fazewell-5541c.firebaseapp.com",
  projectId: "fazewell-5541c",
  storageBucket: "fazewell-5541c.appspot.com",
  messagingSenderId: "422869470702",
  appId: "1:422869470702:web:329d276a1ba59f695712ff",
  measurementId: "G-65Z2WCN23T"
};

const app = firebase.initializeApp(firebaseConfig);
console.log('firebase init!');
const auth = firebase.auth();