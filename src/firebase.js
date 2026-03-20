import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB3F_JJLotm80y2GbCh5oVE0HI_LmHj0nM",
  authDomain: "spa-les-bains-romains.firebaseapp.com",
  projectId: "spa-les-bains-romains",
  storageBucket: "spa-les-bains-romains.firebasestorage.app",
  messagingSenderId: "258741126937",
  appId: "1:258741126937:web:2340b794a0af7b21ac2788"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
