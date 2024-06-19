import React, { useState, useEffect } from "react";
import { CategoryData } from "./Categories";
import { getToken } from "../utils/AuthUtils";
import CategoryService from "../services/CategoryService";
import ProductService from "../services/ProductService";
import CategoryListBox from "../components/CategoryListBox";
import "../assets/css/NewProduct.css";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    categoryId: "",
  });
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [nameError, setNameError] = useState<string | null>(null);
  const [quantityError, setQuantityError] = useState<string | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const categoriesPerPage = 12;

  const validateInput = () => {
    let isValid = true;

    if (!formData.name.trim()) {
      setNameError("Name cannot be empty");
      isValid = false;
    } else {
      setNameError(null);
    }

    if (!formData.categoryId) {
      setCategoryError("Category is required");
      isValid = false;
    } else {
      setCategoryError(null);
    }

    const quantity = parseInt(formData.quantity);
    if (isNaN(quantity) || quantity < 0) {
      setQuantityError("Quantity must be a non-negative number");
      isValid = false;
    } else {
      setQuantityError(null);
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) {
      setPriceError("Price must be a non-negative number");
      isValid = false;
    } else {
      setPriceError(null);
    }

    return isValid;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = getToken();
        const response = await CategoryService.getAllCategories(token);
        setCategories(response.content);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [currentPage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();
    try {
      const token = getToken();
      if (!validateInput()) {
        console.error("Invalid input data");
        return;
      }
      const selectedCategory = categories.find(
        category => category.id.toString() === formData.categoryId
      );
      if (selectedCategory) {
        formData.categoryId = selectedCategory.id.toString();
        if ("category" in formData) {
          delete formData.category;
        }
      }
      await ProductService.postProduct(formData, token);
      console.log("Product created successfully:", formData);
      setSuccessMessage("Product created successfully");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 2000);
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
          {nameError && <div className="error-message">{nameError}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Price:</label>
          <input type="text" name="price" value={formData.price} onChange={handleChange} />
          {priceError && <div className="error-message">{priceError}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Quantity:</label>
          <input type="text" name="quantity" value={formData.quantity} onChange={handleChange} />
          {quantityError && <div className="error-message">{quantityError}</div>}
        </div>
        <div className="flex flex-col gap-2">
          <label>Category:</label>
          <CategoryListBox
            value={formData.categoryId}
            onChange={(category: CategoryData) =>
              setFormData({ ...formData, categoryId: category.id.toString() })
            }
            categories={categories}
          />
          {categoryError && <div className="error-message">{categoryError}</div>}
        </div>
        {successMessage && <div className="success-message">{successMessage}</div>}
        <button type="submit" className="submit-button">
          Create Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
