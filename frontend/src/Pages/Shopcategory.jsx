import React, { useContext, useState } from 'react';
import './CSS/Shopcategory.css';
import { Shopcontext } from '../Context/Shopcon';
import { Link } from 'react-router-dom';

const Shopcategory = ({ category }) => {
  const { products } = useContext(Shopcontext);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(20);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setVisibleCount(20); 
  };

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 8);
  };

  if (!products) {
    return <div>Loading...</div>;
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter(product => category === 'all' || product.category === category);

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
