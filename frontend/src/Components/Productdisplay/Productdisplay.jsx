import React, { useState, useContext } from 'react';
import './Productdisplay.css';
import { Shopcontext } from '../../Context/Shopcontext';

const Productdisplay = (props) => {
  const { product } = props;
  const { addToCart } = useContext(Shopcontext);
  const weightOptions = [
    { label: '250 g', value: 0.25 },
    { label: '500 g', value: 0.5 },
    { label: '1 kg', value: 1 },
    { label: '2 kg', value: 2 }
  ];

  const [selectedWeight, setSelectedWeight] = useState(weightOptions[0].value);
  const [quantity, setQuantity] = useState(1);

  const handleWeightChange = (event) => {
    setSelectedWeight(parseFloat(event.target.value));
  };

  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value, 10));
  };

  return (
    <div className='productdisplay'>
      <div className="productdisplay-left">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="product-details">
          <label htmlFor="weight">Select Weight:</label>
          <select id="weight" value={selectedWeight} onChange={handleWeightChange}>
            {weightOptions.map((option, index) => (
              <option key={index} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div className="quantity">
          <label htmlFor="quantity">Quantity:</label>
          <input 
            type="number" 
            id="quantity" 
            value={quantity} 
            min="1" 
            onChange={handleQuantityChange} 
          />
        </div>
        <button 
          className="add-to-cart" 
          onClick={() => addToCart(product.id)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Productdisplay;
