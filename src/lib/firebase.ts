
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const runningInEmulator = process.env.NODE_ENV === 'development';

const firebaseConfig = {
  projectId: runningInEmulator ? 'demo-project' : 'studio-4758176413-e97c3',
  appId: runningInEmulator ? 'demo-app-id' : '1:125591351417:web:6d59249e06dddd45d8a4a8',
  apiKey: runningInEmulator ? 'demo-api-key' : 'AIzaSyAWZOQcphfG9k1Rg5-aBK_e9n3sN6e3_8k',
  authDomain: runningInEmulator ? 'localhost' : 'studio-4758176413-e97c3.firebaseapp.com',
  measurementId: '',
  messagingSenderId: runningInEmulator ? 'demo-messaging-sender-id' : '125591351417'
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

if (runningInEmulator && typeof window !== 'undefined') {
    // In a development environment, connect to the local Firebase Auth emulator
    try {
        connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
        console.log("Connected to Firebase Auth Emulator");
    } catch (e) {
        console.error("Failed to connect to Firebase Auth Emulator", e);
    }
}


export { app, auth };
