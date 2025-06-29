import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from './logo.png';
import './Header.css';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.navbar')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-logo">
        <Link to="/" aria-label="Home">
          <img src={logo} alt="MedVision Logo" />
        </Link>
      </div>
      <button
        className="navbar-toggle"
        aria-label="Toggle navigation"
        aria-expanded={isMenuOpen}
        onClick={toggleMenu}
      >
        <span className="navbar-toggle-icon"></span>
      </button>
      <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
        <li>
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
        </li>
        <li>
          <Link 
            to="/employee" 
            className={`nav-link ${isActive('/employee') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Post Detail
          </Link>
        </li>
        <li>
          <Link 
            to="/AskGemini" 
            className={`nav-link ${isActive('/AskGemini') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Doctor AI
          </Link>
        </li>
        <li>
          <Link 
            to="/Simulator" 
            className={`nav-link ${isActive('/Simulator') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Simulate
          </Link>
        </li>
        <li>
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Patient
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Header;