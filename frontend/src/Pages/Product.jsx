import React, { useContext } from 'react'
import { Shopcontext } from '../Context/Shopcontext'
import { useParams } from 'react-router-dom';
import allproducts from '../Components/Assets/allproducts';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
const Product = () => {
  const {all_product}=useContext(Shopcontext);
  const {productId}=useParams();
  const product=allproducts.find((e)=> e.id===Number(productId));
  return (
    <div>
        <Breadcrumbs product={product}/>
        <
    </div>
  )
}

export default Product