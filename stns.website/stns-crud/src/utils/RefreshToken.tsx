import axios from "axios";
import { login, getRefreshToken } from "../utils/AuthUtils";

export const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      "http://localhost:9191/refresh-token",
      { refresh_token: getRefreshToken() },
      { withCredentials: true }
    );
    const { access_token, refresh_token } = response.data;
    login(access_token, refresh_token);
    return access_token;
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    throw error;
  }
};
