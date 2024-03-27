import React, { useState, useEffect } from "react";
import { CategoryData } from "./Categories";
import Cookies from "js-cookie";
import CategoryService from "../services/CategoryService";
import ProductService from "../services/ProductService";
import CategoryListbox from "../components/CategoryListBox";
import "../assets/css/NewProduct.css";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    categoryId: "",
  });
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<CategoryData[]>([]);
  const [nameError, setNameError] = useState<string | null>(null);
  const [quantityError, setQuantityError] = useState<string | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);

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
      handleCategorySearch(value);
      setFormData({ ...formData, categoryId: value });
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
      if (!validateInput()) {
        console.error("Invalid input data");
        return;
      }
      const selectedCategory = categories.find(
        category => category.name.toLowerCase() === formData.categoryId.toLowerCase()
      );
      if (selectedCategory) {
        formData.categoryId = selectedCategory.id.toString();
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
        <div>
          <label>Category:</label>
          <CategoryListbox
            value={formData.categoryId}
            onChange={(category: CategoryData) =>
              setFormData({ ...formData, categoryId: category.id.toString() })
            }
            categories={categories}
          />
          {categoryError && <div className="error-message">{categoryError}</div>}
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
