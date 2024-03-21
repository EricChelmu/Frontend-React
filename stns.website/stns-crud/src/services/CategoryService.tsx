import axios from "axios";

const API_BASE_URL = "http://localhost:9191";

const CategoryService = {
  postCategory: async (categoryData: any, token: string | null) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/category`, categoryData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllCategories: async (token: string | null) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/category/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
export default CategoryService;
