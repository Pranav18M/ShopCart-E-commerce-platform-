import logo from "../../assets/images/logo2.png";
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiShoppingCart, FiUser, FiSearch, FiChevronDown, FiLogOut, FiPackage, FiSettings, FiBarChart2, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { logout } from '../../store/slices/authSlice';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, isAuthenticated, isSeller, isAdmin } = useAuth();
  const { count } = useCart();
  const [search, setSearch] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [location]);

  const CATEGORY_NAMES = [
    'Electronics', 'Fashion', 'Home & Furniture', 'Books',
    'Sports & Fitness', 'Toys & Games', 'Beauty & Personal Care',
    'Grocery', 'Mobiles', 'Appliances'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const term = search.trim();
    if (!term) return;

    // Check if search term exactly matches a category name (case-insensitive)
    const matchedCategory = CATEGORY_NAMES.find(
      cat => cat.toLowerCase() === term.toLowerCase()
    );

    if (matchedCategory) {
      navigate(`/products?category=${encodeURIComponent(matchedCategory)}`);
    } else {
      navigate(`/products?search=${encodeURIComponent(term)}`);
    }
    setSearch('');
  };

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
  <div className="logo-container">
    <img
      src={logo}
      alt="Shopix Logo"
      className="logo-img"
    />

    <div className="logo-text-wrap">
      <span className="logo-text">
        Shop<span className="logo-accent">ix</span>
      </span>
      <span className="logo-tag">Explore More</span>
    </div>
  </div>
</Link>

        {/* Search Bar */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="search-btn">
            <FiSearch size={18} />
          </button>
        </form>

        {/* Desktop Nav Items */}
        <div className="navbar-actions">
          {/* User Menu */}
          <div className="nav-item user-menu-wrapper" ref={userMenuRef}>
            <button className="nav-btn" onClick={() => setUserMenuOpen(!userMenuOpen)}>
              <FiUser size={18} />
              <span className="nav-label">
                {isAuthenticated ? (user?.name?.split(' ')[0] || 'Account') : 'Login'}
              </span>
              <FiChevronDown size={14} className={`chevron ${userMenuOpen ? 'open' : ''}`} />
            </button>

            {userMenuOpen && (
              <div className="user-dropdown">
                {!isAuthenticated ? (
                  <>
                    <div className="dropdown-header">
                      <p>New customer?</p>
                      <Link to="/register" className="dropdown-signup">Sign Up</Link>
                    </div>
                    <div className="dropdown-divider" />
                    <Link to="/login" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <FiUser size={16} /> Login
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="dropdown-header">
                      <p className="dropdown-name">{user?.name}</p>
                      <p className="dropdown-email">{user?.email}</p>
                    </div>
                    <div className="dropdown-divider" />
                    <Link to="/profile" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <FiUser size={16} /> My Profile
                    </Link>
                    <Link to="/orders" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <FiPackage size={16} /> My Orders
                    </Link>
                    {!isSeller && !isAdmin && (
                      <Link to="/become-seller" className="dropdown-item seller-link" onClick={() => setUserMenuOpen(false)}>
                        <FiBarChart2 size={16} /> Become a Seller
                      </Link>
                    )}
                    {(isSeller || isAdmin) && (
                      <Link to="/seller" className="dropdown-item seller-link" onClick={() => setUserMenuOpen(false)}>
                        <FiBarChart2 size={16} /> Seller Dashboard
                      </Link>
                    )}
                    {isAdmin && (
                      <Link to="/admin" className="dropdown-item admin-link" onClick={() => setUserMenuOpen(false)}>
                        <FiSettings size={16} /> Admin Panel
                      </Link>
                    )}
                    <div className="dropdown-divider" />
                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                      <FiLogOut size={16} /> Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" className="nav-btn cart-btn">
            <div className="cart-icon-wrap">
              <FiShoppingCart size={20} />
              {count > 0 && <span className="cart-badge">{count > 99 ? '99+' : count}</span>}
            </div>
            <span className="nav-label">Cart</span>
          </Link>

          {/* Seller Dashboard (top nav, only for sellers) */}
          {(isSeller || isAdmin) && (
            <Link to="/seller" className="nav-btn seller-btn">
              <FiBarChart2 size={18} />
              <span className="nav-label">Seller</span>
            </Link>
          )}

          {/* Admin */}
          {isAdmin && (
            <Link to="/admin" className="nav-btn admin-btn">
              <FiSettings size={18} />
              <span className="nav-label">Admin</span>
            </Link>
          )}
        </div>

        {/* Hamburger (mobile) */}
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Search */}
      <form className="mobile-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit"><FiSearch size={16} /></button>
      </form>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          {isAuthenticated ? (
            <>
              <div className="mobile-user-info">
                <FiUser size={20} />
                <div>
                  <p className="mobile-user-name">{user?.name}</p>
                  <p className="mobile-user-email">{user?.email}</p>
                </div>
              </div>
              <Link to="/profile" className="mobile-menu-item"><FiUser size={16} /> My Profile</Link>
              <Link to="/orders" className="mobile-menu-item"><FiPackage size={16} /> My Orders</Link>
              <Link to="/cart" className="mobile-menu-item">
                <FiShoppingCart size={16} /> Cart {count > 0 && <span className="mobile-cart-count">{count}</span>}
              </Link>
              {!isSeller && !isAdmin && (
                <Link to="/become-seller" className="mobile-menu-item highlight"><FiBarChart2 size={16} /> Become a Seller</Link>
              )}
              {(isSeller || isAdmin) && (
                <Link to="/seller" className="mobile-menu-item highlight"><FiBarChart2 size={16} /> Seller Dashboard</Link>
              )}
              {isAdmin && (
                <Link to="/admin" className="mobile-menu-item admin-link"><FiSettings size={16} /> Admin Panel</Link>
              )}
              <button className="mobile-menu-item logout" onClick={handleLogout}><FiLogOut size={16} /> Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-menu-item"><FiUser size={16} /> Login</Link>
              <Link to="/register" className="mobile-menu-item highlight">New here? Register</Link>
              <Link to="/cart" className="mobile-menu-item"><FiShoppingCart size={16} /> Cart</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
