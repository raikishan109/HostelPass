// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBePUerb_b7rkVhAhMkD1J_IF5N4RQtNDg",
  authDomain: "hostelpass-90da9.firebaseapp.com",
  projectId: "hostelpass-90da9",
  storageBucket: "hostelpass-90da9.appspot.com",
  messagingSenderId: "947656091032",
  appId: "1:947656091032:web:f6dbd56cfa70ae201037ed",
  measurementId: "G-VGFMW7977W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
