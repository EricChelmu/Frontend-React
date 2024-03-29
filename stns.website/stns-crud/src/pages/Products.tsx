import React, { useEffect, useState, useRef } from "react";
import productService from "../services/ProductService";
import Cookies from "js-cookie";
import "../assets/css/AllProductsPage.css";
import "../index.css";

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [updateFormData, setUpdateFormData] = useState<any>({
    id: "",
    name: "",
    quantity: "",
    price: "",
  });
  const [nameError, setNameError] = useState<string | null>(null);
  const [quantityError, setQuantityError] = useState<string | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, page]);

  useEffect(() => {
    observer.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 0.5,
    });
    if (observer.current && dropdownRef.current) {
      observer.current.observe(dropdownRef.current);
    }
    return () => {
      if (observer.current && dropdownRef.current) {
        observer.current.unobserve(dropdownRef.current);
      }
    };
  }, []);

  const fetchProducts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const token = Cookies.get("token") || "";
      const response = await productService.getAllProducts(token);
      setProducts(prevProducts => [...prevProducts, ...response]);
      setHasMore(response.length > 0);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleObserver: IntersectionObserverCallback = entries => {
    const target = entries[0];
    if (target.isIntersecting) {
      fetchProducts();
    }
  };

  const handleUpdate = async (productId: number) => {
    try {
      const token = Cookies.get("token") || "";
      const updatedProduct = { ...updateFormData, id: productId };
      await productService.updateProduct(updatedProduct, token);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      if (!id || isNaN(id)) {
        console.error("Error deleting product: Invalid product ID");
        return;
      }
      setShowConfirmation(false);
      const token = Cookies.get("token") || "";
      await productService.deleteProduct(id, token);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleEdit = (product: any) => {
    setIsDropdownOpen(!isDropdownOpen);
    setUpdateFormData({
      id: product.id,
      name: product.name,
      quantity: product.quantity,
      price: product.price,
    });
  };

  const toggleConfirmation = (productId: number | null) => {
    setShowConfirmation(!showConfirmation);
    setDeleteProductId(productId);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const validateInput = () => {
    let isValid = true;

    if (!updateFormData.name) {
      setNameError("Name is required");
      isValid = false;
    } else {
      setNameError(null);
    }

    if (
      !updateFormData.quantity ||
      isNaN(Number(updateFormData.quantity)) ||
      Number(updateFormData.quantity) < 0
    ) {
      setQuantityError("Quantity must be a positive number");
      isValid = false;
    } else {
      setQuantityError(null);
    }

    if (
      !updateFormData.price ||
      isNaN(Number(updateFormData.price)) ||
      Number(updateFormData.price) < 0
    ) {
      setPriceError("Price must be a positive number");
      isValid = false;
    } else {
      setPriceError(null);
    }

    return isValid;
  };

  const handleUpdateSubmit = async (productId: number) => {
    if (!validateInput()) {
      return;
    }

    handleUpdate(productId);
  };

  return (
    <div className="all-products">
      <h2>All Products</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by product name"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      {filteredProducts && filteredProducts.length > 0 ? (
        <ul className="product-grid">
          {filteredProducts.map(product => (
            <li key={product.id} className="product-item">
              <strong className="product-name">Name:</strong> {product.name}{" "}
              <strong>Quantity:</strong> {product.quantity}
              <strong>Price:</strong> {product.price} <strong>Category:</strong> {product.category}
              <div className="edit-dropdown" ref={dropdownRef}>
                <button className="button" onClick={() => handleEdit(product)}>
                  Edit
                </button>
                {isDropdownOpen && (
                  <div className="dropdown-content">
                    <label htmlFor={`name-${product.id}`}>Name:</label>
                    <input
                      type="text"
                      placeholder={`Name: ${product.name}`}
                      value={updateFormData.name}
                      onChange={e => setUpdateFormData({ ...updateFormData, name: e.target.value })}
                    />
                    {nameError && <div className="error-message">{nameError}</div>}
                    <label htmlFor={`quantity-${product.id}`}>Quantity:</label>
                    <input
                      type="number"
                      placeholder={`Quantity: ${product.quantity}`}
                      value={updateFormData.quantity}
                      onChange={e =>
                        setUpdateFormData({ ...updateFormData, quantity: e.target.value })
                      }
                    />
                    {quantityError && <div className="error-message">{quantityError}</div>}
                    <label htmlFor={`price-${product.id}`}>Price:</label>
                    <input
                      type="number"
                      placeholder={`Price: ${product.price}`}
                      value={updateFormData.price}
                      onChange={e =>
                        setUpdateFormData({ ...updateFormData, price: e.target.value })
                      }
                    />
                    {priceError && <div className="error-message">{priceError}</div>}
                    <div className="button-group">
                      <button className="button" onClick={() => handleUpdateSubmit(product.id)}>
                        Update
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => toggleConfirmation(product.id)}
                      >
                        Delete
                      </button>
                    </div>
                    {showConfirmation && deleteProductId === product.id && (
                      <div className="confirmation-dialog">
                        <p>Are you sure you want to delete this item?</p>
                        <button className="button" onClick={() => handleDelete(product.id)}>
                          Yes
                        </button>
                        <button className="delete-button" onClick={() => toggleConfirmation(null)}>
                          No
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default ProductsPage;
