import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import { register, clearError, selectAuth } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import './AuthPages.css';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(selectAuth);

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => { if (isAuthenticated) navigate('/'); }, [isAuthenticated, navigate]);
  useEffect(() => { return () => dispatch(clearError()); }, [dispatch]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Invalid phone number';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const { confirmPassword, ...data } = form;
    const result = await dispatch(register(data));
    if (register.fulfilled.match(result)) toast.success('Account created! Welcome to ShopKart!');
    else toast.error(result.payload || 'Registration failed');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-left-content">
            <h1>Shop<span>Kart</span></h1>
            <p>Join India's Most Trusted Shopping Platform</p>
            <ul className="auth-perks">
              <li>🎁 Exclusive member deals</li>
              <li>🚀 Early access to sales</li>
              <li>📦 Order tracking</li>
              <li>💰 Earn reward points</li>
            </ul>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-form-wrap">
            <h2>Create Account</h2>
            <p className="auth-subtitle">Sign up and start shopping!</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-icon-wrap">
                  <FiUser className="input-icon" />
                  <input type="text" name="name" value={form.name} onChange={handleChange}
                    className={`form-input ${errors.name ? 'error' : ''}`} placeholder="Your full name" />
                </div>
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-icon-wrap">
                  <FiMail className="input-icon" />
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    className={`form-input ${errors.email ? 'error' : ''}`} placeholder="your@email.com" />
                </div>
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number <span className="optional">(optional)</span></label>
                <div className="input-icon-wrap">
                  <FiPhone className="input-icon" />
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                    className={`form-input ${errors.phone ? 'error' : ''}`} placeholder="10-digit mobile number" />
                </div>
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-icon-wrap">
                  <FiLock className="input-icon" />
                  <input type={showPass ? 'text' : 'password'} name="password" value={form.password}
                    onChange={handleChange} className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Min 6 characters" />
                  <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="input-icon-wrap">
                  <FiLock className="input-icon" />
                  <input type="password" name="confirmPassword" value={form.confirmPassword}
                    onChange={handleChange} className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Repeat password" />
                </div>
                {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
              </div>

              <button type="submit" className="btn btn-secondary btn-full btn-lg" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <p className="auth-terms">
              By creating an account, you agree to our <Link to="#">Terms</Link> and <Link to="#">Privacy Policy</Link>
            </p>
            <p className="auth-switch">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
