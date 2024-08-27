import React, { useState, useEffect, useContext } from 'react';
import './Productdisplay.css';
import { Shopcontext } from '../../Context/Shopcontext';
import { useNavigate } from 'react-router-dom';

const Productdisplay = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(Shopcontext);

  const weightOptions = [
    { label: '250 g', value: 0.25 },
    { label: '500 g', value: 0.5 },
    { label: '1 kg', value: 1 },
    { label: '2 kg', value: 2 }
  ];

  const [selectedWeight, setSelectedWeight] = useState(weightOptions[0].value);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (product) {
      setPrice(product.pricePerKg * selectedWeight * quantity);
    }
  }, [product, selectedWeight, quantity]);

  if (!product) {
    return <div>Error: Product data is missing!</div>;
  }

  const handleWeightChange = (event) => {
    const newWeight = parseFloat(event.target.value);
    setSelectedWeight(newWeight);
  };

  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    const productToAdd = {
      id: product.id,
      name: product.name,
      weight: selectedWeight,
      quantity: quantity,
      pricePerKg: product.pricePerKg,
    };

    addToCart(productToAdd);
    navigate('/cart');
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
        <div className="price">
          <h2>Price: ${price.toFixed(2)}</h2>
        </div>
        <button 
          className="add-to-cart" 
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Productdisplay;
