import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { fetchFeaturedProducts, fetchCategories, selectFeatured, selectCategories } from '../store/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './HomePage.css';

const BANNERS = [
  { id: 1, bg: 'linear-gradient(135deg, #1a237e 0%, #2874f0 100%)', title: 'Big Billion Days', subtitle: 'Deals up to 80% off on Electronics', cta: 'Shop Now', link: '/products?category=Electronics', emoji: '⚡' },
  { id: 2, bg: 'linear-gradient(135deg, #880e4f 0%, #e91e63 100%)', title: 'Fashion Fiesta', subtitle: 'Styles for every occasion', cta: 'Explore', link: '/products?category=Fashion', emoji: '👗' },
  { id: 3, bg: 'linear-gradient(135deg, #1b5e20 0%, #4caf50 100%)', title: 'Home Makeover', subtitle: 'Transform your space today', cta: 'Discover', link: '/products?category=Home', emoji: '🏠' },
];

const CATEGORY_ICONS = {
  Electronics: '📱', Fashion: '👗', Home: '🏠', Books: '📚',
  Sports: '⚽', Toys: '🧸', Beauty: '💄', Food: '🍎', Grocery: '🛒', Furniture: '🪑',
};

const Banner = () => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % BANNERS.length), 4000);
    return () => clearInterval(timer);
  }, []);
  const b = BANNERS[current];
  return (
    <div className="banner-wrap">
      <div className="banner-slide" style={{ background: b.bg }}>
        <div className="banner-content">
          <span className="banner-emoji">{b.emoji}</span>
          <div>
            <h1 className="banner-title">{b.title}</h1>
            <p className="banner-subtitle">{b.subtitle}</p>
            <Link to={b.link} className="banner-cta">{b.cta} <FiArrowRight /></Link>
          </div>
        </div>
        <div className="banner-circles">
          <div className="circle c1" />
          <div className="circle c2" />
          <div className="circle c3" />
        </div>
      </div>
      <div className="banner-dots">
        {BANNERS.map((_, i) => (
          <button key={i} className={`dot ${i === current ? 'active' : ''}`} onClick={() => setCurrent(i)} />
        ))}
      </div>
      <button className="banner-nav prev" onClick={() => setCurrent(c => (c - 1 + BANNERS.length) % BANNERS.length)}><FiChevronLeft /></button>
      <button className="banner-nav next" onClick={() => setCurrent(c => (c + 1) % BANNERS.length)}><FiChevronRight /></button>
    </div>
  );
};

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const featured = useSelector(selectFeatured);
  const categories = useSelector(selectCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dispatch(fetchFeaturedProducts()),
      dispatch(fetchCategories()),
    ]).finally(() => setLoading(false));
  }, [dispatch]);

  if (loading) return <LoadingSpinner text="Loading ShopKart..." />;

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="home-banner-section">
        <Banner />
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="home-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Shop by Category</h2>
              <Link to="/products" className="section-link">View All <FiArrowRight size={14} /></Link>
            </div>
            <div className="categories-grid">
              {categories.slice(0, 10).map(cat => (
                <button key={cat.id} className="category-tile" onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}>
                  <div className="category-icon">{CATEGORY_ICONS[cat.name] || '🛍️'}</div>
                  <span className="category-name">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Deals Strip */}
      <div className="deals-strip">
        <div className="container">
          <div className="deals-strip-inner">
            <span className="deal-item">🚚 <strong>Free Delivery</strong> on orders above ₹499</span>
            <span className="deal-divider">|</span>
            <span className="deal-item">🔒 <strong>Secure Payments</strong></span>
            <span className="deal-divider">|</span>
            <span className="deal-item">↩️ <strong>Easy Returns</strong> within 7 days</span>
            <span className="deal-divider">|</span>
            <span className="deal-item">⭐ <strong>Genuine Products</strong> guaranteed</span>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="home-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">🔥 Featured Products</h2>
              <Link to="/products" className="section-link">See All <FiArrowRight size={14} /></Link>
            </div>
            <div className="products-grid">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Promo Cards */}
      <section className="home-section">
        <div className="container">
          <div className="promo-grid">
            <div className="promo-card promo-blue" onClick={() => navigate('/products?category=Electronics')}>
              <div className="promo-content">
                <h3>Electronics Sale</h3>
                <p>Up to 60% off on Top Brands</p>
                <span className="promo-cta">Shop Now →</span>
              </div>
              <span className="promo-emoji">📱</span>
            </div>
            <div className="promo-card promo-pink" onClick={() => navigate('/products?category=Fashion')}>
              <div className="promo-content">
                <h3>Fashion Week</h3>
                <p>Latest trends for everyone</p>
                <span className="promo-cta">Explore →</span>
              </div>
              <span className="promo-emoji">👗</span>
            </div>
            <div className="promo-card promo-green" onClick={() => navigate('/become-seller')}>
              <div className="promo-content">
                <h3>Sell on ShopKart</h3>
                <p>Reach millions of customers</p>
                <span className="promo-cta">Start Selling →</span>
              </div>
              <span className="promo-emoji">🏪</span>
            </div>
          </div>
        </div>
      </section>

      {/* All Products */}
      {featured.length === 0 && (
        <section className="home-section">
          <div className="container">
            <div className="empty-state" style={{ background: 'white', borderRadius: 8, padding: 60 }}>
              <span style={{ fontSize: 64 }}>🛍️</span>
              <h3>No products yet</h3>
              <p>Products will appear here once sellers add them</p>
              <Link to="/become-seller" className="btn btn-primary">Become a Seller</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
