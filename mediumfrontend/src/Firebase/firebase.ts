import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyA2Qm1LWrSiGAf9u1YhNghJ0IoKFk9Uq98",
    authDomain: "medium-42122.firebaseapp.com",
    projectId: "medium-42122",
    storageBucket: "medium-42122.appspot.com",
    messagingSenderId: "227041903635",
    appId: "1:227041903635:web:1d15bc3fb4247dd56dabe6",
    measurementId: "G-BJD37S13S9"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
//   const analytics = getAnalytics(app);
  const storage = getStorage(app);

  export {app,storage}