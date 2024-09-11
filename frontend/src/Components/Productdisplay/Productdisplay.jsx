import React, { useState, useEffect, useContext } from 'react';
import './Productdisplay.css';
import { Shopcontext } from '../../Context/Shopcontext';

const Productdisplay = ({ product }) => {
  const { addToCart, cart, updateCartItemQuantity, removeFromCart } = useContext(Shopcontext);

  const weightOptions = [
    { label: '250 g', value: 0.25 },
    { label: '500 g', value: 0.5 },
    { label: '1 kg', value: 1 },
    { label: '2 kg', value: 2 }
  ];

  const [selectedWeight, setSelectedWeight] = useState(weightOptions[0].value);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [isInCart, setIsInCart] = useState(false); // Tracks if the product is in the cart

  // Find the product in the cart, if it exists
  const cartItem = cart.find(item => item.id === product.id && item.weight === selectedWeight);

  useEffect(() => {
    if (product) {
      setPrice(product.pricePerKg * selectedWeight * quantity);
      setIsInCart(!!cartItem); // Update isInCart if the product is found in the cart
    }
  }, [product, selectedWeight, quantity, cartItem]);

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
      image: product.image,
      name: product.name,
      weight: selectedWeight,
      quantity: quantity,
      pricePerKg: product.pricePerKg,
    };

    addToCart(productToAdd);
    setIsInCart(true);
    alert("Product added to cart successfully!");
  };

  const handleIncreaseQuantity = () => {
    if (cartItem) {
      updateCartItemQuantity(cartItem.id, cartItem.quantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (cartItem && cartItem.quantity > 1) {
      updateCartItemQuantity(cartItem.id, cartItem.quantity - 1);
    } else if (cartItem && cartItem.quantity === 1) {
      removeFromCart(cartItem.id);
      setIsInCart(false);
    }
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
        <div className="price">
          <h2>Price: ${price.toFixed(2)}</h2>
        </div>

        {isInCart ? (
          <div className="cart-controls">
            <button onClick={handleDecreaseQuantity}>-</button>
            <span>{cartItem ? cartItem.quantity : quantity}</span>
            <button onClick={handleIncreaseQuantity}>+</button>
          </div>
        ) : (
          <button 
            className="add-to-cart" 
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default Productdisplay;
