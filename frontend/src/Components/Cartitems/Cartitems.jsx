import React, { useContext } from 'react';
import { Shopcontext } from '../../Context/Shopcontext';

const CartPage = () => {
  const { cart } = useContext(Shopcontext); 
  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              {item.name} - {item.quantity} x {item.weight} kg
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CartPage;
