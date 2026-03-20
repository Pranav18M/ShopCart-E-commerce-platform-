import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowLeft, FiMapPin, FiCreditCard, FiPackage, FiTruck, FiCheck, FiClock, FiX } from 'react-icons/fi';
import { fetchOrderById, selectCurrentOrder, selectOrderLoading } from '../store/slices/orderSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './OrderDetailPage.css';

const TIMELINE = [
  { status: 'PAYMENT_PENDING', label: 'Order Placed', icon: <FiClock /> },
  { status: 'CONFIRMED', label: 'Payment Confirmed', icon: <FiCheck /> },
  { status: 'PROCESSING', label: 'Processing', icon: <FiPackage /> },
  { status: 'SHIPPED', label: 'Shipped', icon: <FiTruck /> },
  { status: 'DELIVERED', label: 'Delivered', icon: <FiCheck /> },
];

const STATUS_ORDER = ['PAYMENT_PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

const IMG_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8080';

const OrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const order = useSelector(selectCurrentOrder);
  const loading = useSelector(selectOrderLoading);

  useEffect(() => { dispatch(fetchOrderById(id)); }, [id, dispatch]);

  if (loading) return <LoadingSpinner />;
  if (!order) return (
    <div className="container" style={{ padding: '60px 16px' }}>
      <div className="empty-state"><h3>Order not found</h3><button className="btn btn-primary" onClick={() => navigate('/orders')}>My Orders</button></div>
    </div>
  );

  const isCancelled = order.status === 'CANCELLED';
  const currentStep = isCancelled ? -1 : STATUS_ORDER.indexOf(order.status);

  return (
    <div className="order-detail-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/orders')}>
          <FiArrowLeft /> Back to Orders
        </button>

        <div className="order-detail-header">
          <div>
            <h1>Order #{order.id?.toString().slice(-8).toUpperCase()}</h1>
            <p className="order-detail-date">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className={`order-detail-status ${order.status?.toLowerCase()}`}>
            {order.status?.replace('_', ' ')}
          </div>
        </div>

        <div className="order-detail-grid">
          <div className="order-detail-main">
            {/* Timeline */}
            {!isCancelled ? (
              <div className="order-timeline card">
                <h3>Order Tracking</h3>
                <div className="timeline">
                  {TIMELINE.map((step, i) => (
                    <div key={step.status} className={`timeline-item ${i <= currentStep ? 'done' : ''} ${i === currentStep ? 'current' : ''}`}>
                      <div className="timeline-icon">{i <= currentStep ? <FiCheck size={14} /> : step.icon}</div>
                      <div className="timeline-content">
                        <p className="timeline-label">{step.label}</p>
                        {i === currentStep && <p className="timeline-active-note">Current Status</p>}
                      </div>
                      {i < TIMELINE.length - 1 && <div className="timeline-line" />}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="order-cancelled-banner">
                <FiX size={24} />
                <div>
                  <p className="cancelled-title">Order Cancelled</p>
                  <p>This order has been cancelled.</p>
                </div>
              </div>
            )}

            {/* Items */}
            <div className="order-items-card card">
              <h3>Items Ordered</h3>
              {order.items?.map(item => {
                const imgUrl = item.imageUrl?.startsWith('http') ? item.imageUrl : `${IMG_BASE}${item.imageUrl}`;
                return (
                  <div key={item.id} className="order-item-row">
                    <img src={imgUrl || 'https://via.placeholder.com/80x80'} alt={item.productName} />
                    <div className="order-item-info">
                      <p className="order-item-name" onClick={() => navigate(`/products/${item.productId}`)}>{item.productName}</p>
                      <p className="order-item-qty">Qty: {item.quantity}</p>
                      <p className="order-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="order-detail-sidebar">
            {/* Delivery Address */}
            <div className="card order-detail-section">
              <h4><FiMapPin /> Delivery Address</h4>
              {order.deliveryAddress && (
                <div className="address-block">
                  <p className="address-name">{order.deliveryAddress.fullName}</p>
                  <p>{order.deliveryAddress.phone}</p>
                  <p>{order.deliveryAddress.addressLine1}</p>
                  {order.deliveryAddress.addressLine2 && <p>{order.deliveryAddress.addressLine2}</p>}
                  <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}</p>
                </div>
              )}
            </div>

            {/* Payment Info */}
            <div className="card order-detail-section">
              <h4><FiCreditCard /> Payment Info</h4>
              <div className="payment-info">
                <div className="payment-info-row">
                  <span>Method</span>
                  <span>{order.paymentMethod === 'COD' ? '💵 Cash on Delivery' : '📱 UPI'}</span>
                </div>
                {order.transactionId && (
                  <div className="payment-info-row">
                    <span>TXN ID</span>
                    <span className="txn-id">{order.transactionId}</span>
                  </div>
                )}
                <div className="payment-info-row">
                  <span>Status</span>
                  <span className={`payment-status-text ${order.paymentStatus?.toLowerCase()}`}>
                    {order.paymentStatus?.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="card order-detail-section">
              <h4>Price Details</h4>
              <div className="price-breakdown">
                <div className="price-row-detail"><span>Items Total</span><span>₹{(order.totalAmount - (order.deliveryCharge || 0)).toLocaleString('en-IN')}</span></div>
                <div className="price-row-detail"><span>Delivery</span><span>{order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}</span></div>
                <div className="price-row-total"><span>Total Paid</span><span>₹{order.totalAmount?.toLocaleString('en-IN')}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
