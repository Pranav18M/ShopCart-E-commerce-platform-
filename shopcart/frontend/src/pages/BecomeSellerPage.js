import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiUpload, FiInfo, FiBarChart2 } from 'react-icons/fi';
import { sellerService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './BecomeSellerPage.css';

const SELLER_PERKS = [
  'Access to millions of customers',
  'Easy product management dashboard',
  'Order tracking & management',
  'Analytics and sales reports',
  'Dedicated seller support',
  'Low commission rates',
];

const BecomeSellerPage = () => {
  const navigate = useNavigate();
  const { isSeller, isAdmin } = useAuth();
  const [step, setStep] = useState(0); // 0: info, 1: payment, 2: submitted
  const [loading, setLoading] = useState(false);
  const [subStatus, setSubStatus] = useState(null);
  const [form, setForm] = useState({ transactionId: '', screenshot: null, upiOption: 'googlepay' });

  useEffect(() => {
    if (isSeller || isAdmin) { navigate('/seller'); return; }
    // Check existing subscription
    sellerService.getSubscriptionStatus()
      .then(data => { if (data?.status === 'PENDING') setSubStatus('PENDING'); })
      .catch(() => {});
  }, [isSeller, isAdmin, navigate]);

  const handleSubmit = async () => {
    if (!form.transactionId.trim()) { toast.error('Please enter your UPI Transaction ID'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('transactionId', form.transactionId);
      if (form.screenshot) fd.append('screenshot', form.screenshot);
      await sellerService.requestSubscription(fd);
      setStep(2);
      toast.success('Subscription request submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  if (subStatus === 'PENDING') return (
    <div className="become-seller-page">
      <div className="container">
        <div className="sub-pending-card">
          <div className="pending-icon">⏳</div>
          <h2>Subscription Under Review</h2>
          <p>Your payment is being verified by our team. Once approved, you'll gain full seller access.</p>
          <p className="pending-note">This usually takes 1–4 business hours.</p>
          <button className="btn btn-outline" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    </div>
  );

  if (step === 2) return (
    <div className="become-seller-page">
      <div className="container">
        <div className="sub-pending-card success">
          <div className="pending-icon">🎉</div>
          <h2>Request Submitted!</h2>
          <p>Your subscription request has been submitted successfully. Our admin team will verify your payment and activate your seller account.</p>
          <p className="pending-note">You'll be notified once your account is activated.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="become-seller-page">
      <div className="container">
        {step === 0 && (
          <div className="seller-info-layout">
            <div className="seller-hero">
              <span className="seller-hero-icon">🏪</span>
              <h1>Sell on <span>ShopKart</span></h1>
              <p>Join thousands of sellers reaching millions of customers across India</p>
              <div className="seller-perks-grid">
                {SELLER_PERKS.map(perk => (
                  <div key={perk} className="perk-item">
                    <FiCheck className="perk-check" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
              <div className="seller-subscription-info">
                <div className="subscription-badge">
                  <span className="sub-price">₹399</span>
                  <span className="sub-period">/month</span>
                </div>
                <p>Simple monthly subscription. Cancel anytime.</p>
              </div>
              <button className="btn btn-secondary btn-lg" onClick={() => setStep(1)}>
                <FiBarChart2 /> Start Selling — ₹399/month
              </button>
            </div>

            <div className="seller-steps-card">
              <h3>How It Works</h3>
              <div className="how-steps">
                <div className="how-step"><span className="how-num">1</span><div><p className="how-title">Pay Subscription</p><p className="how-desc">Pay ₹399/month via UPI</p></div></div>
                <div className="how-step"><span className="how-num">2</span><div><p className="how-title">Submit Proof</p><p className="how-desc">Enter transaction ID & upload screenshot</p></div></div>
                <div className="how-step"><span className="how-num">3</span><div><p className="how-title">Admin Approval</p><p className="how-desc">Our team verifies within 4 hours</p></div></div>
                <div className="how-step"><span className="how-num">4</span><div><p className="how-title">Start Selling</p><p className="how-desc">Access seller dashboard & add products</p></div></div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="seller-payment-layout">
            <div className="payment-card">
              <h2>Complete Subscription Payment</h2>
              <p className="payment-subtitle">Pay ₹399 via UPI and enter the transaction details below</p>

              {/* UPI Options */}
              <div className="upi-apps">
                {[
                  { id: 'googlepay', name: 'Google Pay', emoji: '🅖' },
                  { id: 'phonepe', name: 'PhonePe', emoji: '📲' },
                  { id: 'upi', name: 'Other UPI', emoji: '₹' },
                ].map(app => (
                  <button key={app.id}
                    className={`upi-app-btn ${form.upiOption === app.id ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, upiOption: app.id })}>
                    <span>{app.emoji}</span>
                    <span>{app.name}</span>
                  </button>
                ))}
              </div>

              {/* Payment Details */}
              <div className="upi-payment-box">
                <div className="upi-info-row">
                  <FiInfo size={16} />
                  <p>Send <strong>₹399</strong> to UPI ID: <strong className="upi-id">mohnapranav-1@okaxis</strong></p>
                </div>

                <div className="qr-and-upi">
                  <div className="qr-box">
                    <div className="qr-grid">
                      {Array.from({ length: 49 }, (_, i) => (
                        <div key={i} className={`qr-cell ${[0,1,2,3,4,5,6,7,13,14,42,43,49,50,56,63,62,61,60,59,58,57,14,21,28,35].includes(i) || Math.random() > 0.55 ? 'qr-filled' : ''}`} />
                      ))}
                    </div>
                    <p>Scan to Pay</p>
                  </div>
                  <div className="upi-details-box">
                    <div className="upi-detail-row"><span>UPI ID:</span><strong>mohnapranav-1@okaxis</strong></div>
                    <div className="upi-detail-row"><span>Amount:</span><strong className="amount-text">₹399</strong></div>
                    <div className="upi-detail-row"><span>Purpose:</span><span>Seller Subscription</span></div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="form-group" style={{ marginTop: 20 }}>
                <label className="form-label">UPI Transaction ID *</label>
                <input className="form-input" value={form.transactionId}
                  onChange={e => setForm({ ...form, transactionId: e.target.value })}
                  placeholder="Enter transaction ID from your UPI app" />
              </div>

              <div className="form-group">
                <label className="form-label">Payment Screenshot <span className="optional">(Recommended)</span></label>
                <div className="file-upload-area">
                  <input type="file" id="sub-ss" accept="image/*"
                    onChange={e => setForm({ ...form, screenshot: e.target.files[0] })}
                    style={{ display: 'none' }} />
                  <label htmlFor="sub-ss" className="file-upload-label">
                    <FiUpload size={20} />
                    {form.screenshot ? <span className="file-selected">{form.screenshot.name}</span> : <span>Upload payment screenshot</span>}
                  </label>
                </div>
              </div>

              <div className="verification-note">
                <FiInfo size={16} />
                <p>Our admin team manually verifies all payments. Once verified, your role will be upgraded to <strong>SELLER</strong>. Payments are never auto-confirmed.</p>
              </div>

              <div className="payment-btn-row">
                <button className="btn btn-outline" onClick={() => setStep(0)}>← Back</button>
                <button className="btn btn-secondary btn-lg" onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Payment Proof'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BecomeSellerPage;
