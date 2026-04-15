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
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

console.log('Firebase config:', firebaseConfig);

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

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
  console.log('Fetching products from Firestore...');

  const snapshot = await getDocs(collection(db, 'products'));
  const products = snapshot.docs.map(normalizeProduct);

  console.log('PRODUCTS:', products);

  return products;
}

export async function getFeaturedProducts(limitCount = 3) {
  const products = await getProducts();
  return products.slice(0, limitCount);
}

export async function getProductById(productId) {
  console.log('Fetching product details for:', productId);

  const snapshot = await getDoc(doc(db, 'products', productId));

  if (!snapshot.exists()) {
    return null;
  }

  return normalizeProduct(snapshot);
}

export async function createProduct(product) {
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