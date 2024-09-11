import React, { useContext, useState, useEffect } from 'react';
import './CSS/Shopcategory.css';
import { Shopcontext } from '../Context/Shopcontext'; // Adjust the import path
import { Link } from 'react-router-dom';

const Shopcategory = ({ category }) => {
  const { all_product, fetchProducts, addToCart } = useContext(Shopcontext);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(20);
  const [selectedWeight, setSelectedWeight] = useState({});

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
    alert(`${product.name} added to cart!`);
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
            <Link to={`/product/${product._id}`}>
              <img src={product.image} alt={product.name} className="product-image" />
            </Link>
            <span className="product-name">{product.name}</span>
            <span className="product-price">${(product.pricePerKg * (selectedWeight[product._id] || 1)).toFixed(2)}</span>

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
            <button
              className="add-to-cart"
              onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </button>
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
