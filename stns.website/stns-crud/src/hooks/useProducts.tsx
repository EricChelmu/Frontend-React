import { useState, useEffect } from "react";
import ProductService from "../services/ProductService";
import Cookies from "js-cookie";

const useProducts = (pageNum = 1) => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        const token = Cookies.get("token") || "";
        const response = await ProductService.getPaginatedProducts(token, pageNum, 12);
        setProducts(prevProducts => [...prevProducts, ...response.content]);
        setHasNextPage(response.content.length > 0);
      } catch (error) {
        setIsError(true);
        setError(error);
      }

      setIsLoading(false);
    };

    if (hasNextPage && !isLoading) {
      fetchProducts();
    }
  }, [pageNum, hasNextPage, isLoading]);

  return { products, isLoading, isError, error, hasNextPage };
};

export default useProducts;
