import React, { createContext, useState, useEffect } from 'react';

export const Shopcontext = createContext();

const ShopProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [all_product, setAllProduct] = useState([]);

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

  const fetchProducts = async (category) => {
    try {
      const url = category ? `http://localhost:5000/allproducts?category=${category}` : `http://localhost:5000/allproducts`;
      const response = await fetch(url);
      const data = await response.json();
      console.log('Fetched Products:', data); // Check the structure here
      setAllProduct(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <Shopcontext.Provider
      value={{
        cart,
        addToCart,
        updateCartItemWeight,
        updateCartItemQuantity,
        removeFromCart,
        all_product,
        fetchProducts,  // Include fetchProducts in the context value
      }}
    >
      {children}
    </Shopcontext.Provider>
  );
};

export default ShopProvider;
