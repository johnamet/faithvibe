// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdIvSvwBKYQGJzwWIbOC-F3UdbUPu2sQ4",
  authDomain: "faithvibe-78883.firebaseapp.com",
  projectId: "faithvibe-78883",
  storageBucket: "faithvibe-78883.firebasestorage.app",
  messagingSenderId: "1028976820543",
  appId: "1:1028976820543:web:1e044946b6a4f3cde2538a",
  measurementId: "G-GLWWB200LM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app

