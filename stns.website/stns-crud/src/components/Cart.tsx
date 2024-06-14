import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../assets/css/Cart.css";

const Cart: React.FC = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleProceedToCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
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
      <div className="cart-total">
        <h3>Total: ${getTotalPrice().toFixed(2)}</h3>
        {/* Proceed to Checkout button */}
        <button onClick={handleProceedToCheckout}>Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default Cart;
