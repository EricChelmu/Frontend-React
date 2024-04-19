import React, { useState } from "react";
import categoryService from "../services/CategoryService";
import { getToken } from "../utils/AuthUtils";
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
  const [categorySuccess, setCategorySuccess] = useState<boolean>(false);

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
      const token = getToken();

      const requestData = {
        category: categoryData,
      };

      await categoryService.postCategory(requestData, token);

      setCategoryData(initialCategoryData);
      setCategorySuccess(true);
      setTimeout(() => {
        setCategorySuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error posting category:", error);
      setCategoryError("An error occurred while submitting the category. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-start min-w-screen">
      <div className="w-1/2 mt-10">
        <h2 className="text-center mb-4">New Category</h2>
        <form className="form" onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label>Name:</label>
            <input
              className="w-full px-3 py-2 border rounded-md"
              type="text"
              name="name"
              value={categoryData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          {categoryError && <div className="error-message">{categoryError}</div>}
          {categorySuccess && (
            <div className="success-message">Category submitted successfully!</div>
          )}
          <div className="button-group flex justify-center">
            <button className="button" type="submit">
              Submit Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCategory;
