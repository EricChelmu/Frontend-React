import React, { useEffect, useState } from "react";
import categoryService from "../services/CategoryService";
import Cookies from "js-cookie";
import CategoryBox from "../components/CategoryBox";
import "../assets/AllCategories.css";

const categoriesPerPage = 3;

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
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<CategoryData[]>([]);

  useEffect(() => {
    // Fetch categories from the API and update state
    const fetchCategories = async () => {
      try {
        const token = Cookies.get("token") || "";
        const response = await categoryService.getAllCategories(token);
        console.log(response);
        setCategories(response);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  const currentCategories = categories.slice(
    (currentPage - 1) * categoriesPerPage,
    currentPage * categoriesPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="all-categories">
      <h2>All Categories</h2>
      {currentCategories && currentCategories.length > 0 ? (
        <React.Fragment>
          <div className="category-boxes">
            {currentCategories.map(category => (
              <CategoryBox key={category.id} category={category} />
            ))}
          </div>
          {/* Pagination controls */}
          <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            <span>{`${currentPage} / ${totalPages}`}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </React.Fragment>
      ) : (
        <p>No categories found.</p>
      )}
    </div>
  );
};

export default CategoriesPage;
