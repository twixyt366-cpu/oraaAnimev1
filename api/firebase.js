// /api/firebase.js
// =====================================
// Firebase Production Core (Ultra Fast) 2026
// Auth + Firestore + Storage + Analytics + App Check
// =====================================

import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
  getAnalytics,
  isSupported as isAnalyticsSupported,
  logEvent,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  enableIndexedDbPersistence,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-storage.js";

import {
  initializeAppCheck,
  ReCaptchaV3Provider,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app-check.js";

// ==========================
// Configuration
// ==========================
const firebaseConfig = {
  apiKey: "AIzaSyBDMFcCvthKNkHUrEbgYY1Uc80KTPpS01M",
  authDomain: "oraa-slayer-anime.firebaseapp.com",
  projectId: "oraa-slayer-anime",
  storageBucket: "oraa-slayer-anime.firebasestorage.app",
  messagingSenderId: "426607460785",
  appId: "1:426607460785:web:c8d9844253c9111ad3bd90",
  measurementId: "G-VNHP64HXD5",
};

const isBrowser =
  typeof window !== "undefined" &&
  typeof document !== "undefined";

// ==========================
// Core initialization
// ==========================
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// ==========================
// Firestore cache
// ==========================
// Runs in background only. Does not block initial render.
let firestoreCachePromise = null;

function initFirestoreCache() {
  if (!isBrowser) return Promise.resolve(false);
  if (firestoreCachePromise) return firestoreCachePromise;

  firestoreCachePromise = enableIndexedDbPersistence(db)
    .then(() => true)
    .catch(() => false);

  return firestoreCachePromise;
}

// ==========================
// App Check
// ==========================
// Replace with a real production reCAPTCHA v3 site key.
const APP_CHECK_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

let appCheckInitialized = false;

function initAppCheck() {
  if (!isBrowser || appCheckInitialized) return;

  try {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(APP_CHECK_SITE_KEY),
      isTokenAutoRefreshEnabled: true,
    });
    appCheckInitialized = true;
  } catch {
    // Silent fallback.
  }
}

// ==========================
// Analytics
// ==========================
let analytics = null;
let analyticsInitPromise = null;

function initAnalytics() {
  if (!isBrowser) return Promise.resolve(null);
  if (analytics) return Promise.resolve(analytics);
  if (analyticsInitPromise) return analyticsInitPromise;

  analyticsInitPromise = (async () => {
    try {
      if (await isAnalyticsSupported()) {
        analytics = getAnalytics(app);
      }
    } catch {
      analytics = null;
    }
    return analytics;
  })();

  return analyticsInitPromise;
}

function logAppEvent(name, params = {}) {
  if (!analytics) return;
  try {
    logEvent(analytics, name, params);
  } catch {
    // Do not break the app.
  }
}

// ==========================
// Helpers
// ==========================
function getUserDoc(uid, collectionName = "users") {
  return doc(db, collectionName, uid);
}

async function safeGetDoc(refDoc) {
  const snap = await getDoc(refDoc);
  return {
    exists: snap.exists(),
    id: snap.id,
    data: snap.exists() ? snap.data() : null,
    snapshot: snap,
  };
}

async function safeSetDoc(refDoc, data, options = {}) {
  return options.merge
    ? setDoc(refDoc, data, { merge: true })
    : setDoc(refDoc, data);
}

async function safeUpdateProfile(user, data) {
  if (!user) throw new Error("No authenticated user found.");
  return updateProfile(user, data);
}

async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

async function signUpWithEmail(email, password, displayName = "") {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
  return cred.user;
}

async function signInWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

async function signOutUser() {
  return signOut(auth);
}

async function uploadFileToStorage(path, file, metadata = {}) {
  const storageRef = ref(storage, path);
  const snap = await uploadBytes(storageRef, file, metadata);
  const url = await getDownloadURL(snap.ref);
  return { snap, url };
}

function nowServer() {
  return serverTimestamp();
}

// ==========================
// Bootstrap
// ==========================
// Non-blocking startup: analytics + cache + appcheck in background.
async function initFirebaseServices() {
  initAppCheck();

  const [analyticsValue] = await Promise.all([
    initAnalytics(),
    initFirestoreCache(),
  ]);

  if (isBrowser) {
    window.firebaseApp = app;
    window.firebaseAuth = auth;
    window.firebaseDB = db;
    window.firebaseStorage = storage;
    window.firebaseAnalytics = analyticsValue;
    window.firebaseGoogleProvider = googleProvider;
  }

  return {
    app,
    auth,
    db,
    storage,
    analytics: analyticsValue,
  };
}

void initFirebaseServices().then(() => {
  logAppEvent("app_start", {
    version: "2026_production_core",
    platform: "web",
  });
});

// ==========================
// Exports
// ==========================
export {
  app,
  auth,
  db,
  storage,
  analytics,
  firebaseConfig,
  googleProvider,

  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,

  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  arrayUnion,
  arrayRemove,
  serverTimestamp,

  ref,
  uploadBytes,
  getDownloadURL,

  logAppEvent,
  getUserDoc,
  safeGetDoc,
  safeSetDoc,
  safeUpdateProfile,
  signInWithGoogle,
  signUpWithEmail,
  signInWithEmail,
  signOutUser,
  uploadFileToStorage,
  nowServer,
  initFirebaseServices,
};

const firebaseAPI = {
  get app() {
    return app;
  },
  get auth() {
    return auth;
  },
  get db() {
    return db;
  },
  get storage() {
    return storage;
  },
  get analytics() {
    return analytics;
  },
  firebaseConfig,
  googleProvider,
  logAppEvent,
  getUserDoc,
  safeGetDoc,
  safeSetDoc,
  safeUpdateProfile,
  signInWithGoogle,
  signUpWithEmail,
  signInWithEmail,
  signOutUser,
  uploadFileToStorage,
  nowServer,
  initFirebaseServices,
};

export default firebaseAPI;