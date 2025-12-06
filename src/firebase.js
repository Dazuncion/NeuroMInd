import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyB2hez1-sXJdnaM1oKPGPX09CYB1VVh0a0", 
  authDomain: "neuromind-app-d8591.firebaseapp.com",
  projectId: "neuromind-app-d8591",
  storageBucket:"neuromind-app-d8591.firebasestorage.app",
  messagingSenderId: "224102267600",
  appId: "1:224102267600:web:ff71a3320386ab58ba3cd5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user; // Retorna datos del usuario (uid, email, displayName)
  } catch (error) {
    console.error("Error Login:", error);
    return null;
  }
};

export const logout = () => signOut(auth);