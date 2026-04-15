import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const requiredEnvMap = {
  REACT_APP_FIREBASE_API_KEY: firebaseConfig.apiKey,
  REACT_APP_FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain,
  REACT_APP_FIREBASE_PROJECT_ID: firebaseConfig.projectId,
  REACT_APP_FIREBASE_STORAGE_BUCKET: firebaseConfig.storageBucket,
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID: firebaseConfig.messagingSenderId,
  REACT_APP_FIREBASE_APP_ID: firebaseConfig.appId,
};

const missingFirebaseEnvVars = Object.entries(requiredEnvMap)
  .filter(([, value]) => !value || !String(value).trim())
  .map(([envKey]) => envKey);

const firebaseEnvDebug = {
  apiKeyLoaded: Boolean(firebaseConfig.apiKey),
  authDomainLoaded: Boolean(firebaseConfig.authDomain),
  projectIdLoaded: Boolean(firebaseConfig.projectId),
  storageBucketLoaded: Boolean(firebaseConfig.storageBucket),
  messagingSenderIdLoaded: Boolean(firebaseConfig.messagingSenderId),
  appIdLoaded: Boolean(firebaseConfig.appId),
  nodeEnv: process.env.NODE_ENV,
};

console.info('[Firebase] Environment check:', firebaseEnvDebug);

if (missingFirebaseEnvVars.length > 0) {
  console.error(
    `[Firebase] Missing required environment variables: ${missingFirebaseEnvVars.join(', ')}.`
  );
}

const canInitializeFirebase = missingFirebaseEnvVars.length === 0;

const app = canInitializeFirebase
  ? (getApps().length ? getApp() : initializeApp(firebaseConfig))
  : null;
const db = app ? getFirestore(app) : null;
const auth = app ? getAuth(app) : null;

function ensureFirestoreReady() {
  if (!db) {
    throw new Error(
      '[Firebase] Firestore is not initialized. Check REACT_APP_FIREBASE_* variables in your Vercel project settings and redeploy.'
    );
  }
}

function normalizeProduct(documentSnapshot) {
  const data = documentSnapshot.data() || {};

  return {
    id: documentSnapshot.id,
    name: data.name || 'Untitled car',
    price: Number(data.price || 0),
    imageUrl: data.imageUrl || '',
    description: data.description || 'No description available.',
    createdAt: data.createdAt || null,
  };
}

export async function getProducts() {
  ensureFirestoreReady();

  const snapshot = await getDocs(collection(db, 'products'));
  const products = snapshot.docs.map(normalizeProduct);

  return products;
}

export async function getFeaturedProducts(limitCount = 3) {
  const products = await getProducts();
  return products.slice(0, limitCount);
}

export async function getProductById(productId) {
  ensureFirestoreReady();

  const snapshot = await getDoc(doc(db, 'products', productId));

  if (!snapshot.exists()) {
    return null;
  }

  return normalizeProduct(snapshot);
}

export async function createProduct(product) {
  ensureFirestoreReady();

  const payload = {
    name: product.name,
    price: Number(product.price),
    imageUrl: product.imageUrl,
    description: product.description,
    createdAt: serverTimestamp(),
  };

  return addDoc(collection(db, 'products'), payload);
}

export { app, auth, db };