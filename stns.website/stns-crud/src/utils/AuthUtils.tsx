import Cookies from "js-cookie";

export const isLoggedIn = () => {
  return !!Cookies.get("token");
};

export const login = (token: string) => {
  Cookies.set("token", token);
};

export const logout = () => {
  Cookies.remove("token");
};
