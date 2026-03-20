import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

const IMG_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8080';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  if (!product) return null;

  const discountPercent = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const imageUrl = product.images?.length > 0
    ? (product.images[0].startsWith('http') ? product.images[0] : `${IMG_BASE}${product.images[0]}`)
    : `https://placehold.co/500x500/1a1a2e/ffffff?text=${encodeURIComponent(product.name)}`;

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-link">
        <div className="product-card-img-wrap">
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/500x500/1a1a2e/ffffff?text=${encodeURIComponent(product.name)}`;
            }}
          />
          {discountPercent && <span className="product-discount-badge">{discountPercent}% off</span>}
          {product.stock === 0 && <div className="out-of-stock-overlay">Out of Stock</div>}
        </div>
        <div className="product-card-body">
          <p className="product-card-name">{product.name}</p>
          {product.rating > 0 && (
            <div className="product-card-rating">
              <span className="rating-pill">
                {product.rating.toFixed(1)} <FiStar size={10} fill="currentColor" />
              </span>
              {product.reviewCount > 0 && <span className="review-count">({product.reviewCount.toLocaleString()})</span>}
            </div>
          )}
          <div className="product-card-price">
            <span className="price-now">₹{product.price?.toLocaleString('en-IN')}</span>
            {product.originalPrice > product.price && (
              <span className="price-was">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
            )}
            {discountPercent && <span className="price-off">{discountPercent}% off</span>}
          </div>
        </div>
      </Link>
      <button
        className="product-card-cart-btn"
        onClick={(e) => { e.preventDefault(); addToCart(product.id); }}
        disabled={product.stock === 0}
      >
        <FiShoppingCart size={14} /> Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;