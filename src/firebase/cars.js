import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';

const carsCollection = collection(db, 'cars');

const FALLBACK_CAR_IMAGE =
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80';

function getTimestampValue(createdAt) {
  if (!createdAt) {
    return 0;
  }

  if (typeof createdAt?.toMillis === 'function') {
    return createdAt.toMillis();
  }

  if (typeof createdAt?.seconds === 'number') {
    return createdAt.seconds * 1000;
  }

  const parsedValue = Date.parse(createdAt);
  return Number.isNaN(parsedValue) ? 0 : parsedValue;
}

function normalizeStock(data) {
  const rawStock = data.stock ?? data.availability;

  if (typeof rawStock === 'string' && rawStock.trim() !== '') {
    return rawStock.trim();
  }

  if (typeof rawStock === 'number') {
    return rawStock > 0 ? String(rawStock) : 'Not Available';
  }

  if (data.available === false || data.inStock === false) {
    return 'Not Available';
  }

  return 'Available';
}

function normalizeImage(image, fallbackUrl) {
  if (!image) {
    return null;
  }

  if (typeof image === 'string') {
    return {
      url: image,
      description: 'Car image',
    };
  }

  if (!image.url) {
    return null;
  }

  return {
    url: image.url,
    description: image.description || 'Car image',
  };
}

function normalizeCar(carDoc) {
  const data = carDoc.data() || {};
  const stock = normalizeStock(data);
  const type = data.type || data.category || data.bodyType || 'SUV';
  const imageUrl = data.imageUrl || data.image || FALLBACK_CAR_IMAGE;
  const images = Array.isArray(data.images)
    ? data.images.map((image) => normalizeImage(image, imageUrl)).filter(Boolean)
    : [];
  const normalizedImages = images.length
    ? images
    : [
        {
          url: imageUrl,
          description: 'Main car view',
        },
      ];

  return {
    id: carDoc.id,
    name: data.name || data.title || 'Untitled car',
    price: Number(data.price || 0),
    oldPrice: Number(data.oldPrice || 0),
    imageUrl,
    images: normalizedImages,
    description: data.description || '',
    type,
    brand: data.brand || '',
    year: data.year || '',
    location: data.location || 'Morocco',
    mileage: data.mileage || '',
    stock,
    featured: Boolean(data.featured),
    createdAt: data.createdAt || null,
    createdAtValue: getTimestampValue(data.createdAt),
  };
}

function buildImagePayload(car) {
  const images = Array.isArray(car.images)
    ? car.images
        .map((image) => normalizeImage(image, ''))
        .filter(Boolean)
        .map((image, index) => ({
          url: image.url,
          description: image.description || (index === 0 ? 'Main car view' : `Car view ${index + 1}`),
        }))
    : [];

  if (images.length > 0) {
    return images;
  }

  const imageUrl = car.imageUrl?.trim() || FALLBACK_CAR_IMAGE;

  return [
    {
      url: imageUrl,
      description: 'Main car view',
    },
  ];
}

function buildCarPayload(car) {
  const type = car.type?.trim() || car.category?.trim() || 'SUV';
  const images = buildImagePayload(car);

  return {
    name: car.name?.trim() || 'Untitled car',
    price: Number(car.price || 0),
    oldPrice: Number(car.oldPrice || 0),
    imageUrl: images[0]?.url || FALLBACK_CAR_IMAGE,
    images,
    description: car.description?.trim() || '',
    category: type,
    type,
    brand: car.brand?.trim() || '',
    year: car.year?.trim() || '',
    location: car.location?.trim() || 'Morocco',
    mileage: car.mileage?.trim() || '',
    stock: normalizeStock(car),
    featured: Boolean(car.featured),
  };
}

function sortCars(cars) {
  return [...cars].sort((leftCar, rightCar) => rightCar.createdAtValue - leftCar.createdAtValue);
}

export function subscribeToCars(onNext, onError) {
  return onSnapshot(
    query(carsCollection),
    (snapshot) => {
      const cars = sortCars(snapshot.docs.map(normalizeCar));
      onNext(cars);
    },
    onError
  );
}

export async function addCar(car) {
  return addDoc(carsCollection, {
    ...buildCarPayload(car),
    createdAt: serverTimestamp(),
  });
}

export async function updateCar(carId, car) {
  return updateDoc(doc(db, 'cars', carId), buildCarPayload(car));
}

export async function deleteCar(carId) {
  return deleteDoc(doc(db, 'cars', carId));
}
