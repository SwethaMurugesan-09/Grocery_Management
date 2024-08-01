// Shopcon.jsx
import React, { createContext, useState } from 'react';
import allproducts from '../Components/Assets/allproducts';

// Create the context
export const Shopcontext = createContext();

// Define the provider component
const ShopProvider = ({ children }) => {
  const [products] = useState(allproducts);

  return (
    <Shopcontext.Provider value={{ products }}>
      {children}
    </Shopcontext.Provider>
  );
};

// Export the provider
export default ShopProvider;
