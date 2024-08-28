import React, { useContext } from 'react';
import { Shopcontext } from '../Context/Shopcontext';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import Productdisplay from '../Components/Productdisplay/Productdisplay';

const Product = () => {
  const { all_product } = useContext(Shopcontext);
  const { productId } = useParams();

  if (!all_product || !Array.isArray(all_product)) {
    return <div>Error: Product data is unavailable!</div>;
  }

  const product = all_product.find((e) => e._id === productId);

  if (!product) {
    return <div>Error: Product not found!</div>;
  }

  return (
    <div>
      <Breadcrumbs product={product} />
      <Productdisplay product={product} />
    </div>
  );
};


export default Product;
