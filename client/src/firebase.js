//TODO: EXPORT THE APP MANUALLY AND USE IT IN GOOGLEOAUTH FILE

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-mern-f487e.firebaseapp.com",
  projectId: "real-estate-mern-f487e",
  storageBucket: "real-estate-mern-f487e.appspot.com",
  messagingSenderId: "560301934345",
  appId: "1:560301934345:web:ceecf7ffc8dfbb1b19f5d8"
};

// Initialize Firebase
export const firebase_app = initializeApp(firebaseConfig);