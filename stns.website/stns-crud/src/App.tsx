import React from "react";
import RegistrationForm from "./components/RegistrationForm";
import LoginForm from "./components/LoginForm";
import { Route, Routes, Link } from "react-router-dom";
import NewCategory from "./pages/NewCategory";
import CategoriesPage from "./pages/Categories";
import ProductsPage from "./pages/Products";
import PrivateRoutes from "./utils/PrivateRoutes";
import Cookies from "js-cookie";
import { useAuth } from "./context/AuthContext";
import NewProduct from "./pages/NewProduct";
import { useNavigate } from "react-router-dom";

const App: React.FC = () => {
  const { token, setToken } = useAuth();
  const [isLoggedIn, setLoggedIn] = React.useState(!!token);
  const navigate = useNavigate();

  React.useEffect(() => {
    setLoggedIn(!!token);
  }, [token]);

  const handleLogin = (formData: { username: string; password: string }) => {
    console.log("Login data:", formData);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("token");
    setToken(null);
    setLoggedIn(false);
    navigate("/login");
  };

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/register">Register</Link>
          </li>
          {!isLoggedIn ? (
            <li>
              <Link to="/login">Login</Link>
            </li>
          ) : (
            <li>
              <button className="nav-button" onClick={handleLogout}>
                Logout
              </button>
            </li>
          )}
          {isLoggedIn && (
            <>
              <li>
                <Link to="/new-category">New Category</Link>
              </li>
              <li>
                <Link to="/all-categories">All Categories</Link>
              </li>
              <li>
                <Link to="/all-products">All Products</Link>
              </li>
              <li>
                <Link to="/new-product">New Product</Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <Routes>
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route
          path="/register"
          element={
            <RegistrationForm
              onRegistration={(formData: any) => {
                console.log("Registration data:", formData);
              }}
            />
          }
        />
        <Route element={<PrivateRoutes />}>
          <Route path="/new-category" element={<NewCategory />} />
          <Route path="/all-categories" element={<CategoriesPage />} />
          <Route path="/all-products" element={<ProductsPage />} />
          <Route path="/new-product" element={<NewProduct />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
