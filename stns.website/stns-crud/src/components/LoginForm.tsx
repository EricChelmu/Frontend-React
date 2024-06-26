import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import "../index.css";
import "../assets/css/LoginPage.css";
import "../assets/css/ErrorMessage.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiCall from "../utils/ApiCall";

const API_URL = import.meta.env.VITE_API_URL;

interface LoginFormProps {
  onLogin: (formData: { username: string; password: string }) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const initialFormData = { username: "", password: "" };
  const [formData, setFormData] = useState(initialFormData);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setToken } = useAuth();

  useEffect(() => {
    const storedToken = Cookies.get("authToken");

    if (storedToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleLoginSuccess = (token: string) => {
    Cookies.set("token", token, { sameSite: "None", secure: true });
    setToken(token);
    console.log("Login successful:", token);
    resetForm();
    onLogin(formData);
    navigate("/new-category");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const response = await apiCall({
        method: "POST",
        url: `${API_URL}/users/authenticate`,
        data: formData,
      });

      const token = response.data.token;
      handleLoginSuccess(token);
    } catch (error) {
      const axiosError = error as AxiosError<any>;

      if (axiosError.response && axiosError.response.data) {
        setLoginError(axiosError.response.data.message);
      } else {
        setLoginError("Username or Password has not been found in our database. Please try again.");
      }
    }
  };

  return (
    <div className="login-form">
      <h2>Login Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="username"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {loginError && <div className="error-message">{loginError}</div>}
        <button className="login-button" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
