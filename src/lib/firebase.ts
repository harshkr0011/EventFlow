
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
  projectId: 'studio-4758176413-e97c3',
  appId: '1:125591351417:web:6d59249e06dddd45d8a4a8',
  apiKey: 'AIzaSyAWZOQcphfG9k1Rg5-aBK_e9n3sN6e3_8k',
  authDomain: 'studio-4758176413-e97c3.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '125591351417'
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
    // In a development environment, connect to the local Firebase Auth emulator
    // Note: The host for the emulator is automatically determined by the Firebase SDK
    try {
        connectAuthEmulator(auth, "http://localhost:9099");
        console.log("Connected to Firebase Auth Emulator");
    } catch (e) {
        console.error("Failed to connect to Firebase Auth Emulator", e);
    }
}


export { app, auth };
