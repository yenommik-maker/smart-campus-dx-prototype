import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCYXEcQJ__ByNkeKGusFWBZjM8_nU9NLhs",
  authDomain: "smart-campus-dx.firebaseapp.com",
  projectId: "smart-campus-dx",
  storageBucket: "smart-campus-dx.firebasestorage.app",
  messagingSenderId: "840568019443",
  appId: "1:840568019443:web:6d9cc6313fef628add9a86",
  measurementId: "G-Q00XRL06GJ",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// analytics requires a browser environment and isn't supported everywhere (ad blockers, etc.)
export let analytics = null;
isSupported().then((supported) => {
  if (supported) analytics = getAnalytics(app);
});
