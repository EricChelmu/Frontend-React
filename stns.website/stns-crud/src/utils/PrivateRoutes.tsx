import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoutes = () => {
  const { token } = useAuth();

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
