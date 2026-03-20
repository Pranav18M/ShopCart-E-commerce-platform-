import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiStar, FiShoppingCart, FiZap, FiTruck, FiShield, FiRepeat, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { fetchProductById, selectCurrentProduct, selectProductsLoading } from '../store/slices/productSlice';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './ProductDetailPage.css';

const IMG_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8080';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const product = useSelector(selectCurrentProduct);
  const loading = useSelector(selectProductsLoading);
  const { addToCart } = useCart();
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    dispatch(fetchProductById(id));
    window.scrollTo(0, 0);
  }, [id, dispatch]);

  if (loading) return <LoadingSpinner />;
  if (!product) return (
    <div className="container" style={{ padding: '60px 16px' }}>
      <div className="empty-state"><h3>Product not found</h3><button className="btn btn-primary" onClick={() => navigate('/products')}>Browse Products</button></div>
    </div>
  );

  const images = product.images?.length > 0
    ? product.images.map(img => img.startsWith('http') ? img : `${IMG_BASE}${img}`)
    : ['https://via.placeholder.com/500x500?text=No+Image'];

  const discountPercent = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <button onClick={() => navigate('/')}>Home</button>
          <span>›</span>
          <button onClick={() => navigate('/products')}>Products</button>
          {product.category && <><span>›</span><button onClick={() => navigate(`/products?category=${product.category}`)}>{product.category}</button></>}
          <span>›</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        <div className="product-detail-layout">
          {/* Image Gallery */}
          <div className="product-gallery">
            <div className="gallery-thumbnails">
              {images.map((img, i) => (
                <button key={i} className={`thumb-btn ${i === selectedImg ? 'active' : ''}`} onClick={() => setSelectedImg(i)}>
                  <img src={img} alt={`View ${i + 1}`} />
                </button>
              ))}
            </div>
            <div className="gallery-main">
              <img src={images[selectedImg]} alt={product.name} className="main-img" />
              {images.length > 1 && (
                <>
                  <button className="gallery-nav prev" onClick={() => setSelectedImg(i => Math.max(0, i - 1))}><FiChevronLeft /></button>
                  <button className="gallery-nav next" onClick={() => setSelectedImg(i => Math.min(images.length - 1, i + 1))}><FiChevronRight /></button>
                </>
              )}
              {product.stock === 0 && <div className="oos-badge">Out of Stock</div>}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            {product.category && <span className="product-category-tag">{product.category}</span>}
            <h1 className="product-title">{product.name}</h1>

            {product.rating > 0 && (
              <div className="product-rating-row">
                <div className="rating-box">
                  <FiStar fill="white" size={12} /> {product.rating.toFixed(1)}
                </div>
                <span className="rating-text">{product.reviewCount?.toLocaleString()} ratings</span>
              </div>
            )}

            <div className="product-price-section">
              <div className="price-block">
                <span className="price-current">₹{product.price?.toLocaleString('en-IN')}</span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="price-original">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
                    <span className="price-discount">{discountPercent}% off</span>
                  </>
                )}
              </div>
              <p className="price-note">inclusive of all taxes</p>
            </div>

            {/* Offers */}
            <div className="offers-section">
              <h4>Available Offers</h4>
              <ul className="offer-list">
                <li>🏷️ <strong>Bank Offer</strong> 10% off on first UPI payment</li>
                <li>💳 <strong>No Cost EMI</strong> starting ₹{Math.round(product.price / 6)}/month</li>
              </ul>
            </div>

            {/* Delivery */}
            <div className="delivery-section">
              <div className="delivery-row">
                <FiTruck className="delivery-icon" />
                <div>
                  <p><strong>Free Delivery</strong></p>
                  <p className="delivery-detail">Delivery in 3-5 business days</p>
                </div>
              </div>
            </div>

            {/* Stock */}
            <div className="stock-section">
              {product.stock > 0 ? (
                product.stock < 10
                  ? <p className="low-stock">⚠️ Only {product.stock} left in stock!</p>
                  : <p className="in-stock">✅ In Stock</p>
              ) : (
                <p className="out-of-stock-text">❌ Out of Stock</p>
              )}
            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="qty-section">
                <label>Quantity:</label>
                <div className="qty-controls">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty === 1}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} disabled={qty === product.stock}>+</button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="product-actions">
              <button className="btn btn-outline btn-lg action-btn" onClick={() => addToCart(product.id, qty)} disabled={product.stock === 0}>
                <FiShoppingCart /> ADD TO CART
              </button>
              <button className="btn btn-secondary btn-lg action-btn" onClick={() => { addToCart(product.id, qty); navigate('/cart'); }} disabled={product.stock === 0}>
                <FiZap /> BUY NOW
              </button>
            </div>

            {/* Assurances */}
            <div className="assurance-strip">
              <div className="assurance-item"><FiShield /> <span>7 Day Returns</span></div>
              <div className="assurance-item"><FiTruck /> <span>Free Delivery</span></div>
              <div className="assurance-item"><FiRepeat /> <span>Easy Exchange</span></div>
            </div>

            {/* Seller */}
            {product.sellerName && (
              <p className="seller-info">Sold by: <strong>{product.sellerName}</strong></p>
            )}
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="product-description-section card">
            <h3>Product Description</h3>
            <p>{product.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
