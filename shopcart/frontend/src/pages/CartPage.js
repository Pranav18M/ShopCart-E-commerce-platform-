import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { selectCartItems, selectCartTotal } from '../store/slices/cartSlice';
import { useCart } from '../context/CartContext';
import './CartPage.css';

const IMG_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8080';

const CartPage = () => {
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const { removeItem, updateItem } = useCart();

  const savings = items.reduce((s, item) => {
    const saved = item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0;
    return s + saved;
  }, 0);

  if (items.length === 0) return (
    <div className="cart-empty-wrap">
      <div className="cart-empty-box">
        <FiShoppingBag size={80} className="empty-cart-icon" />
        <h2>Your cart is empty!</h2>
        <p>Add items to it now.</p>
        <Link to="/products" className="btn btn-primary btn-lg">Shop Now</Link>
      </div>
    </div>
  );

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-heading">My Cart ({items.length} {items.length === 1 ? 'item' : 'items'})</h1>
        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items-section">
            {items.map(item => {
              const imgUrl = item.imageUrl?.startsWith('http') ? item.imageUrl : `${IMG_BASE}${item.imageUrl}`;
              return (
                <div key={item.id} className="cart-item">
                  <Link to={`/products/${item.productId}`} className="cart-item-img-wrap">
                    <img src={imgUrl || 'https://via.placeholder.com/100x100?text=No+Image'} alt={item.productName} />
                  </Link>
                  <div className="cart-item-details">
                    <Link to={`/products/${item.productId}`} className="cart-item-name">{item.productName}</Link>
                    {item.sellerName && <p className="cart-item-seller">Sold by: {item.sellerName}</p>}
                    <div className="cart-item-price-row">
                      <span className="cart-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      {item.originalPrice > item.price && (
                        <>
                          <span className="cart-item-original">₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}</span>
                          <span className="cart-item-discount">
                            {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off
                          </span>
                        </>
                      )}
                    </div>
                    <div className="cart-item-actions">
                      <div className="cart-qty-controls">
                        <button onClick={() => item.quantity > 1 ? updateItem(item.id, item.quantity - 1) : removeItem(item.id)} className="qty-btn">
                          {item.quantity > 1 ? <FiMinus size={14} /> : <FiTrash2 size={14} />}
                        </button>
                        <span className="qty-display">{item.quantity}</span>
                        <button onClick={() => updateItem(item.id, item.quantity + 1)} className="qty-btn" disabled={item.quantity >= item.stock}>
                          <FiPlus size={14} />
                        </button>
                      </div>
                      <button className="remove-btn" onClick={() => removeItem(item.id)}>
                        <FiTrash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Price Summary */}
          <div className="price-summary">
            <h3>PRICE DETAILS</h3>
            <div className="price-rows">
              <div className="price-row">
                <span>Price ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                <span>₹{(total + savings).toLocaleString('en-IN')}</span>
              </div>
              {savings > 0 && (
                <div className="price-row discount-row">
                  <span>Discount</span>
                  <span>− ₹{savings.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="price-row">
                <span>Delivery Charges</span>
                <span className="free-delivery">{total >= 499 ? 'FREE' : '₹49'}</span>
              </div>
            </div>
            <div className="price-total-row">
              <span>Total Amount</span>
              <span>₹{(total + (total >= 499 ? 0 : 49)).toLocaleString('en-IN')}</span>
            </div>
            {savings > 0 && (
              <p className="savings-note">You will save ₹{savings.toLocaleString('en-IN')} on this order</p>
            )}
            <button className="btn btn-secondary btn-full btn-lg" onClick={() => navigate('/checkout')}>
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
