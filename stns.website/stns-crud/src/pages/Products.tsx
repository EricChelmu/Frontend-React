import React, { useEffect, useState, useRef } from "react";
import productService from "../services/ProductService";
import { getToken } from "../utils/AuthUtils";
import "../assets/css/AllProductsPage.css";
import "../index.css";
import placeholderImage from "../assets/images/placeholderImage.jpg";

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  interface UpdateFormData {
    id: string;
    name: string;
    quantity: string;
    price: string;
  }

  useEffect(() => {
    fetchProducts();
  }, [currentPage, pageSize]);

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

  useEffect(() => {
    function handleScroll() {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
          document.documentElement.offsetHeight ||
        loading
      )
        return;
      loadMore();
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  const loadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await productService.getPaginatedProducts(token, currentPage, pageSize);

      if (currentPage === 1) {
        setProducts([]);
      }

      const uniqueProducts = response.content.filter((newProduct: any) => {
        return !products.some((existingProduct: any) => existingProduct.id === newProduct.id);
      });

      setProducts(prevProducts => [...prevProducts, ...uniqueProducts]);
      setTotalPages(response.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query.trim() === "") {
      fetchProducts();
    } else {
      fetchSearchResults(query);
    }
  };

  const fetchSearchResults = async (query: string) => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await productService.searchProducts(token, query);

      setProducts(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handlePaginationAndSearch = (page: number) => {
    setCurrentPage(page);
    if (searchQuery) {
      fetchSearchResults(searchQuery);
    } else {
      fetchProducts();
    }
  };

  const loadPrevious = () => {
    if (currentPage > 1) {
      handlePaginationAndSearch(currentPage - 1);
    }
  };

  const loadNext = () => {
    if (currentPage < totalPages) {
      handlePaginationAndSearch(currentPage + 1);
    }
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleDelete = async (id: number) => {
    try {
      if (!id || isNaN(id)) {
        console.error("Error deleting product: Invalid product ID");
        return;
      }
      setShowConfirmation(false);
      const token = getToken();
      await productService.deleteProduct(id, token);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = (product: any) => {
    setIsDropdownOpen(!isDropdownOpen);
    setUpdateFormData((prevFormData: UpdateFormData) => ({
      ...prevFormData,
      id: product.id,
      name: product.name,
      quantity: product.quantity,
      price: product.price,
    }));
  };

  const toggleConfirmation = (productId: number | null) => {
    setShowConfirmation(!showConfirmation);
    setDeleteProductId(productId);
  };

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

    try {
      const token = getToken();
      const updatedProduct = { ...updateFormData, id: productId };
      await productService.updateProduct(updatedProduct, token);
      fetchProducts();
      setUpdateFormData({
        id: "",
        name: "",
        quantity: "",
        price: "",
      });
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const getImagePath = (imageName: string) => {
    return `src/assets/images/${imageName}`;
  };

  return (
    <div className="all-products">
      <h2>All Products</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={handleSearchChange}
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
      {products && products.length > 0 ? (
        <React.Fragment>
          <ul className="product-grid">
            {products.map(product => (
              <li key={product.id} className="product-item">
                {console.log(
                  "Image Path:",
                  `../assets/images/${product.imagePath.split("\\").pop()}`
                )}
                {product.imagePath ? (
                  <img
                    src={getImagePath(product.imagePath.split("\\").pop() || "")}
                    alt={product.name}
                    className="product-image"
                  />
                ) : (
                  <img src={placeholderImage} alt="Placeholder" className="placeholder-image" />
                )}
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
