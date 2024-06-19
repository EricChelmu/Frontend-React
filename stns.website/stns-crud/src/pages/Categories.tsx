import React, { useEffect, useState } from "react";
import categoryService from "../services/CategoryService";
import { getToken } from "../utils/AuthUtils";
import "../assets/css/AllCategories.css";

export interface CategoryData {
  id: number;
  name: string;
  description: string;
  productCount: number;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const categoriesPerPage = 10;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = getToken();
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

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  return (
    <div className="centered-container">
      <h2>All Categories</h2>
      {categories && categories.length > 0 ? (
        <table className="category-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Description</th>
              <th>Product Count</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id} className="category-row">
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>{category.productCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No categories found.</p>
      )}
      <div className="pagination">
        <button className="button" onClick={handlePreviousPage} disabled={currentPage === 0}>
          Previous
        </button>
        <span>{`${currentPage + 1} / ${totalPages}`}</span>
        <button
          className="button"
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CategoriesPage;
