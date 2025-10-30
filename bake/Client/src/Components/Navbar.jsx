import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SunIcon , MoonIcon } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import { useContext } from 'react';
import '../Styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useUser();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Single icon for theme, click to toggle
  const ThemeIcon = theme === 'light' 
    ? <SunIcon onClick={toggleTheme} className="theme-icon" size={24} /> 
    : <MoonIcon onClick={toggleTheme} className="theme-icon" size={24} />;

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120 }}
    >
      <motion.div
        className="navbar-logo"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Link to="/">Happy Bakes</Link>
      </motion.div>
      <div className="navbar-links">
        {!isAuthPage && (
          <>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link to="/Home">Home</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link to="/products">Products</Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              {ThemeIcon}
            </motion.div>
          </>
        )}
        {user && !isAuthPage ? (
          <>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link to="/UserOrder">Order</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <span className="user-welcome">Welcome, {user.name}</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </motion.div>
          </>
        ) : !isAuthPage && (
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link to="/login">Login</Link>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;