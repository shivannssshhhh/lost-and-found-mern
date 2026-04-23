import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">🔍</span>
        <span className="navbar-title">Lost & Found</span>
      </div>
      <div className="navbar-links">
        {user ? (
          <>
            <span className="navbar-user">👤 {user.name}</span>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <button onClick={handleLogout} className="btn btn-logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link btn-nav-register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
