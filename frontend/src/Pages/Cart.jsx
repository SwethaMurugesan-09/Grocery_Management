// CartPage.jsx
import React, { useContext } from 'react';
import { Shopcontext } from '../Context/Shopcontext';
import './CSS/Cart.css';
const CartPage = () => {
  const {
    cart,
    updateCartItemWeight,
    updateCartItemQuantity,
    removeFromCart,
  } = useContext(Shopcontext);

  const weightOptions = [
    { label: '250 g', value: 0.25 },
    { label: '500 g', value: 0.5 },
    { label: '1 kg', value: 1 },
    { label: '2 kg', value: 2 },
  ];

  const handleWeightChange = (itemId, event) => {
    const newWeight = parseFloat(event.target.value);
    updateCartItemWeight(itemId, newWeight);
  };

  const handleQuantityChange = (itemId, event) => {
    const newQuantity = parseInt(event.target.value, 10);
    updateCartItemQuantity(itemId, newQuantity);
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
  };

  const calculatePrice = (item) => {
    const pricePerKg = item.pricePerKg || 0;
    const price = item.weight * item.quantity * pricePerKg;
    return isNaN(price) ? 0 : price;
  };

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              <div>
                <span>{item.name}</span>
                <select
                  value={item.weight}
                  onChange={(e) => handleWeightChange(item.id, e)}
                >
                  {weightOptions.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) => handleQuantityChange(item.id, e)}
                />
                <span>
                  Price: $
                  {calculatePrice(item).toFixed(2)}
                </span>
                <button onClick={() => handleRemoveFromCart(item.id)}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CartPage;
