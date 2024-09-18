import React, { createContext, useState, useEffect } from 'react';

export const Shopcontext = createContext();

const ShopProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage if available
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const [all_product, setAllProduct] = useState([]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const itemInCart = prevCart.find(cartItem => cartItem.id === item.id);

      if (itemInCart) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });

    // Async operation for server update
    if (localStorage.getItem('auth-token')) {
      const addToCartOnServer = async () => {
        const response = await fetch('http://localhost:5000/addtocart', {
          method: 'POST',
          headers: {
            'auth-token': localStorage.getItem('auth-token'),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ itemId: item.id }),
        });

        const data = await response.json();
        if (data) {
          console.log('Cart updated on the server:', data);

          // Optionally refetch the cart
          const cartResponse = await fetch('http://localhost:5000/getcart', {
            headers: {
              'auth-token': localStorage.getItem('auth-token'),
            },
          });
          const updatedCart = await cartResponse.json();
          setCart(updatedCart.cartData);
        }
      };

      addToCartOnServer().catch((err) =>
        console.error('Error adding to cart on the server:', err)
      );
    }
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

    if (localStorage.getItem('auth-token')) {
      fetch('http://localhost:5000/removefromcart', {
        method: 'POST',
        headers: {
          'auth-token': localStorage.getItem('auth-token'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
    }
  };

  // Fetch products from backend
  const fetchProducts = async (category) => {
    try {
      const url = category
        ? `http://localhost:5000/allproducts?category=${category}`
        : `http://localhost:5000/allproducts`;
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
