import React from "react";
import ReactDOM from "react-dom";
import App from "./App.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import { CartProvider } from "./context/CartContext";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <Router>
          <App />
        </Router>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
