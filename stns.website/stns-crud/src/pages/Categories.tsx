import React, { useEffect, useState } from "react";
import categoryService from "../services/CategoryService";
import Cookies from "js-cookie";
import CategoryBox from "../components/CategoryBox";
import "../assets/css/AllCategories.css";

interface ProductData {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export interface CategoryData {
  id: number;
  name: string;
  products: ProductData[];
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = Cookies.get("token") || "";
        const response = await categoryService.getPaginatedCategories(
          token,
          currentPage,
          categoriesPerPage
        );
        setCategories(response.content);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [currentPage]);

  const categoriesPerPage = 3;

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  return (
    <div className="all-categories">
      <h2>All Categories</h2>
      {categories && categories.length > 0 ? (
        <div>
          <div className="category-boxes">
            {categories.map(category => (
              <CategoryBox key={category.id} category={category} />
            ))}
          </div>
          <div className="pagination">
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>{`${currentPage} / ${totalPages}`}</span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </div>
      ) : (
        <p>No categories found.</p>
      )}
    </div>
  );
};

export default CategoriesPage;
