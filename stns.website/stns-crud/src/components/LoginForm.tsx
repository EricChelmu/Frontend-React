import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import "../index.css";
import "../assets/LoginPage.css";
import "../assets/ErrorMessage.css";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  onLogin: (formData: { username: string; password: string }) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const initialFormData = { username: "", password: "" };
  const [formData, setFormData] = useState(initialFormData);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();

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
    console.log("Login successful:", token);
    resetForm();
    onLogin(formData);
    navigate("/new-category");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError(null); // Reset login error on each submission

    try {
      const response = await axios.post("http://localhost:9191/users/authenticate", formData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
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
