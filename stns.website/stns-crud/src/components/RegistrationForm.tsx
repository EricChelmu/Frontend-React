import React from "react";
import axios, { AxiosError } from "axios";
import "../assets/RegisterPage.css";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  roles: string;
}

interface RegistrationFormProps {
  onRegistration?: (formData: FormData) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegistration }) => {
  const initialFormData: FormData = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    roles: "",
  };

  const [formData, setFormData] = React.useState<FormData>(initialFormData);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:9191/users/sign-up", formData);
      console.log("Request successful:", response.data);

      if (onRegistration) {
        onRegistration(formData);
      }
      resetForm();
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response && axiosError.response.data) {
        console.error("Request failed:", axiosError.response.data);
      } else {
        console.error("Request failed:", axiosError.message);
      }
    }
  };

  return (
    <div className="registration-form">
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
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
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="roles">Roles:</label>
          <input
            type="text"
            id="roles"
            name="roles"
            value={formData.roles}
            onChange={handleChange}
            required
          />
        </div>
        <button className="register-button" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
