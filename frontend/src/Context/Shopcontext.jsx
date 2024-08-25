import React, { createContext, useState } from 'react';

export const Shopcontext = createContext();

const ShopProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const updateCartItemWeight = (itemId, newWeight) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, weight: newWeight } : item
      )
    );
  };

  const updateCartItemQuantity = (itemId, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  return (
    <Shopcontext.Provider
      value={{
        cart,
        addToCart,
        updateCartItemWeight,
        updateCartItemQuantity,
        removeFromCart,
      }}
    >
      {children}
    </Shopcontext.Provider>
  );
};

export default ShopProvider;
