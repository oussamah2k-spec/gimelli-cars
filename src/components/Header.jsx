import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Assuming you have a CSS file for styling

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">BIZZINE CARS</Link>
      </div>
      <nav className="navigation">
        <Link to="/">Home</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/login">Login</Link>
        <Link to="/cars">Cars</Link>
      </nav>
    </header>
  );
};

export default Header;