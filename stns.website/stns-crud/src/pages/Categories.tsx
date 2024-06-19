import React, { useEffect, useState } from "react";
import categoryService from "../services/CategoryService";
import { getToken } from "../utils/AuthUtils";
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
  showAllProducts?: boolean;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  const handleShowMore = (categoryId: number) => {
    setCategories(prevCategories =>
      prevCategories.map(category =>
        category.id === categoryId ? { ...category, showAllProducts: true } : category
      )
    );
  };

  return (
    <div className="centered-container">
      <h2>All Categories</h2>
      {categories && categories.length > 0 ? (
        <table className="category-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Products</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id} className="category-row">
                <td>{category.name}</td>
                <td>
                  <ul>
                    {category.products
                      .slice(0, category.showAllProducts ? undefined : 4)
                      .map(product => (
                        <li key={product.id}>
                          <strong>{product.name}</strong> - Quantity: {product.quantity}, Price:{" "}
                          {product.price}
                        </li>
                      ))}
                  </ul>
                  {!category.showAllProducts && (
                    <button onClick={() => handleShowMore(category.id)}>Show more</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No categories found.</p>
      )}
      <div className="pagination">
        <button className="button" onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>{`${currentPage} / ${totalPages}`}</span>
        <button className="button" onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default CategoriesPage;
