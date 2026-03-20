import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMapPin, FiCreditCard, FiUpload, FiCheck, FiInfo } from 'react-icons/fi';
import { selectCartItems, selectCartTotal } from '../store/slices/cartSlice';
import { placeOrder, selectOrderLoading } from '../store/slices/orderSlice';
import { resetCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

const STEPS = ['Address', 'Payment', 'Review'];

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const loading = useSelector(selectOrderLoading);

  const [step, setStep] = useState(0);
  const [address, setAddress] = useState({ fullName: '', phone: '', pincode: '', addressLine1: '', addressLine2: '', city: '', state: '', country: 'India' });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [upiDetails, setUpiDetails] = useState({ transactionId: '', screenshot: null, upiOption: 'googlepay' });
  const [addrErrors, setAddrErrors] = useState({});

  const deliveryCharge = total >= 499 ? 0 : 49;
  const grandTotal = total + deliveryCharge;

  const validateAddress = () => {
    const e = {};
    if (!address.fullName.trim()) e.fullName = 'Required';
    if (!address.phone.trim() || !/^[6-9]\d{9}$/.test(address.phone)) e.phone = 'Valid 10-digit number required';
    if (!address.pincode.trim() || !/^\d{6}$/.test(address.pincode)) e.pincode = '6-digit pincode required';
    if (!address.addressLine1.trim()) e.addressLine1 = 'Required';
    if (!address.city.trim()) e.city = 'Required';
    if (!address.state.trim()) e.state = 'Required';
    setAddrErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && !validateAddress()) { toast.error('Please fill all address fields correctly'); return; }
    if (step === 1 && paymentMethod === 'UPI' && !upiDetails.transactionId.trim()) {
      toast.error('Please enter UPI Transaction ID'); return;
    }
    setStep(s => s + 1);
  };

  const handlePlaceOrder = async () => {
    const formData = new FormData();
    formData.append('addressJson', JSON.stringify(address));
    formData.append('paymentMethod', paymentMethod);
    formData.append('totalAmount', grandTotal);
    if (paymentMethod === 'UPI') {
      formData.append('transactionId', upiDetails.transactionId);
      if (upiDetails.screenshot) formData.append('paymentScreenshot', upiDetails.screenshot);
    }

    const result = await dispatch(placeOrder(formData));
    if (placeOrder.fulfilled.match(result)) {
      dispatch(resetCart());
      toast.success('Order placed successfully!');
      navigate(`/orders/${result.payload.id}`);
    } else {
      toast.error(result.payload || 'Failed to place order');
    }
  };

  if (items.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="checkout-page">
      <div className="container">
        {/* Progress Steps */}
        <div className="checkout-steps">
          {STEPS.map((s, i) => (
            <div key={s} className={`step-item ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <div className="step-circle">
                {i < step ? <FiCheck size={14} /> : <span>{i + 1}</span>}
              </div>
              <span className="step-label">{s}</span>
              {i < STEPS.length - 1 && <div className="step-line" />}
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          <div className="checkout-main">
            {/* Step 0: Address */}
            {step === 0 && (
              <div className="checkout-card">
                <h2><FiMapPin /> Delivery Address</h2>
                <div className="addr-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className={`form-input ${addrErrors.fullName ? 'error' : ''}`} value={address.fullName}
                      onChange={e => setAddress({ ...address, fullName: e.target.value })} placeholder="Your full name" />
                    {addrErrors.fullName && <span className="form-error">{addrErrors.fullName}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mobile Number *</label>
                    <input className={`form-input ${addrErrors.phone ? 'error' : ''}`} value={address.phone}
                      onChange={e => setAddress({ ...address, phone: e.target.value })} placeholder="10-digit mobile" />
                    {addrErrors.phone && <span className="form-error">{addrErrors.phone}</span>}
                  </div>
                  <div className="form-group addr-full">
                    <label className="form-label">Address Line 1 *</label>
                    <input className={`form-input ${addrErrors.addressLine1 ? 'error' : ''}`} value={address.addressLine1}
                      onChange={e => setAddress({ ...address, addressLine1: e.target.value })} placeholder="House No., Street, Area" />
                    {addrErrors.addressLine1 && <span className="form-error">{addrErrors.addressLine1}</span>}
                  </div>
                  <div className="form-group addr-full">
                    <label className="form-label">Address Line 2</label>
                    <input className="form-input" value={address.addressLine2}
                      onChange={e => setAddress({ ...address, addressLine2: e.target.value })} placeholder="Landmark, Colony (optional)" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input className={`form-input ${addrErrors.city ? 'error' : ''}`} value={address.city}
                      onChange={e => setAddress({ ...address, city: e.target.value })} placeholder="City" />
                    {addrErrors.city && <span className="form-error">{addrErrors.city}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <input className={`form-input ${addrErrors.state ? 'error' : ''}`} value={address.state}
                      onChange={e => setAddress({ ...address, state: e.target.value })} placeholder="State" />
                    {addrErrors.state && <span className="form-error">{addrErrors.state}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode *</label>
                    <input className={`form-input ${addrErrors.pincode ? 'error' : ''}`} value={address.pincode}
                      onChange={e => setAddress({ ...address, pincode: e.target.value })} placeholder="6-digit pincode" maxLength={6} />
                    {addrErrors.pincode && <span className="form-error">{addrErrors.pincode}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <input className="form-input" value={address.country} disabled />
                  </div>
                </div>
                <button className="btn btn-primary btn-lg" onClick={handleNext}>Continue to Payment →</button>
              </div>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <div className="checkout-card">
                <h2><FiCreditCard /> Payment Method</h2>

                <div className="payment-options">
                  {/* COD */}
                  <label className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`}>
                    <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')} />
                    <div className="payment-option-content">
                      <div className="payment-option-header">
                        <span className="payment-icon">💵</span>
                        <div>
                          <p className="payment-name">Cash on Delivery</p>
                          <p className="payment-desc">Pay when your order arrives</p>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* UPI */}
                  <label className={`payment-option ${paymentMethod === 'UPI' ? 'selected' : ''}`}>
                    <input type="radio" name="payment" value="UPI" checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')} />
                    <div className="payment-option-content">
                      <div className="payment-option-header">
                        <span className="payment-icon">📱</span>
                        <div>
                          <p className="payment-name">UPI / Online Payment</p>
                          <p className="payment-desc">Google Pay, PhonePe, UPI ID</p>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>

                {paymentMethod === 'UPI' && (
                  <div className="upi-details">
                    <div className="upi-apps">
                      {[
                        { id: 'googlepay', name: 'Google Pay', icon: '🅖' },
                        { id: 'phonepe', name: 'PhonePe', icon: '📲' },
                        { id: 'upi', name: 'UPI ID', icon: '₹' },
                      ].map(app => (
                        <button key={app.id}
                          className={`upi-app-btn ${upiDetails.upiOption === app.id ? 'active' : ''}`}
                          onClick={() => setUpiDetails({ ...upiDetails, upiOption: app.id })}>
                          <span className="upi-app-icon">{app.icon}</span>
                          <span>{app.name}</span>
                        </button>
                      ))}
                    </div>

                    <div className="upi-payment-info">
                      <div className="upi-info-banner">
                        <FiInfo size={16} />
                        <p>Transfer <strong>₹{grandTotal.toLocaleString('en-IN')}</strong> to UPI ID: <strong>mohnapranav-1@okaxis</strong></p>
                      </div>

                      <div className="upi-qr-section">
                        <div className="qr-placeholder">
                          <div className="qr-pattern">
                            {Array.from({ length: 25 }, (_, i) => (
                              <div key={i} className={`qr-cell ${Math.random() > 0.5 ? 'filled' : ''}`} />
                            ))}
                          </div>
                          <p className="qr-label">Scan to Pay</p>
                        </div>
                        <div className="upi-id-display">
                          <p className="upi-id-label">UPI ID</p>
                          <p className="upi-id-value">mohnapranav-1@okaxis</p>
                          <p className="upi-id-amount">Amount: ₹{grandTotal.toLocaleString('en-IN')}</p>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">UPI Transaction ID *</label>
                        <input className="form-input" value={upiDetails.transactionId}
                          onChange={e => setUpiDetails({ ...upiDetails, transactionId: e.target.value })}
                          placeholder="Enter 12-digit transaction ID after payment" />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Payment Screenshot <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none' }}>(optional but recommended)</span></label>
                        <div className="file-upload-area">
                          <input type="file" id="payment-ss" accept="image/*"
                            onChange={e => setUpiDetails({ ...upiDetails, screenshot: e.target.files[0] })}
                            style={{ display: 'none' }} />
                          <label htmlFor="payment-ss" className="file-upload-label">
                            <FiUpload size={20} />
                            {upiDetails.screenshot ? <span className="file-selected">{upiDetails.screenshot.name}</span> : <span>Click to upload screenshot</span>}
                          </label>
                        </div>
                      </div>

                      <div className="payment-pending-note">
                        <FiInfo size={16} />
                        <p>Your order will be in <strong>PENDING</strong> status until admin verifies the payment. This usually takes 1-4 hours during business days.</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="checkout-btn-row">
                  <button className="btn btn-outline" onClick={() => setStep(0)}>← Back</button>
                  <button className="btn btn-primary btn-lg" onClick={handleNext}>Review Order →</button>
                </div>
              </div>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <div className="checkout-card">
                <h2><FiCheck /> Review Your Order</h2>

                <div className="review-section">
                  <h4>Delivery Address</h4>
                  <div className="review-address">
                    <p><strong>{address.fullName}</strong> | {address.phone}</p>
                    <p>{address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}</p>
                    <p>{address.city}, {address.state} - {address.pincode}</p>
                    <p>{address.country}</p>
                  </div>
                </div>

                <div className="review-section">
                  <h4>Payment Method</h4>
                  <p className="review-payment">{paymentMethod === 'COD' ? '💵 Cash on Delivery' : `📱 UPI — TXN: ${upiDetails.transactionId}`}</p>
                </div>

                <div className="review-section">
                  <h4>Items ({items.length})</h4>
                  <div className="review-items">
                    {items.map(item => (
                      <div key={item.id} className="review-item">
                        <span className="review-item-name">{item.productName}</span>
                        <span className="review-item-qty">× {item.quantity}</span>
                        <span className="review-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="checkout-btn-row">
                  <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn btn-secondary btn-lg" onClick={handlePlaceOrder} disabled={loading}>
                    {loading ? 'Placing Order...' : '✓ Confirm & Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="checkout-sidebar">
            <div className="order-summary-card">
              <h3>ORDER SUMMARY</h3>
              <div className="summary-items">
                {items.map(item => (
                  <div key={item.id} className="summary-item">
                    <span className="summary-item-name">{item.productName}</span>
                    <span className="summary-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="summary-divider" />
              <div className="summary-row"><span>Items Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>
              <div className="summary-row"><span>Delivery</span><span style={{ color: deliveryCharge === 0 ? 'var(--accent-green)' : '' }}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span></div>
              <div className="summary-total"><span>Grand Total</span><span>₹{grandTotal.toLocaleString('en-IN')}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
