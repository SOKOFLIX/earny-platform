import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAeiDPqbf23P2_O6iex-eZZ6752NRoDZbc",
  authDomain: "earny-477d3.firebaseapp.com",
  projectId: "earny-477d3",
  storageBucket: "earny-477d3.firebasestorage.app",
  messagingSenderId: "741319438211",
  appId: "1:741319438211:web:d3144e11f41641532b10b6",
  measurementId: "G-F77PJ7QVSK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);