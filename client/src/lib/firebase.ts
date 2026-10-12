import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";

export const firebaseConfig = {
  projectId: "immigratiepunt-dev",
  appId: "1:741974780571:web:67cd02dbf60941e180743e",
  storageBucket: "immigratiepunt-dev.firebasestorage.app",
  apiKey: "AIzaSyBc_TwM4VL24CldKwG3pHu6bWbXmha9k2w",
  authDomain: "immigratiepunt-dev.firebaseapp.com",
  messagingSenderId: "741974780571",
};

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { signInWithPopup, firebaseSignOut };
