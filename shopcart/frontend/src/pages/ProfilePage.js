import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiEdit2, FiSave, FiX, FiLogOut, FiBarChart2, FiPackage } from 'react-icons/fi';
import { fetchCurrentUser, logout, selectAuth } from '../store/slices/authSlice';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './ProfilePage.css';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isSeller, isAdmin } = useAuth();
  const { profile } = useSelector(selectAuth);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (profile) { setForm({ name: profile.name || '', phone: profile.phone || '' }); }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await authService.updateProfile(form);
      dispatch(fetchCurrentUser());
      setEditing(false);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    toast.success('Logged out successfully');
  };

  const ROLE_BADGE = {
    ADMIN: { bg: '#fce4ec', color: '#c2185b', label: 'Administrator' },
    SELLER: { bg: '#e8f5e9', color: '#2e7d32', label: 'Verified Seller' },
    USER: { bg: '#e8f0fe', color: 'var(--primary)', label: 'Customer' },
  };
  const roleBadge = ROLE_BADGE[user?.role] || ROLE_BADGE.USER;

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-layout">
          {/* Sidebar */}
          <div className="profile-sidebar">
            <div className="profile-avatar-section">
              <div className="profile-avatar">{profile?.name?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || 'U'}</div>
              <h3 className="profile-name">{profile?.name || user?.name}</h3>
              <span className="profile-role-badge" style={{ background: roleBadge.bg, color: roleBadge.color }}>
                {roleBadge.label}
              </span>
            </div>

            <nav className="profile-nav">
              <button className="profile-nav-item active"><FiUser size={16} /> My Profile</button>
              <button className="profile-nav-item" onClick={() => navigate('/orders')}><FiPackage size={16} /> My Orders</button>
              {!isSeller && !isAdmin && (
                <button className="profile-nav-item seller-action" onClick={() => navigate('/become-seller')}>
                  <FiBarChart2 size={16} /> Become a Seller
                </button>
              )}
              {(isSeller || isAdmin) && (
                <button className="profile-nav-item seller-action" onClick={() => navigate('/seller')}>
                  <FiBarChart2 size={16} /> Seller Dashboard
                </button>
              )}
              {isAdmin && (
                <button className="profile-nav-item admin-action" onClick={() => navigate('/admin')}>
                  ⚙️ Admin Panel
                </button>
              )}
              <button className="profile-nav-item logout-action" onClick={handleLogout}>
                <FiLogOut size={16} /> Logout
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="profile-main">
            <div className="card profile-info-card">
              <div className="profile-card-header">
                <h2>Personal Information</h2>
                {!editing ? (
                  <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>
                    <FiEdit2 size={14} /> Edit
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                      <FiSave size={14} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button className="btn btn-outline btn-sm" onClick={() => setEditing(false)}>
                      <FiX size={14} /> Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="profile-fields">
                <div className="profile-field">
                  <label><FiUser size={14} /> Full Name</label>
                  {editing ? (
                    <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  ) : (
                    <p>{profile?.name || '—'}</p>
                  )}
                </div>
                <div className="profile-field">
                  <label><FiMail size={14} /> Email Address</label>
                  <p className="disabled-field">{profile?.email || user?.email}</p>
                  <span className="field-note">Email cannot be changed</span>
                </div>
                <div className="profile-field">
                  <label><FiPhone size={14} /> Phone Number</label>
                  {editing ? (
                    <input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="10-digit mobile" />
                  ) : (
                    <p>{profile?.phone || '—'}</p>
                  )}
                </div>
                <div className="profile-field">
                  <label>Account Role</label>
                  <p>
                    <span className="profile-role-badge" style={{ background: roleBadge.bg, color: roleBadge.color }}>
                      {roleBadge.label}
                    </span>
                  </p>
                </div>
                <div className="profile-field">
                  <label>Member Since</label>
                  <p>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="profile-quick-actions">
              <button className="quick-action-card" onClick={() => navigate('/orders')}>
                <FiPackage size={28} />
                <span>My Orders</span>
              </button>
              {!isSeller && !isAdmin && (
                <button className="quick-action-card seller-card" onClick={() => navigate('/become-seller')}>
                  <FiBarChart2 size={28} />
                  <span>Become Seller</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
