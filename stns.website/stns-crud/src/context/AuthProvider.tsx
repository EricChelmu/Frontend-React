import { createContext, useState, ReactNode, useContext } from "react";

interface AuthContextType {
  auth: any;
  setAuth: React.Dispatch<React.SetStateAction<any>>;
  persist: any;
  setPersist: React.Dispatch<React.SetStateAction<any>>;
}

const AuthContext = createContext<AuthContextType>({
  auth: {},
  setAuth: () => {},
  persist: {},
  setPersist: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<any>({}); // Or replace `any` with the type of auth
  const persistData = localStorage.getItem("persist");
  const [persist, setPersist] = useState<any>(persistData ? JSON.parse(persistData) : false); // Or replace `any` with the type of persist

  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
