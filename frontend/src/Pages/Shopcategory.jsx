import React, { useContext, useState, useEffect } from 'react';
import './CSS/Shopcategory.css';
import { Shopcontext } from '../Context/Shopcontext'; // Adjust the import path
import { Link, useNavigate } from 'react-router-dom';

const Shopcategory = ({ category }) => {
  const { all_product, fetchProducts, addToCart, updateCartItemQuantity } = useContext(Shopcontext);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(20);
  const [selectedWeight, setSelectedWeight] = useState({});
  const [cartQuantities, setCartQuantities] = useState({});
  const navigate = useNavigate(); // Use navigation for redirecting

  const weightOptions = [
    { label: '250 g', value: 0.25 },
    { label: '500 g', value: 0.5 },
    { label: '1 kg', value: 1 },
    { label: '2 kg', value: 2 }
  ];

  useEffect(() => {
    fetchProducts(category);
  }, [category]);

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

  const handleAddToCart = (product) => {
    const authToken = localStorage.getItem('auth-token');
    
    if (!authToken) {
      alert('You need to be logged in to add products to the cart.');
      navigate('/login');
      return;
    }

    const weight = selectedWeight[product._id] || 1;
    const productToAdd = {
      id: product._id,
      name: product.name,
      image: product.image,
      pricePerKg: product.pricePerKg,
      weight: weight,
      quantity: 1,
    };
    addToCart(productToAdd);

    // Update cart quantity for the added product
    setCartQuantities((prev) => ({ ...prev, [product._id]: 1 }));
  };

  const handleIncreaseQuantity = (productId) => {
    const newQuantity = (cartQuantities[productId] || 0) + 1;
    setCartQuantities((prev) => ({
      ...prev,
      [productId]: newQuantity,
    }));
    updateCartItemQuantity(productId, newQuantity);
  };

  const handleDecreaseQuantity = (productId) => {
    const newQuantity = (cartQuantities[productId] || 1) - 1;
    if (newQuantity < 1) {
      setCartQuantities((prev) => {
        const { [productId]: _, ...rest } = prev;
        return rest;
      });
    } else {
      setCartQuantities((prev) => ({
        ...prev,
        [productId]: newQuantity,
      }));
    }
    updateCartItemQuantity(productId, newQuantity);
  };

  if (!all_product || all_product.length === 0) {
    return <div>No products found.</div>;
  }

  const filteredProducts = all_product.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="shop-category">
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-input"
      />

      <div className="shopcategory-items">
        {filteredProducts.slice(0, visibleCount).map(product => (
          <div key={product._id} className="product-item">
              <img src={product.image} alt={product.name} className="product-image" />

            <span className="product-name">{product.name}</span>
            <div className="product-details">
              <label htmlFor="weight">Select Weight:</label>
              <select
                id="weight"
                value={selectedWeight[product._id] || 1}
                onChange={(e) => handleWeightChange(product._id, e)}
              >
                {weightOptions.map((option, index) => (
                  <option key={index} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
                <div>Price:<span className="product-price">${(product.pricePerKg * (selectedWeight[product._id] || 1)).toFixed(2)}</span></div>
            {cartQuantities[product._id] ? (
              <div className="quantity-controls">
                <button onClick={() => handleDecreaseQuantity(product._id)}>-</button>
                <span>{cartQuantities[product._id]}</span>
                <button onClick={() => handleIncreaseQuantity(product._id)}>+</button>
              </div>
            ) : (
              <button
                className="add-to-cart"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            )}
          </div>
        ))}
      </div>

      {visibleCount < filteredProducts.length && (
        <button onClick={handleShowMore} className="show-more-button">Show More</button>
      )}
    </div>
  );
};

export default Shopcategory;
