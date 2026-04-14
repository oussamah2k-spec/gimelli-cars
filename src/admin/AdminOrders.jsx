import React, { useMemo, useState } from "react";
import "../styles/admin.css";
import { useRealtimeOrders } from "../hooks/useRealtimeOrders";
import OrdersTable from "./components/OrdersTable";
import OrderStatusPanel from "./components/OrderStatusPanel";
import { deleteOrderById, updateOrderStatus } from "../firebase/orders";

const AdminOrders = () => {
  const { orders, loading } = useRealtimeOrders();
  const [deletedOrderIds, setDeletedOrderIds] = useState([]);
  const [deletingId, setDeletingId] = useState("");

  const visibleOrders = useMemo(
    () => orders.filter((order) => !deletedOrderIds.includes(order.id)),
    [deletedOrderIds, orders]
  );

  const handleOrderStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Delete this booking?")) return;

    try {
      setDeletingId(orderId);
      setDeletedOrderIds((prev) => (prev.includes(orderId) ? prev : [...prev, orderId]));
      await deleteOrderById(orderId);
    } catch (error) {
      console.error("Error deleting booking:", error);
      setDeletedOrderIds((prev) => prev.filter((id) => id !== orderId));
    } finally {
      setDeletingId("");
    }
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="admin-orders">
      <h1>Admin Orders Dashboard</h1>
      {visibleOrders.length === 0 ? (
        <div>No orders yet</div>
      ) : (
        <OrdersTable 
          orders={visibleOrders}
          onConfirmOrder={(orderId) => handleOrderStatusChange(orderId, "confirmed")}
          onCancelOrder={(orderId) => handleOrderStatusChange(orderId, "cancelled")}
          onDeleteOrder={handleDeleteOrder}
          deletingId={deletingId}
        />
      )}
      <div className="order-status-panel">
        {visibleOrders.map(order => (
          <OrderStatusPanel key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;