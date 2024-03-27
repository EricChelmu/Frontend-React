import React, { useState } from "react";
import categoryService from "../services/CategoryService";
import Cookies from "js-cookie";
import "../assets/css/NewCategory.css";

interface ProductData {
  name: string;
  quantity: number;
  price: number;
}

interface CategoryData {
  name: string;
  products: ProductData[];
}

const NewCategory: React.FC = () => {
  const initialCategoryData: CategoryData = {
    name: "",
    products: [{ name: "", quantity: 0, price: 0 }],
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

  const handleProductInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    field: keyof ProductData
  ) => {
    const { value } = e.target;

    if (field === "quantity" && parseFloat(value) < 0) {
      console.error("Quantity cannot be negative");
      return;
    }

    if (field === "price" && parseFloat(value) < 0) {
      console.error("Price cannot be negative");
      return;
    }

    setCategoryData(prevData => {
      const updatedProducts = [...prevData.products];
      (updatedProducts[index] as any)[field] = value;
      return { ...prevData, products: updatedProducts };
    });
  };

  const handleAddProduct = () => {
    setCategoryData(prevData => ({
      ...prevData,
      products: [...prevData.products, { name: "", quantity: 0, price: 0 }],
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCategoryError(null);
    try {
      const token = Cookies.get("token") || "";

      const categoryDataWithProducts = {
        category: {
          name: categoryData.name,
          products: categoryData.products.map(product => ({
            name: product.name,
            quantity: product.quantity,
            price: product.price,
          })),
        },
      };

      await categoryService.postCategory(categoryDataWithProducts, token);

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
        {/* Form fields for category data */}
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

        {/* Form fields for product data */}
        <div className="product-container">
          {categoryData.products.map((product, index) => (
            <div className="product-input" key={index}>
              <label>Product Name:</label>
              <input
                type="text"
                name={`products[${index}].name`}
                value={product.name}
                onChange={e => handleProductInputChange(e, index, "name")}
              />

              <label>Quantity:</label>
              <input
                type="number"
                name={`products[${index}].quantity`}
                value={product.quantity}
                onChange={e => handleProductInputChange(e, index, "quantity")}
              />

              <label>Price:</label>
              <input
                type="number"
                name={`products[${index}].price`}
                value={product.price}
                onChange={e => handleProductInputChange(e, index, "price")}
              />
            </div>
          ))}
        </div>
        {categoryError && <div className="error-message">{categoryError}</div>}

        <div className="button-group">
          <button className="button" type="button" onClick={handleAddProduct}>
            Add Product
          </button>

          <button className="button" type="submit">
            Submit Category
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewCategory;
