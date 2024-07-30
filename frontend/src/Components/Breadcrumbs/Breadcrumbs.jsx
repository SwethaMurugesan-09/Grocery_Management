import React from 'react'
import './Breadcrumbs.css'
import arrowicon from '../Assets/arrow.png'
const Breadcrumbs = (props) => {
    const {product}=props;
  return (
    <div className='breadcrum'>
      Home<img src={arrowicon}alt="HII"/>SHOP<img src={arrowicon} alt="Hello"/>{product.category} <img src={arrowicon} alt="Hey"/>{product.name}
      </div>
  )
}

export default Breadcrumbs