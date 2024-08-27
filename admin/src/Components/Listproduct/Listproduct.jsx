import React, { useEffect, useState } from 'react';
import './Listproduct.css';
import crossicon from '../../assets/crossicon.svg';

const Listproduct = () => {
  const [allProducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    try {
      const response = await fetch('http://localhost:5000/allproducts');
      const data = await response.json();
      setAllProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const removeProduct = async (id) => {
    try {
      await fetch('http://localhost:5000/removeproduct', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
      });
      await fetchInfo();  // Refresh the product list after deletion
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  return (
    <div className='listproduct'>
      <h1>All Products List</h1>
      <div className="listproduct-format">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allProducts.map((product, index) => (
          <React.Fragment key={index}>
            <div className="listproduct-format-main">
              <img src={product.image} alt={product.name} className='listproduct-img' />
              <p>{product.name}</p>
              <p>${product.pricePerKg}</p>
              <p>{product.category}</p>
              <img 
                onClick={() => removeProduct(product.id)} 
                className="listproduct-icon" 
                src={crossicon} 
                alt="Remove product" 
              />
            </div>
            <hr />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Listproduct;
