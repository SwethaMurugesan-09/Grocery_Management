import React, { useEffect, useState } from 'react';
import './Listproduct.css';

const Listproduct = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null); // Track which product is being edited
  const [editProductDetails, setEditProductDetails] = useState({}); // Handle inline edit state
  const [searchTerm, setSearchTerm] = useState(''); // Track search term

  const fetchInfo = async () => {
    try {
      const response = await fetch('http://localhost:5000/allproducts');
      const data = await response.json();
      setAllProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const removeProduct = async (id) => {
    try {
      await fetch('http://localhost:5000/removeproduct', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      await fetchInfo(); // Refresh the product list after deletion
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  const updateProduct = async (productId) => {
    try {
      const productDetails = editProductDetails[productId]; // Extract product details for the specific product ID

      // Ensure required fields are present
      const updatedProductData = {
        id: productId, // Use MongoDB's _id field
        name: productDetails.name,
        pricePerKg: productDetails.pricePerKg,
        category: productDetails.category || 'defaultCategory', // Add a default category if not provided
      };

      // Make the API call
      await fetch('http://localhost:5000/updateproduct', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProductData), // Send updated product data
      });

      // Refresh the product list after update
      await fetchInfo();

      // Clear editing state after updating
      setEditingProductId(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleEditChange = (e, productId) => {
    const { name, value } = e.target;
    setEditProductDetails((prevDetails) => ({
      ...prevDetails,
      [productId]: {
        ...prevDetails[productId],
        [name]: value,
      },
    }));
  };

  const startEditing = (productId, product) => {
    setEditingProductId(productId);
    setEditProductDetails((prevDetails) => ({
      ...prevDetails,
      [productId]: product,
    }));
  };

  // Filter the products based on the search term
  const filteredProducts = allProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="listproduct">
      <div className="search-container">
        <input
          type="text"
          placeholder="search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update the search term state
          className="search-input"
        />
      </div>

      <div className="listproduct-format">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Category</p>
        <p>Update</p>
        <p>Remove</p>
      </div>

      <div className="listproduct-allproducts">
        <hr />
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <React.Fragment key={index}>
              <div className="listproduct-format-main">
                <img
                  src={product.image}
                  alt={product.name}
                  className="listproduct-img"
                />
                {editingProductId === product._id ? (
                  <>
                    <input
                      type="text"
                      name="name"
                      value={editProductDetails[product._id]?.name || ''} // Always use state during editing
                      onChange={(e) => handleEditChange(e, product._id)}
                    />
                    <input
                      type="text"
                      name="pricePerKg"
                      value={editProductDetails[product._id]?.pricePerKg || ''} // Always use state during editing
                      onChange={(e) => handleEditChange(e, product._id)}
                    />
                    <select
                      name="category"
                      value={
                        editProductDetails[product._id]?.category ||
                        'defaultCategory'
                      } // Always use state during editing
                      onChange={(e) => handleEditChange(e, product._id)}
                    >
                      <option value="vegetables">Vegetables</option>
                      <option value="fruits">Fruits</option>
                      <option value="dryfruits">Dryfruits</option>
                    </select>
                    <button
                      onClick={() => updateProduct(product._id)}
                      className="listproduct-btn"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <p>{product.name}</p>
                    <p>${product.pricePerKg}</p>
                    <p>{product.category}</p>

                    {/* Edit button */}
                    <button
                      onClick={() => startEditing(product._id, product)}
                      className="listproduct-btn"
                    >
                      Edit
                    </button>
                  </>
                )}

                {/* Remove button */}
                <button
                  onClick={() => removeProduct(product._id)}
                  className="listproduct-btn"
                >
                  Remove
                </button>
              </div>
              <hr />
            </React.Fragment>
          ))
        ) : (
          <p>No products found</p> // Display this when no product matches the search term
        )}
      </div>
    </div>
  );
};

export default Listproduct;
