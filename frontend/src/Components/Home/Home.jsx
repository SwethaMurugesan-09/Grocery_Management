import React, { useState, useEffect, useContext } from 'react';
import './Home.css';
import { Link, useNavigate } from 'react-router-dom';
import { Shopcontext } from '../../Context/Shopcontext'; // Adjust the import path

const Hero = () => {
  const { addToCart, updateCartItemQuantity } = useContext(Shopcontext); // Use the context for the cart
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(20);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState({}); // Track weight selection for each product
  const [cartQuantities, setCartQuantities] = useState({}); // Track quantity for each product in cart
  const navigate = useNavigate(); // for navigation

  const weightOptions = [
    { label: '250 g', value: 0.25 },
    { label: '500 g', value: 0.5 },
    { label: '1 kg', value: 1 },
    { label: '2 kg', value: 2 }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/allproducts');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setVisibleCount(20);
  };

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 8);
  };

  const handleWeightChange = (productId, event) => {
    setSelectedWeight((prev) => ({ ...prev, [productId]: parseFloat(event.target.value) }));
  };

  // Check authentication
  const isAuthenticated = () => {
    return !!localStorage.getItem('auth-token');
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated()) {
      alert('You need to be logged in to add products to the cart.');
      navigate('/login'); // Redirect to login page
    } else {
      const weight = selectedWeight[product._id] || 1;
      const productToAdd = {
        id: product._id,
        name: product.name,
        image: product.image,
        pricePerKg: product.pricePerKg,
        weight: weight,
        quantity: 1, // Default quantity when added to cart
      };
      addToCart(productToAdd);

      // Update cart quantity for the added product
      setCartQuantities((prev) => ({ ...prev, [product._id]: 1 }));
    }
  };

  const handleIncreaseQuantity = (productId) => {
    const newQuantity = (cartQuantities[productId] || 0) + 1;
    setCartQuantities((prev) => ({
      ...prev,
      [productId]: newQuantity,
    }));
    updateCartItemQuantity(productId, newQuantity); // Update quantity in the cart context
  };

  const handleDecreaseQuantity = (productId) => {
    const newQuantity = (cartQuantities[productId] || 1) - 1;
    if (newQuantity < 1) {
      setCartQuantities((prev) => {
        const { [productId]: _, ...rest } = prev; // Remove product from local state if quantity is 0
        return rest;
      });
    } else {
      setCartQuantities((prev) => ({
        ...prev,
        [productId]: newQuantity,
      }));
    }
    updateCartItemQuantity(productId, newQuantity); // Update quantity in the cart context
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div>
      <div className="hero">
        <h2>PURCHASE YOUR FAVOURITES</h2>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-bar"
        />
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <div className="hero-item">
            {visibleProducts.map((item) => (
              <div key={item._id} className="product-item">
                  <img src={item.image} alt={item.name} className="product-image" />

                <span className="product-name">{item.name}</span>
                <div className="product-details">
                  <label htmlFor="weight">Select Weight:</label>
                  <select
                    id="weight"
                    value={selectedWeight[item._id] || 1}
                    onChange={(e) => handleWeightChange(item._id, e)}
                  >
                    {weightOptions.map((option, index) => (
                      <option key={index} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                  <span className="product-price">
                    Price: ${(item.pricePerKg * (selectedWeight[item._id] || 1)).toFixed(2)}
                  </span>

                {cartQuantities[item._id] ? (
                  <div className="quantity-controls">
                    <button onClick={() => handleDecreaseQuantity(item._id)}>-</button>
                    <span>{cartQuantities[item._id]}</span>
                    <button onClick={() => handleIncreaseQuantity(item._id)}>+</button>
                  </div>
                ) : (
                  <button 
                    className="add-to-cart" 
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        {visibleCount < filteredProducts.length && (
          <button onClick={handleShowMore} className="show-more-button">
            Show More
          </button>
        )}
      </div>
    </div>
  );
};

export default Hero;
