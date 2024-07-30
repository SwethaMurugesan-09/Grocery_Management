import React, { createContext, useState } from 'react';
import allproducts from '../Components/Assets/allproducts';

export const Shopcontext = createContext();

const ShopProvider = ({ children }) => {
  const [products] = useState(allproducts);

  return (
    <Shopcontext.Provider value={{ products }}>
      {children}
    </Shopcontext.Provider>
  );
};

export default ShopProvider;