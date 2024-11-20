import React from 'react';
import { Link } from 'react-router-dom';
//import './Navbar.css'; // Import the CSS file

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">PathGen</Link>
      </div>
      <div className="navbar-right">
        {/* Dropdown for Categories */}
        <div className="dropdown">
          <button className="dropbtn">Categories</button>
          <div className="dropdown-content">
            <Link to="/web-development">Web Development</Link>
            <Link to="/programming">Programming</Link>
            <Link to="/database-languages">Database Languages</Link>
          </div>
        </div>

        {/* Login and Signup Links */}
        <Link to="/login" className="navbar-link">Login</Link>
        <Link to="/signup" className="navbar-link">Signup</Link>

        {/* Profile Icon */}
        {/* <img src="profile-user.png" alt="Profile" className="profile-icon" /> */}
      </div>
    </nav>
  );
};

export default Navbar;
