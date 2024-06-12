import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../assets/css/Checkout.css";

const Checkout: React.FC = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    clearCart();
    navigate("/confirmation");
  };

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="cart-items">
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <ul>
            {cart.map(item => (
              <li key={item.id} className="cart-item">
                <span>{item.name}</span>
                <span>{item.quantity}</span>
                <span>${item.price}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="total">
        <h3>Total: ${getTotalPrice().toFixed(2)}</h3>
      </div>
      <button onClick={handleCheckout}>Proceed to Payment</button>
    </div>
  );
};

export default Checkout;
