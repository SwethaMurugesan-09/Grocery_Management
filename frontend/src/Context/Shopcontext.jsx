

import React, { createContext, useState } from 'react';

export const Shopcontext = createContext();

export const ShopProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prevCart) => {
 
      const existingProductIndex = prevCart.findIndex(item => item.id === product.id);

      if (existingProductIndex !== -1) {

        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += product.quantity; // Adjust as needed for weight and quantity
        return updatedCart;
      }


      return [...prevCart, { ...product, quantity: product.quantity }];
    });
  };

  return (
    <Shopcontext.Provider value={{ cart, addToCart }}>
      {children}
    </Shopcontext.Provider>
  );
};
export default ShopProvider