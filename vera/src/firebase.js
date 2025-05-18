import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCxsQP8bwOasBegu6HTY2q9IjjFp-TjF_Q",
  authDomain: "otto-antika.firebaseapp.com",
  projectId: "otto-antika",
  storageBucket: "otto-antika.firebasestorage.app",
  messagingSenderId: "154528702395",
  appId: "1:154528702395:web:afe776576eaa7ac841ee9e",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
