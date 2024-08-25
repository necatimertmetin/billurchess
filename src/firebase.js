// src/firebase.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

const firebaseConfig = {
  apiKey: "AIzaSyDx4G3OKHzcr4WNaH4pOk_DoPPx1ilXp6c",
  authDomain: "billurchess.firebaseapp.com",
  projectId: "billurchess",
  storageBucket: "billurchess.appspot.com",
  messagingSenderId: "626704029481",
  appId: "1:626704029481:web:50f89da3fe62c2fcb30938",
  measurementId: "G-XEJZ19RGQ5",
  databaseURL: "https://billurchess-default-rtdb.europe-west1.firebasedatabase.app" // Bölgeye özgü URL
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

export { database };
