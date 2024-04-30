import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoutes = () => {
  const { token } = useAuth();

  return token ? <Outlet /> : null;
};

export default PrivateRoutes;
