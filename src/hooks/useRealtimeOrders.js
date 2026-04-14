import { useEffect, useState } from 'react';
import { subscribeToOrders } from '../firebase/orders';

export function useRealtimeOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToOrders(
      (nextOrders) => {
        setOrders(nextOrders);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading orders:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { orders, loading };
}