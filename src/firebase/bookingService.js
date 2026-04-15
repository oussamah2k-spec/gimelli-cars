import { deleteOrderById, getOrders, updateOrderStatus } from './orders';

function formatDate(createdAt) {
  if (!createdAt) {
    return null;
  }

  if (typeof createdAt?.toDate === 'function') {
    return createdAt.toDate().toISOString();
  }

  if (createdAt instanceof Date) {
    return createdAt.toISOString();
  }

  if (typeof createdAt?.seconds === 'number') {
    return new Date(createdAt.seconds * 1000).toISOString();
  }

  return createdAt;
}

function normalizeBooking(order) {
  const items = Array.isArray(order.items) ? order.items : [];
  const primaryItem = items[0] || {};

  return {
    id: order.id,
    customerName:
      order.customerName ||
      order.name ||
      order.fullName ||
      order.userName ||
      order.userEmail ||
      'Walk-in customer',
    email: order.email || order.userEmail || '',
    phone: order.phone || order.customerPhone || '',
    carName: order.carName || order.productName || primaryItem.name || 'Unknown car',
    itemsCount: items.length,
    total: Number(order.total || order.amount || 0),
    status: order.status || 'pending',
    createdAt: formatDate(order.createdAt),
    raw: order,
  };
}

export async function fetchBookings() {
  const orders = await getOrders();
  return orders.map(normalizeBooking);
}

export async function confirmBooking(bookingId) {
  return updateOrderStatus(bookingId, 'confirmed');
}

export async function cancelBooking(bookingId) {
  return updateOrderStatus(bookingId, 'cancelled');
}

export async function deleteBooking(bookingId) {
  return deleteOrderById(bookingId);
}
