import Cookies from "js-cookie";

export const isLoggedIn = () => {
  return !!Cookies.get("accessToken");
};

export const login = (accessToken: string, refreshToken: string) => {
  Cookies.set("accessToken", accessToken, { sameSite: "None", secure: true });
  Cookies.set("refreshToken", refreshToken, { sameSite: "None", secure: true });
};

export const logout = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
};

export const getAccessToken = () => {
  return Cookies.get("accessToken") || "";
};

export const getRefreshToken = () => {
  return Cookies.get("refreshToken") || "";
};
