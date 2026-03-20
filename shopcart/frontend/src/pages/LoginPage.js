import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { login, clearError, selectAuth } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import './AuthPages.css';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useSelector(selectAuth);
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  useEffect(() => { if (isAuthenticated) navigate(from, { replace: true }); }, [isAuthenticated, navigate, from]);
  useEffect(() => { return () => dispatch(clearError()); }, [dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill all fields'); return; }
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) toast.success('Welcome back!');
    else toast.error(result.payload || 'Login failed');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-left-content">
            <h1>Shop<span>Kart</span></h1>
            <p>India's Most Trusted Online Shopping Platform</p>
            <ul className="auth-perks">
              <li>✅ Millions of Products</li>
              <li>✅ Best Prices Guaranteed</li>
              <li>✅ Fast & Free Delivery</li>
              <li>✅ Easy Returns & Refunds</li>
            </ul>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-form-wrap">
            <h2>Login</h2>
            <p className="auth-subtitle">Get access to your Orders, Wishlist and Recommendations</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-icon-wrap">
                  <FiMail className="input-icon" />
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    className="form-input" placeholder="Enter your email" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-icon-wrap">
                  <FiLock className="input-icon" />
                  <input type={showPass ? 'text' : 'password'} name="password" value={form.password}
                    onChange={handleChange} className="form-input" placeholder="Enter your password" required />
                  <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-secondary btn-full btn-lg" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="auth-switch">
              New to ShopKart? <Link to="/register">Create an account</Link>
            </p>

            <div className="auth-demo-creds">
              <p><strong>Demo Credentials:</strong></p>
              <p>Admin: admin@shopkart.com / admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
