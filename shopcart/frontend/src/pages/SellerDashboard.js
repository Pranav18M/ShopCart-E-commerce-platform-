import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiPlus, FiPackage, FiBarChart2, FiEdit2, FiTrash2, FiX, FiUpload, FiStar } from 'react-icons/fi';
import productService from '../services/productService';
import { sellerService } from '../services/adminService';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './SellerDashboard.css';

const IMG_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8080';

// ── Product Form Modal ──
const ProductForm = ({ product, categories, onClose, onSaved }) => {
  const isEdit = !!product;
  const [form, setForm] = useState({
    name: product?.name || '',
    categoryId: product?.categoryId || '',
    description: product?.description || '',
    price: product?.price || '',
    originalPrice: product?.originalPrice || '',
    stock: product?.stock || '',
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState(product?.images?.map(img => img.startsWith('http') ? img : `${IMG_BASE}${img}`) || []);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (!form.price || isNaN(form.price) || form.price <= 0) e.price = 'Valid price required';
    if (!form.stock || isNaN(form.stock) || form.stock < 0) e.stock = 'Valid stock required';
    if (!form.categoryId) e.categoryId = 'Category required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    files.forEach(f => {
      const reader = new FileReader();
      reader.onloadend = () => setPreviews(prev => [...prev, reader.result]);
      reader.readAsDataURL(f);
    });
  };

  const removePreview = (i) => {
    setPreviews(p => p.filter((_, idx) => idx !== i));
    setImages(imgs => imgs.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach(img => fd.append('images', img));
      if (isEdit) {
        await productService.updateProduct(product.id, fd);
        toast.success('Product updated!');
      } else {
        await productService.createProduct(fd);
        toast.success('Product added! Pending admin approval.');
      }
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box product-form-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="modal-close" onClick={onClose}><FiX size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input className={`form-input ${errors.name ? 'error' : ''}`} value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Product name" />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className={`form-input ${errors.categoryId ? 'error' : ''}`} value={form.categoryId}
                onChange={e => setForm({ ...form, categoryId: e.target.value })}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.categoryId && <span className="form-error">{errors.categoryId}</span>}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Describe your product..." rows={4} style={{ resize: 'vertical' }} />
          </div>
          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">Selling Price (₹) *</label>
              <input type="number" className={`form-input ${errors.price ? 'error' : ''}`} value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00" min="0" />
              {errors.price && <span className="form-error">{errors.price}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Original Price (₹)</label>
              <input type="number" className="form-input" value={form.originalPrice}
                onChange={e => setForm({ ...form, originalPrice: e.target.value })} placeholder="MRP" min="0" />
            </div>
            <div className="form-group">
              <label className="form-label">Stock Quantity *</label>
              <input type="number" className={`form-input ${errors.stock ? 'error' : ''}`} value={form.stock}
                onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="0" min="0" />
              {errors.stock && <span className="form-error">{errors.stock}</span>}
            </div>
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label className="form-label">Product Images</label>
            <div className="image-upload-grid">
              {previews.map((src, i) => (
                <div key={i} className="img-preview-item">
                  <img src={src} alt={`Preview ${i + 1}`} />
                  <button type="button" className="img-remove-btn" onClick={() => removePreview(i)}><FiX size={12} /></button>
                </div>
              ))}
              {previews.length < 6 && (
                <label htmlFor="product-imgs" className="img-upload-btn">
                  <FiUpload size={20} />
                  <span>Add Image</span>
                  <input type="file" id="product-imgs" accept="image/*" multiple onChange={handleImageChange} style={{ display: 'none' }} />
                </label>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Products Tab ──
const SellerProducts = ({ categories }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const load = async () => {
    try {
      const data = await productService.getSellerProducts();
      setProducts(data);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productService.deleteProduct(id);
      toast.success('Product deleted');
      load();
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <LoadingSpinner />;

  const STATUS_STYLES = {
    PENDING: { bg: '#fff8e1', color: '#f57f17' },
    APPROVED: { bg: '#e8f5e9', color: '#2e7d32' },
    REJECTED: { bg: '#ffebee', color: '#c62828' },
  };

  return (
    <div className="seller-products">
      <div className="section-top">
        <h2>My Products ({products.length})</h2>
        <button className="btn btn-primary" onClick={() => { setEditProduct(null); setShowForm(true); }}>
          <FiPlus /> Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <FiPackage size={64} style={{ opacity: 0.2 }} />
          <h3>No products yet</h3>
          <p>Start adding products to your store</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}><FiPlus /> Add First Product</button>
        </div>
      ) : (
        <div className="products-table-wrap card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => {
                const imgUrl = p.images?.[0]?.startsWith('http') ? p.images[0] : `${IMG_BASE}${p.images?.[0]}`;
                const s = STATUS_STYLES[p.approvalStatus] || STATUS_STYLES.PENDING;
                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={imgUrl || 'https://via.placeholder.com/48x48'} alt={p.name}
                          style={{ width: 48, height: 48, objectFit: 'contain', border: '1px solid var(--border-light)', borderRadius: 4, padding: 4 }} />
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</span>
                      </div>
                    </td>
                    <td><span style={{ fontSize: 13 }}>{p.categoryName}</span></td>
                    <td><span style={{ fontWeight: 700 }}>₹{p.price?.toLocaleString('en-IN')}</span></td>
                    <td><span style={{ fontSize: 13, color: p.stock < 5 ? 'var(--accent-red)' : 'inherit' }}>{p.stock}</span></td>
                    <td>
                      <span className="badge" style={{ background: s.bg, color: s.color }}>{p.approvalStatus}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => { setEditProduct(p); setShowForm(true); }}>
                          <FiEdit2 size={13} /> Edit
                        </button>
                        <button className="btn btn-sm" style={{ background: '#ffebee', color: 'var(--accent-red)', border: 'none' }}
                          onClick={() => handleDelete(p.id)}>
                          <FiTrash2 size={13} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <ProductForm product={editProduct} categories={categories}
          onClose={() => { setShowForm(false); setEditProduct(null); }}
          onSaved={() => { setShowForm(false); setEditProduct(null); load(); }} />
      )}
    </div>
  );
};

// ── Stats Tab ──
const SellerStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sellerService.getSellerStats()
      .then(setStats).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const cards = [
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: '📦', color: '#e8f0fe' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: '🛒', color: '#e8f5e9' },
    { label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: '💰', color: '#fff8e1' },
    { label: 'Pending Orders', value: stats?.pendingOrders || 0, icon: '⏳', color: '#fff3e0' },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Dashboard Overview</h2>
      <div className="stats-grid">
        {cards.map(c => (
          <div key={c.label} className="stat-card" style={{ background: c.color }}>
            <span className="stat-icon">{c.icon}</span>
            <div>
              <p className="stat-value">{c.value}</p>
              <p className="stat-label">{c.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Main Seller Dashboard ──
const SellerDashboard = () => {
  const location = useLocation();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    productService.getCategories().then(setCategories).catch(() => {});
  }, []);

  const tabs = [
    { path: '/seller', label: 'Overview', icon: <FiGrid /> },
    { path: '/seller/products', label: 'My Products', icon: <FiPackage /> },
  ];

  return (
    <div className="seller-dashboard">
      <div className="container">
        <div className="seller-header">
          <div>
            <h1>🏪 Seller Dashboard</h1>
            <p>Manage your products and track your sales</p>
          </div>
        </div>

        <div className="seller-tabs">
          {tabs.map(tab => (
            <Link key={tab.path} to={tab.path}
              className={`seller-tab ${location.pathname === tab.path ? 'active' : ''}`}>
              {tab.icon} {tab.label}
            </Link>
          ))}
        </div>

        <div className="seller-content">
          <Routes>
            <Route path="/" element={<SellerStats />} />
            <Route path="/products" element={<SellerProducts categories={categories} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
