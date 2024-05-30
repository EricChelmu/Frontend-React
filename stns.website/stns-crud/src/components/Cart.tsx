import React from "react";
import { useCart } from "../context/CartContext";
import "../assets/css/Cart.css";

const Cart: React.FC = () => {
  const { cart, removeFromCart, clearCart } = useCart();

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
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
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <div className="cart-total">
        <h3>Total: ${getTotalPrice().toFixed(2)}</h3>
      </div>
      {cart.length > 0 && <button onClick={clearCart}>Clear Cart</button>}
    </div>
  );
};

export default Cart;
