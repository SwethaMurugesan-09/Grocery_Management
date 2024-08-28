import React, { useState, useEffect } from 'react';
import './Hero.css';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(20);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div>
      <div className='hero'>
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
            {visibleProducts.map((item, index) => (
              <div key={index} className="product-item">
              <Link to={`/product/${item._id}`} state={{ product: item }}>
               <img src={item.image} alt={item.name} className="product-image" />
              </Link>

                <span className="product-name">{item.name}</span>
                <span className="product-price">${item.pricePerKg}</span>
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
      <Contact />
    </div>
  );
};

const Contact = () => {
  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append("access_key", "1952d936-2c92-4a85-a80b-8a1b5543dc4a");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: json
    }).then((res) => res.json());

    if (res.success) {
      alert(res.message);
    }
  };

  return (
    <div className="contact-section">
      <h1>Contact</h1>
      <form className="contact-form" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows="5" required></textarea>
        </div>
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default Hero;
