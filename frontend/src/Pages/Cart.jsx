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
    const confirmed = window.confirm("Are you sure you want to remove this product from the cart?");
    if (confirmed) {
      removeFromCart(itemId);
    }
  };

  const calculatePrice = (item) => {
    const pricePerKg = item.pricePerKg || 0;
    const price = item.weight * item.quantity * pricePerKg;
    return isNaN(price) ? 0 : price;
  };

  const calculateSubtotal = () => {
    return cart.reduce((acc, item) => acc + calculatePrice(item), 0).toFixed(2);
  };

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-pages">
            {cart.map((item) => (
              <li key={item.id}>
                <div className="cart-image">
                  <img src={item.image} alt={item.name} />
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
                    Price: ${calculatePrice(item).toFixed(2)}
                  </span>
                  <button onClick={() => handleRemoveFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="cartitems-down">
            <div className="cartitems-total">
              <h1>Cart total</h1>
              <div>
                <div className="cartitems-total-item">
                  <p>Subtotal</p>
                  <p>${calculateSubtotal()}</p>
                </div>
                <hr />
                <div className="cartitems-total-item">
                  <p>Shipping Fee</p>
                  <p>Free</p>
                </div>
                <hr />
                <div className="cartitems-total-item">
                  <h3>Total</h3>
                  <h3>${calculateSubtotal()}</h3>
                </div>
              </div>
              <button>PROCEED TO CHECKOUT</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
