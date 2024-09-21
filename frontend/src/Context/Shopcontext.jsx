
import React, { createContext, useState, useEffect } from 'react';

export const Shopcontext = createContext();

const ShopProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [all_product, setAllProduct] = useState([]);
  const addToCart = (item) => {
    setCart((prevCart) => {
      // Check if the item is already in the cart
      const itemInCart = prevCart.find(cartItem => cartItem.id === item.id);
  
      if (itemInCart) {
        // If item exists in the cart, update its quantity
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // If item doesn't exist, add it to the cart with an initial quantity of 1
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
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
      console.log('Fetched Products:', data);
      setAllProduct(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts(); 
  }, []);

  return (
    <Shopcontext.Provider
      value={{
        cart,
        addToCart,
        updateCartItemWeight,
        updateCartItemQuantity,
        removeFromCart,
        all_product,
        fetchProducts,  
      }}
    >
      {children}
    </Shopcontext.Provider>
  );
};

export default ShopProvider;
