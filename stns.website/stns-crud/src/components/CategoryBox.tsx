import React from "react";
import { CategoryData } from "../pages/Categories";
import "../assets/css/CategoryBox.css";

interface CategoryBoxProps {
  category: CategoryData;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({ category }) => {
  return (
    <div className="category-box">
      <h3>{category.name}</h3>
      <ul>
        {category.products.map(product => (
          <li key={product.id}>
            <strong>{product.name}</strong> - Quantity: {product.quantity}, Price: {product.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryBox;
