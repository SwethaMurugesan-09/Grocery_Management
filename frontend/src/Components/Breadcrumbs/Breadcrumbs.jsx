import React from 'react';
import './Breadcrumbs.css';
import arrowicon from '../Assets/arrow.png';

const Breadcrumbs = ({ product }) => {
  // Ensure the product and its properties are defined
  if (!product || !product.category || !product.name) {
    return (
      <div className='breadcrum'>
        Home <img src={arrowicon} alt="arrow" /> SHOP
      </div>
    );
  }

  return (
    <div className='breadcrum'>
      Home <img src={arrowicon} alt="arrow" /> 
      SHOP <img src={arrowicon} alt="arrow" /> 
      {product.category} <img src={arrowicon} alt="arrow" /> 
      {product.name}
    </div>
  );
};

export default Breadcrumbs;
