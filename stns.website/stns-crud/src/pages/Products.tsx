import React, { useEffect, useState, useRef } from "react";
import productService from "../services/ProductService";
import Cookies from "js-cookie";
import "../assets/css/AllProductsPage.css";
import "../index.css";

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [updateFormData, setUpdateFormData] = useState<any>({
    id: "",
    name: "",
    quantity: "",
    price: "",
  });
  const [nameError, setNameError] = useState<string | null>(null);
  const [quantityError, setQuantityError] = useState<string | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, pageSize, searchQuery]);

  useEffect(() => {
    setUpdateFormData({
      id: "",
      name: "",
      quantity: "",
      price: "",
    });
  }, [products]);

  useEffect(() => {
    return () => {
      setUpdateFormData({
        id: "",
        name: "",
        quantity: "",
        price: "",
      });
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const token = Cookies.get("token") || "";
      const response = await productService.getPaginatedProducts(token, currentPage, pageSize);

      setProducts(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const loadPrevious = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const loadNext = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
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
      <div className="page-size-selector">
        <label htmlFor="pageSize">Products per page:</label>
        <select id="pageSize" value={pageSize} onChange={handlePageSizeChange}>
          <option value="5">5</option>
          <option value="12">12</option>
          <option value="24">24</option>
          <option value="35">35</option>
          <option value="48">48</option>
        </select>
      </div>
      {filteredProducts && filteredProducts.length > 0 ? (
        <React.Fragment>
          <ul className="product-grid">
            {filteredProducts.map(product => (
              <li key={product.id} className="product-item">
                <strong className="product-name">Name:</strong> {product.name}{" "}
                <strong>Quantity:</strong> {product.quantity}
                <strong>Price:</strong> {product.price} <strong>Category:</strong>{" "}
                {product.category}
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
                        onChange={e =>
                          setUpdateFormData({ ...updateFormData, name: e.target.value })
                        }
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
                          <button
                            className="delete-button"
                            onClick={() => toggleConfirmation(null)}
                          >
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
          <div className="pagination">
            <button className="button" onClick={loadPrevious} disabled={currentPage === 1}>
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button className="button" onClick={loadNext} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </React.Fragment>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default ProductsPage;
