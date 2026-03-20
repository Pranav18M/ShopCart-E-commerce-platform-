import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiUsers, FiPackage, FiShoppingBag, FiGrid, FiCheck, FiX, FiEye, FiTag } from 'react-icons/fi';
import {
  fetchAdminStats, fetchAllUsers, fetchPendingSubscriptions, fetchPendingOrders,
  fetchAllProducts, approveSubscription, rejectSubscription, approveOrderPayment,
  rejectOrderPayment, updateOrderStatus, approveProduct, rejectProduct,
  selectAdminStats, selectAdminUsers, selectPendingSubscriptions, selectPendingOrders, selectAdminProducts,
} from '../store/slices/adminSlice';
import adminService from '../services/adminService';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './AdminDashboard.css';

const IMG_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8080';

// ── Stats Overview ──
const AdminOverview = () => {
  const dispatch = useDispatch();
  const stats = useSelector(selectAdminStats);

  useEffect(() => { dispatch(fetchAdminStats()); }, [dispatch]);

  if (!stats) return <LoadingSpinner />;

  const cards = [
    { label: 'Total Users', value: stats.totalUsers || 0, icon: '👥', color: '#e8f0fe', textColor: 'var(--primary)' },
    { label: 'Total Sellers', value: stats.totalSellers || 0, icon: '🏪', color: '#e8f5e9', textColor: 'var(--accent-green)' },
    { label: 'Total Products', value: stats.totalProducts || 0, icon: '📦', color: '#fff3e0', textColor: '#f57f17' },
    { label: 'Total Orders', value: stats.totalOrders || 0, icon: '🛒', color: '#fce4ec', textColor: '#c2185b' },
    { label: 'Pending Payments', value: stats.pendingPayments || 0, icon: '⏳', color: '#fff8e1', textColor: '#e65100' },
    { label: 'Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`, icon: '💰', color: '#e0f2f1', textColor: '#00695c' },
  ];

  return (
    <div>
      <h2 className="admin-section-title">Dashboard Overview</h2>
      <div className="admin-stats-grid">
        {cards.map(c => (
          <div key={c.label} className="admin-stat-card" style={{ background: c.color }}>
            <span className="admin-stat-icon">{c.icon}</span>
            <div>
              <p className="admin-stat-value" style={{ color: c.textColor }}>{c.value}</p>
              <p className="admin-stat-label">{c.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Subscriptions ──
const AdminSubscriptions = () => {
  const dispatch = useDispatch();
  const subscriptions = useSelector(selectPendingSubscriptions);

  useEffect(() => { dispatch(fetchPendingSubscriptions()); }, [dispatch]);

  const handleApprove = async (id) => {
    const res = await dispatch(approveSubscription(id));
    if (approveSubscription.fulfilled.match(res)) toast.success('Seller approved!');
    else toast.error('Failed to approve');
  };

  const handleReject = async (id) => {
    const res = await dispatch(rejectSubscription(id));
    if (rejectSubscription.fulfilled.match(res)) toast.success('Subscription rejected');
    else toast.error('Failed to reject');
  };

  return (
    <div>
      <h2 className="admin-section-title">Pending Seller Subscriptions ({subscriptions.length})</h2>
      {subscriptions.length === 0 ? (
        <div className="empty-state card" style={{ padding: 48 }}>
          <FiCheck size={48} style={{ opacity: 0.2 }} />
          <h3>All caught up!</h3>
          <p>No pending subscription approvals</p>
        </div>
      ) : (
        <div className="admin-cards-list">
          {subscriptions.map(sub => {
            const ssUrl = sub.screenshotUrl ? `${IMG_BASE}${sub.screenshotUrl}` : null;
            return (
              <div key={sub.id} className="admin-verify-card card">
                <div className="verify-card-info">
                  <div className="verify-user">
                    <div className="verify-avatar">{sub.userName?.[0]?.toUpperCase()}</div>
                    <div>
                      <p className="verify-name">{sub.userName}</p>
                      <p className="verify-email">{sub.userEmail}</p>
                    </div>
                  </div>
                  <div className="verify-details">
                    <div className="verify-detail-row">
                      <span>Plan:</span><strong>Seller Subscription — ₹399/month</strong>
                    </div>
                    <div className="verify-detail-row">
                      <span>Transaction ID:</span>
                      <strong className="txn-badge">{sub.transactionId}</strong>
                    </div>
                    <div className="verify-detail-row">
                      <span>Submitted:</span>
                      <span>{new Date(sub.createdAt).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  {ssUrl && (
                    <a href={ssUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                      <FiEye size={14} /> View Screenshot
                    </a>
                  )}
                </div>
                <div className="verify-card-actions">
                  <button className="btn btn-sm approve-btn" onClick={() => handleApprove(sub.id)}>
                    <FiCheck size={14} /> Approve
                  </button>
                  <button className="btn btn-sm reject-btn" onClick={() => handleReject(sub.id)}>
                    <FiX size={14} /> Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── Orders ──
const AdminOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectPendingOrders);

  useEffect(() => { dispatch(fetchPendingOrders()); }, [dispatch]);

  const handleApprovePayment = async (id) => {
    const res = await dispatch(approveOrderPayment(id));
    if (approveOrderPayment.fulfilled.match(res)) toast.success('Payment approved! Order confirmed.');
    else toast.error('Failed');
  };

  const handleRejectPayment = async (id) => {
    try {
      await adminService.rejectOrderPayment(id);
      toast.success('Payment rejected');
      dispatch(fetchPendingOrders());
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <h2 className="admin-section-title">Pending Payment Approvals ({orders.length})</h2>
      {orders.length === 0 ? (
        <div className="empty-state card" style={{ padding: 48 }}>
          <FiCheck size={48} style={{ opacity: 0.2 }} />
          <h3>All caught up!</h3>
          <p>No pending payment approvals</p>
        </div>
      ) : (
        <div className="admin-cards-list">
          {orders.map(order => {
            const ssUrl = order.paymentScreenshotUrl ? `${IMG_BASE}${order.paymentScreenshotUrl}` : null;
            return (
              <div key={order.id} className="admin-verify-card card">
                <div className="verify-card-info">
                  <div className="verify-user">
                    <div className="verify-avatar" style={{ background: '#e8f0fe', color: 'var(--primary)' }}>
                      🛒
                    </div>
                    <div>
                      <p className="verify-name">Order #{order.id?.toString().slice(-8).toUpperCase()}</p>
                      <p className="verify-email">{order.userEmail}</p>
                    </div>
                  </div>
                  <div className="verify-details">
                    <div className="verify-detail-row">
                      <span>Amount:</span><strong style={{ color: 'var(--accent-green)', fontSize: 16 }}>₹{order.totalAmount?.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="verify-detail-row">
                      <span>Method:</span><strong>{order.paymentMethod}</strong>
                    </div>
                    {order.transactionId && (
                      <div className="verify-detail-row">
                        <span>TXN ID:</span><strong className="txn-badge">{order.transactionId}</strong>
                      </div>
                    )}
                    <div className="verify-detail-row">
                      <span>Items:</span><span>{order.items?.length} item(s)</span>
                    </div>
                    <div className="verify-detail-row">
                      <span>Date:</span><span>{new Date(order.createdAt).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  {ssUrl && (
                    <a href={ssUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                      <FiEye size={14} /> View Screenshot
                    </a>
                  )}
                </div>
                <div className="verify-card-actions">
                  <button className="btn btn-sm approve-btn" onClick={() => handleApprovePayment(order.id)}>
                    <FiCheck size={14} /> Approve Payment
                  </button>
                  <button className="btn btn-sm reject-btn" onClick={() => handleRejectPayment(order.id)}>
                    <FiX size={14} /> Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── Products Approval ──
const AdminProducts = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAdminProducts);

  useEffect(() => { dispatch(fetchAllProducts()); }, [dispatch]);

  const handleApprove = async (id) => {
    const res = await dispatch(approveProduct(id));
    if (approveProduct.fulfilled.match(res)) toast.success('Product approved!');
  };

  const handleReject = async (id) => {
    const res = await dispatch(rejectProduct(id));
    if (rejectProduct.fulfilled.match(res)) toast.success('Product rejected');
  };

  const STATUS_COLORS = {
    PENDING: { bg: '#fff8e1', color: '#e65100' },
    APPROVED: { bg: '#e8f5e9', color: '#2e7d32' },
    REJECTED: { bg: '#ffebee', color: '#c62828' },
  };

  return (
    <div>
      <h2 className="admin-section-title">All Products ({products.length})</h2>
      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr><th>Product</th><th>Seller</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {products.map(p => {
              const imgUrl = p.images?.[0]?.startsWith('http') ? p.images[0] : `${IMG_BASE}${p.images?.[0]}`;
              const sc = STATUS_COLORS[p.approvalStatus] || STATUS_COLORS.PENDING;
              return (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={imgUrl || 'https://via.placeholder.com/40x40'} alt={p.name}
                        style={{ width: 40, height: 40, objectFit: 'contain', border: '1px solid var(--border-light)', borderRadius: 4, padding: 2 }} />
                      <span style={{ fontWeight: 600, fontSize: 13, maxWidth: 180 }}>{p.name}</span>
                    </div>
                  </td>
                  <td><span style={{ fontSize: 13 }}>{p.sellerName}</span></td>
                  <td><span style={{ fontSize: 13 }}>{p.categoryName}</span></td>
                  <td><strong>₹{p.price?.toLocaleString('en-IN')}</strong></td>
                  <td>{p.stock}</td>
                  <td><span className="badge" style={{ background: sc.bg, color: sc.color }}>{p.approvalStatus}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {p.approvalStatus !== 'APPROVED' && (
                        <button className="btn btn-sm approve-btn" onClick={() => handleApprove(p.id)}><FiCheck size={13} /> Approve</button>
                      )}
                      {p.approvalStatus !== 'REJECTED' && (
                        <button className="btn btn-sm reject-btn" onClick={() => handleReject(p.id)}><FiX size={13} /> Reject</button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── Users ──
const AdminUsers = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectAdminUsers);

  useEffect(() => { dispatch(fetchAllUsers()); }, [dispatch]);

  const ROLE_COLORS = { USER: '#e8f0fe', SELLER: '#e8f5e9', ADMIN: '#fce4ec' };
  const ROLE_TEXT = { USER: 'var(--primary)', SELLER: 'var(--accent-green)', ADMIN: '#c2185b' };

  return (
    <div>
      <h2 className="admin-section-title">All Users ({users.length})</h2>
      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr><th>User</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</span>
                  </div>
                </td>
                <td><span style={{ fontSize: 13 }}>{u.email}</span></td>
                <td><span style={{ fontSize: 13 }}>{u.phone || '—'}</span></td>
                <td>
                  <span className="badge" style={{ background: ROLE_COLORS[u.role] || '#f5f5f5', color: ROLE_TEXT[u.role] || 'var(--text-secondary)' }}>
                    {u.role}
                  </span>
                </td>
                <td><span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── Categories ──
const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => adminService.getCategories().then(setCategories).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    try {
      await adminService.createCategory({ name: newCat.trim() });
      toast.success('Category created!');
      setNewCat('');
      load();
    } catch { toast.error('Failed to create category'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await adminService.deleteCategory(id);
      toast.success('Category deleted');
      load();
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="admin-section-title">Manage Categories</h2>
      <div className="categories-admin-layout">
        <div className="card" style={{ padding: 24, maxWidth: 360 }}>
          <h4 style={{ marginBottom: 16, fontSize: 15, fontWeight: 700 }}>Add New Category</h4>
          <form onSubmit={handleCreate} style={{ display: 'flex', gap: 10 }}>
            <input className="form-input" value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="Category name" style={{ flex: 1 }} />
            <button type="submit" className="btn btn-primary"><FiTag size={14} /> Add</button>
          </form>
        </div>
        <div className="card" style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead><tr><th>#</th><th>Category Name</th><th>Actions</th></tr></thead>
            <tbody>
              {categories.map((c, i) => (
                <tr key={c.id}>
                  <td>{i + 1}</td>
                  <td><strong>{c.name}</strong></td>
                  <td>
                    <button className="btn btn-sm reject-btn" onClick={() => handleDelete(c.id)}>
                      <FiX size={13} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ── Main Admin Dashboard ──
const AdminDashboard = () => {
  const location = useLocation();

  const tabs = [
    { path: '/admin', label: 'Overview', icon: <FiGrid /> },
    { path: '/admin/subscriptions', label: 'Seller Approvals', icon: <FiUsers /> },
    { path: '/admin/orders', label: 'Payment Approvals', icon: <FiShoppingBag /> },
    { path: '/admin/products', label: 'Products', icon: <FiPackage /> },
    { path: '/admin/users', label: 'Users', icon: <FiUsers /> },
    { path: '/admin/categories', label: 'Categories', icon: <FiTag /> },
  ];

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>⚙️ Admin Panel</h1>
            <p>Manage the entire platform from here</p>
          </div>
        </div>

        <div className="admin-tabs">
          {tabs.map(tab => (
            <Link key={tab.path} to={tab.path}
              className={`admin-tab ${location.pathname === tab.path ? 'active' : ''}`}>
              {tab.icon} {tab.label}
            </Link>
          ))}
        </div>

        <div className="admin-content">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/subscriptions" element={<AdminSubscriptions />} />
            <Route path="/orders" element={<AdminOrders />} />
            <Route path="/products" element={<AdminProducts />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/categories" element={<AdminCategories />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
