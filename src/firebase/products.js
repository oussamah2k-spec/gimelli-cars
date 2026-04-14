import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { app } from './auth';

const db = getFirestore(app);

export async function fetchProducts() {
  const snapshot = await getDocs(collection(db, 'products'));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}