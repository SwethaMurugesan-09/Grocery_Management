import React, { useState, useEffect, useContext } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import { Shopcontext } from '../../Context/Shopcontext'; // Adjust the import path

const Hero = () => {
  const { addToCart } = useContext(Shopcontext); // Use the context for the cart
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(20);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState({}); // Track weight selection for each product
  const [quantity, setQuantity] = useState({}); // Track quantity for each product

  const weightOptions = [
    { label: '250 g', value: 0.25 },
    { label: '500 g', value: 0.5 },
    { label: '1 kg', value: 1 },
    { label: '2 kg', value: 2 }
  ];

  // Fetch products from the backend API
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
                <Link to={`/product/${item._id}`} state={{ product: item }}>
                  <img src={item.image} alt={item.name} className="product-image" />
                </Link>

                <span className="product-name">{item.name}</span>
                <span className="product-price">${(item.pricePerKg * (selectedWeight[item._id] || 1)).toFixed(2)}</span>

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
                
                <button
                  className="add-to-cart"
                  onClick={() => handleAddToCart(item)}
                >
                  Add to Cart
                </button>
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
