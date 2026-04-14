import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createOrder } from '../firebase/orders';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, totalAmount } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      await createOrder({
        userId: currentUser.uid,
        items: cartItems,
        total: totalAmount,
        createdAt: new Date(),
      });
      // Clear cart after successful order
      // Add your cart clearing logic here
      navigate('/thank-you'); // Redirect to a thank you page or order confirmation
    } catch (error) {
      console.error("Error creating order: ", error);
      // Handle error (e.g., show a notification)
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-summary">
        <h2>Your Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.name} - ${item.price} x {item.quantity}
              </li>
            ))}
          </ul>
        )}
        <h3>Total: ${totalAmount}</h3>
        <button onClick={handleCheckout} disabled={cartItems.length === 0}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Checkout;