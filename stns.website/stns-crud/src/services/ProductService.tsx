import axios from "axios";

const API_BASE_URL = "http://localhost:9191";

const ProductService = {
  postProduct: async (productData: any, token: string | null) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/product`,
        {
          name: productData.name,
          quantity: productData.quantity,
          price: productData.price,
          category: {
            id: productData.categoryId,
          },
        },
        { headers }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllProducts: async (token: string | null) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/product/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPaginatedProducts: async (token: string | null, page: number, size: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/product/all?page=${page}&size=${size}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProduct: async (productData: any, token: string | null) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.put(
        `${API_BASE_URL}/product`,
        {
          id: productData.id,
          name: productData.name,
          quantity: productData.quantity,
          price: productData.price,
        },
        { headers }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteProduct: async (productId: number, token: string | null) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.delete(`${API_BASE_URL}/product/${productId}`, {
        headers,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  searchProducts: async (token: string | null, query: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/product/search?name=${query}`, {
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

export default ProductService;
