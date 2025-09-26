'use client';
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// This is a public configuration and is safe to expose.
// Security is handled by Firebase Security Rules and App Check.
const firebaseConfig = {
  apiKey: "AIzaSyAWZOQcphfG9k1Rg5-aBK_e9n3sN6e3_8k",
  authDomain: "studio-4758176413-e97c3.firebaseapp.com",
  projectId: "studio-4758176413-e97c3",
  storageBucket: "studio-4758176413-e97c3.appspot.com",
  messagingSenderId: "125591351417",
  appId: "1:125591351417:web:6d59249e06dddd45d8a4a8",
  measurementId: "G-1W5T5W4Q6P"
};

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);

export { app, auth };
