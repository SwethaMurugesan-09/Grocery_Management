import React, { useContext } from 'react';
import './CSS/Shopcategory.css';
import { Shopcontext } from '../Context/Shopcontext';
import {Link} from 'react-router-dom'
const Shopcategory = ({ category }) => {
  const { products } = useContext(Shopcontext);
  
  if (!products) {
    return <div>Loading...</div>;
  }

  const filteredProducts = products.filter(product => product.category === category);

  return (
    <div className='shop-category'>
      <div className="shopcategory-indexSort">
        <p>
          <p></p>
        </p>
      </div>
      <div className="shopcategory-items">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-item">
              <Link to={`/product/${product.id}`}><img src={product.image} alt={product.name} className="product-image"/></Link>
            <span className="product-name">{product.name}</span>
            <span className="product-price">${product.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shopcategory;
