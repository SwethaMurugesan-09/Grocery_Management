import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../Assets/logo.avif';  // Or '../Assets/logo.avif' if that's the correct folder name
import './Navbar.css';

const Navbar = () => {
  const [menu, setMenu] = useState("shop");

  return (
    <div className="navbar">
      <div className="nav">
        <img src={logo} alt="Logo" /> 
        <p>Grocery Management</p>
      </div>
      <div className="nav-menu">
        <li onClick={() => setMenu("shop")}>
          <Link to="/">Shop</Link>
          {menu === "shop" && <hr />}
        </li>
        <li onClick={() => setMenu("vegetables")}>
          <Link to="/vegetables">Vegetables</Link>
          {menu === "vegetables" && <hr />}
        </li>
        <li onClick={() => setMenu("fruits")}>
          <Link to="/fruits">Fruits</Link>
          {menu === "fruits" && <hr />}
        </li>
        <li onClick={() => setMenu("dryfruits")}>
          <Link to="/dryfruits">Dry Fruits</Link>
          {menu === "dryfruits" && <hr />}
        </li>
      </div>
      <div className="nav-cart">
        <Link to="/cart"><button>Cart</button></Link>
      </div>
      <div className="nav-login">
        {localStorage.getItem('auth-token') ? (
          <button onClick={() => { localStorage.removeItem('auth-token'); window.location.replace('/'); }}>
            Logout
          </button>
        ) : (
          <Link to="/login"><button>Login</button></Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
