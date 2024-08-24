import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'
const Navbar = () => {
  const [menu,setMenu]=useState("shop")
  return (
    <div className="navbar">
    <div className='nav'>
        <img />
        <p>Grocery Management
        </p>
    </div>
    <div className="nav-menu">
        <li onClick={()=>{setMenu("shop")}}><Link to='/'>Shop</Link>{menu==="shop"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("vegetables")}}><Link to="/vegetables">Vegetables</Link>{menu==="vegetables"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("fruits")}}><Link to="/fruits">Fruits</Link>{menu==="fruits"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("dryfruits")}}><Link to="/dryfruits">Dry Fruits</Link>{menu==="dryfruits"?<hr/>:<></>}</li>
    </div>
    <div className='nav-cart'>
      <Link to="/cart"><button>Cart</button></Link>
    </div>
    <div className="nav-login">
      <Link to="/login"><button>Login</button></Link>
    </div>
    </div>
  )
}

export default Navbar