import React from "react";
import RegistrationForm from "./components/RegistrationForm";
import LoginForm from "./components/LoginForm";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import NewCategory from "./pages/NewCategory";
import CategoriesPage from "./pages/CategoriesPage";
import ProductsPage from "./pages/ProductsPage";
import PrivateRoutes from "./utils/PrivateRoutes";
import Cookies from "js-cookie";
import { AuthProvider } from "./context/AuthContext";

const App: React.FC = () => {
  const [isLoggedIn, setLoggedIn] = React.useState(false);

  const handleLogin = (formData: { username: string; password: string }) => {
    console.log("Login data:", formData);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    setLoggedIn(false);
  };

  return (
    <Router>
      <AuthProvider>
        {" "}
        {/* Wrap the App with AuthProvider and pass isLoggedIn state */}
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
                <React.Fragment>
                  <li>
                    <Link to="/new-category">New Category</Link>
                  </li>
                  <li>
                    <Link to="/all-categories">All Categories</Link>
                  </li>
                  <li>
                    <Link to="/all-products">All Products</Link> {/* New link */}
                  </li>
                </React.Fragment>
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
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
