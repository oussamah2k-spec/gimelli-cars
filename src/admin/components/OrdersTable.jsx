import React from 'react';
import OrderStatusPanel from './OrderStatusPanel';

const OrdersTable = ({ orders, onConfirmOrder, onCancelOrder, onDeleteOrder, deletingId }) => {

  return (
    <table className="orders-table">
      <thead>
        <tr>
          <th>Customer Name</th>
          <th>Phone</th>
          <th>Address</th>
          <th>Total Price</th>
          <th>Status</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.customerName}</td>
            <td>{order.phone}</td>
            <td>{order.address}</td>
            <td>${Number(order.totalPrice || 0).toFixed(2)}</td>
            <td>
              <OrderStatusPanel status={order.status} />
            </td>
            <td>{order.date ? new Date(order.date).toLocaleDateString() : '-'}</td>
            <td className="actions">
              <button className="confirm" onClick={() => onConfirmOrder(order.id)} disabled={deletingId === order.id}>Confirm</button>
              <button className="cancel" onClick={() => onCancelOrder(order.id)} disabled={deletingId === order.id}>Cancel</button>
              <button
                className="delete"
                onClick={() => onDeleteOrder(order.id)}
                disabled={deletingId === order.id}
              >
                {deletingId === order.id ? 'Deleting...' : '🗑 Delete'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrdersTable;