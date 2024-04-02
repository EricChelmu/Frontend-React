import React, { useState } from "react";
import categoryService from "../services/CategoryService";
import Cookies from "js-cookie";
import "../assets/css/NewCategory.css";

interface CategoryData {
  name: string;
  products: any[];
}

const NewCategory: React.FC = () => {
  const initialCategoryData: CategoryData = {
    name: "",
    products: [],
  };
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const [categoryData, setCategoryData] = useState<CategoryData>(initialCategoryData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategoryData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCategoryError(null);
    try {
      const token = Cookies.get("token") || "";

      const requestData = {
        category: categoryData, // Wrapping categoryData inside the 'category' field
      };

      await categoryService.postCategory(requestData, token);

      setCategoryData(initialCategoryData);
    } catch (error) {
      console.error("Error posting category:", error);
      setCategoryError("An error occurred while submitting the category. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>New Category</h2>
      <form className="form" onSubmit={handleFormSubmit}>
        {/* Form field for category name */}
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={categoryData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        {categoryError && <div className="error-message">{categoryError}</div>}

        <div className="button-group">
          <button className="button" type="submit">
            Submit Category
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewCategory;
