import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiPackage, FiClock, FiCheck, FiTruck, FiX } from 'react-icons/fi';
import { fetchMyOrders, selectOrders, selectOrderLoading } from '../store/slices/orderSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './OrdersPage.css';

const STATUS_CONFIG = {
  PAYMENT_PENDING: { label: 'Payment Pending', icon: <FiClock />, color: '#ff9800', bg: '#fff8e1' },
  CONFIRMED: { label: 'Confirmed', icon: <FiCheck />, color: '#2874f0', bg: '#e8f0fe' },
  PROCESSING: { label: 'Processing', icon: <FiPackage />, color: '#7b1fa2', bg: '#f3e5f5' },
  SHIPPED: { label: 'Shipped', icon: <FiTruck />, color: '#0097a7', bg: '#e0f7fa' },
  DELIVERED: { label: 'Delivered', icon: <FiCheck />, color: '#388e3c', bg: '#e8f5e9' },
  CANCELLED: { label: 'Cancelled', icon: <FiX />, color: '#d32f2f', bg: '#ffebee' },
};

const IMG_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8080';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orders = useSelector(selectOrders);
  const loading = useSelector(selectOrderLoading);

  useEffect(() => { dispatch(fetchMyOrders()); }, [dispatch]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="orders-page">
      <div className="container">
        <h1 className="orders-heading">My Orders</h1>

        {orders.length === 0 ? (
          <div className="empty-state" style={{ background: 'white', borderRadius: 8 }}>
            <FiPackage size={64} style={{ opacity: 0.3 }} />
            <h3>No orders yet</h3>
            <p>Looks like you haven't placed any orders</p>
            <Link to="/products" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => {
              const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.PAYMENT_PENDING;
              const firstItem = order.items?.[0];
              const imgUrl = firstItem?.imageUrl?.startsWith('http')
                ? firstItem.imageUrl : `${IMG_BASE}${firstItem?.imageUrl}`;

              return (
                <div key={order.id} className="order-card" onClick={() => navigate(`/orders/${order.id}`)}>
                  <div className="order-card-left">
                    <div className="order-img-wrap">
                      <img src={imgUrl || 'https://via.placeholder.com/80x80'} alt="Order" />
                      {order.items?.length > 1 && (
                        <span className="more-items">+{order.items.length - 1}</span>
                      )}
                    </div>
                    <div className="order-info">
                      <p className="order-id">Order #{order.id?.toString().slice(-8).toUpperCase()}</p>
                      <p className="order-items-summary">
                        {firstItem?.productName}{order.items?.length > 1 ? ` + ${order.items.length - 1} more` : ''}
                      </p>
                      <p className="order-amount">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                      <p className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="order-card-right">
                    <div className="order-status-badge" style={{ color: status.color, background: status.bg }}>
                      {status.icon}
                      <span>{status.label}</span>
                    </div>
                    <button className="btn btn-outline btn-sm">View Details →</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
