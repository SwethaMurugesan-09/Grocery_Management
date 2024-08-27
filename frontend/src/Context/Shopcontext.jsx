import React, { createContext, useState, useEffect } from 'react';

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

  const [all_product, setAllProduct] = useState([]);

  // Fetch products and update the state
  useEffect(() => {
    fetch('http://localhost:5000/allproducts')
      .then(response => response.json())
      .then(data => setAllProduct(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

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
        all_product, // Include all_product in the context value
      }}
    >
      {children}
    </Shopcontext.Provider>
  );
};

export default ShopProvider;
