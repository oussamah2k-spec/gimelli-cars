import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const FALLBACK_CAR_IMAGE =
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80';

function getCreatedAtValue(createdAt) {
  if (!createdAt) {
    return 0;
  }

  if (typeof createdAt?.toMillis === 'function') {
    return createdAt.toMillis();
  }

  if (typeof createdAt?.seconds === 'number') {
    return createdAt.seconds * 1000;
  }

  const parsedDate = Date.parse(createdAt);
  return Number.isNaN(parsedDate) ? 0 : parsedDate;
}

function normalizeProduct(doc) {
  const data = doc.data() || {};

  return {
    id: doc.id,
    name: data.name || data.title || 'Premium Vehicle',
    price: Number(data.price || 0),
    imageUrl: data.imageUrl || data.image || FALLBACK_CAR_IMAGE,
    description: data.description || 'Contact us for full vehicle details and availability.',
    type: data.type || data.category || data.bodyType || 'All',
    createdAt: data.createdAt || null,
    createdAtValue: getCreatedAtValue(data.createdAt),
    location: data.location || 'Morocco',
    mileage: data.mileage || '',
    year: data.year || '',
  };
}

export async function fetchProducts() {
  const snapshot = await getDocs(collection(db, 'cars'));

  const cars = snapshot.docs
    .map(normalizeProduct)
    .sort((leftProduct, rightProduct) => rightProduct.createdAtValue - leftProduct.createdAtValue);

  console.log('Cars:', cars);

  return cars;
}