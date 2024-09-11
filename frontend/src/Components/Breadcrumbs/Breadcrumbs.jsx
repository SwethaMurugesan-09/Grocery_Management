import React from 'react';
import { Link } from 'react-router-dom'; 
import './Breadcrumbs.css';
import arrowicon from '../Assets/arrow.png';

const Breadcrumbs = ({ product }) => {
  if (!product || !product.category || !product.name) {
    return (
      <div className='breadcrum'>
        <Link to="/">Home</Link>
        <img src={arrowicon} alt="arrow" /> 
        <Link to="/shop">SHOP</Link> {/* Fallback SHOP link */}
      </div>
    );
  }

  return (
    <div className='breadcrum'>
      <Link to="/">Home</Link> 
      <img src={arrowicon} alt="arrow" /> 
      <Link to={`/shopcategory/${product.category.toLowerCase()}`}>
        {product.category}
      </Link> 
    </div>
  );
};

export default Breadcrumbs;
