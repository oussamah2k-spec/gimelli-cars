import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { app } from './auth';

const db = getFirestore(app);
const ordersCollection = collection(db, 'orders');

export async function createOrder(order) {
  return addDoc(ordersCollection, {
    ...order,
    status: order.status || 'pending',
    createdAt: serverTimestamp(),
  });
}

export async function updateOrderStatus(orderId, status) {
  return updateDoc(doc(db, 'orders', orderId), { status });
}

export async function deleteOrderById(orderId) {
  return deleteDoc(doc(db, 'orders', orderId));
}

export function subscribeToOrders(callback, onError) {
  const ordersQuery = query(ordersCollection, orderBy('createdAt', 'desc'));

  return onSnapshot(
    ordersQuery,
    (snapshot) => {
      callback(
        snapshot.docs.map((orderDoc) => ({
          id: orderDoc.id,
          ...orderDoc.data(),
        }))
      );
    },
    onError
  );
}