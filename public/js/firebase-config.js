// Firebase Client Configuration
// This will use environment variables in production (Vercel)
// or fallback to hardcoded values for local development

const firebaseConfig = {
  apiKey: "AIzaSyCfgZs4_L41sc80CJa4sKOXmcssiRe0QqE",
  authDomain: "zaplink-71582.firebaseapp.com",
  projectId: "zaplink-71582",
  storageBucket: "zaplink-71582.firebasestorage.app",
  messagingSenderId: "88016414117",
  appId: "1:88016414117:web:21c0aa4cdcc89bf3cb344c"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Configure Google Auth Provider
window.googleProvider = new firebase.auth.GoogleAuthProvider();
window.googleProvider.setCustomParameters({
  prompt: 'select_account'
});
