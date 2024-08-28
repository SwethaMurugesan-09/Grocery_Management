import React, { useContext, useState, useEffect } from 'react';
import './CSS/Shopcategory.css';
import { Shopcontext } from '../Context/Shopcon';
import { Link } from 'react-router-dom';

const Shopcategory = ({ category }) => {
  const { all_product, fetchProducts } = useContext(Shopcontext);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    console.log('Fetching products for category:', category);
    fetchProducts(category);  // Fetch products based on the category
  }, [category]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setVisibleCount(20); 
  };

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 8);
  };

  if (!all_product || all_product.length === 0) {
    return <div>No products found.</div>;
  }

  const filteredProducts = all_product.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
);

  console.log('Filtered Products:', filteredProducts);
  
  return (
    <div className='shop-category'>
      <input 
        type="text" 
        placeholder="Search products..." 
        value={searchQuery} 
        onChange={handleSearch} 
        className="search-input"
      />
      
      <div className="shopcategory-items">
        {filteredProducts.slice(0, visibleCount).map(product => (
          <div key={product.id} className="product-item">
            <Link to={`/product/${product.id}`}>
              <img src={product.image} alt={product.name} className="product-image" />
            </Link>
            <span className="product-name">{product.name}</span>
            <span className="product-price">${product.pricePerKg}</span>
          </div>
        ))}
      </div>

      {visibleCount < filteredProducts.length && (
        <button onClick={handleShowMore} className="show-more-button">
          Show More
        </button>
      )}
    </div>
  );
};

export default Shopcategory;
