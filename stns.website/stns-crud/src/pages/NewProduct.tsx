import React, { useState, useEffect } from "react";
import { CategoryData } from "./CategoriesPage";
import Cookies from "js-cookie";
import CategoryService from "../services/CategoryService";
import ProductService from "../services/ProductService";
import "../assets/NewProduct.css";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    categoryId: "", // Corrected property name
  });
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<CategoryData[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = Cookies.get("token") || "";
        const fetchedCategories = await CategoryService.getAllCategories(token);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "category") {
      // Filter categories based on the typed name
      handleCategorySearch(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCategorySearch = (searchQuery: string) => {
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();
    try {
      const token = Cookies.get("token") || "";
      // Find the category ID based on the typed category name
      const selectedCategory = categories.find(
        category => category.name.toLowerCase() === formData.categoryId.toLowerCase()
      );
      if (selectedCategory) {
        formData.categoryId = selectedCategory.id.toString();
        // Remove the 'category' property from formData
        if ("category" in formData) {
          delete formData.category;
        }
      }
      await ProductService.postProduct(formData, token);
      console.log("Product created successfully:", formData);
      setFormData({
        name: "",
        price: "",
        quantity: "",
        categoryId: "",
      });
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <div className="product-form-container">
      <h2 className="form-title">Create Product</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Price:</label>
          <input type="text" name="price" value={formData.price} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Quantity:</label>
          <input type="text" name="quantity" value={formData.quantity} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Category:</label>
          <input
            type="text"
            name="category"
            value={formData.categoryId}
            onChange={e => {
              handleChange(e);
              handleCategorySearch(e.target.value);
            }}
          />
          <ul className="category-list">
            {filteredCategories.map(category => (
              <li key={category.id}>{category.name}</li>
            ))}
          </ul>
        </div>
        <button type="submit" className="submit-button">
          Create Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
