import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-top">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>ABOUT</h4>
            <ul>
              <li><Link to="#">Contact Us</Link></li>
              <li><Link to="#">About Us</Link></li>
              <li><Link to="#">Careers</Link></li>
              <li><Link to="#">Press</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>HELP</h4>
            <ul>
              <li><Link to="#">Payments</Link></li>
              <li><Link to="#">Shipping</Link></li>
              <li><Link to="#">Cancellation & Returns</Link></li>
              <li><Link to="#">FAQ</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>POLICY</h4>
            <ul>
              <li><Link to="#">Return Policy</Link></li>
              <li><Link to="#">Terms Of Use</Link></li>
              <li><Link to="#">Privacy</Link></li>
              <li><Link to="#">Security</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>SOCIAL</h4>
            <div className="social-links">
              <a href="#" className="social-link"><FiFacebook /> Facebook</a>
              <a href="#" className="social-link"><FiTwitter /> Twitter</a>
              <a href="#" className="social-link"><FiInstagram /> Instagram</a>
              <a href="#" className="social-link"><FiYoutube /> YouTube</a>
            </div>
          </div>
          <div className="footer-col">
            <h4>MAIL US</h4>
            <address>
              ShopKart Pvt. Ltd.,<br />
              Buildings Alyssa, Begonia &amp; Clove,<br />
              Embassy Tech Village,<br />
              Bengaluru 560 103, Karnataka, India
            </address>
          </div>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <div className="container">
        <div className="footer-bottom-inner">
          <span className="footer-logo">Shop<span>Kart</span></span>
          <span>&copy; {new Date().getFullYear()} ShopKart Private Limited</span>
          <div className="payment-icons">
            <span className="pay-badge">UPI</span>
            <span className="pay-badge">GPay</span>
            <span className="pay-badge">PhonePe</span>
            <span className="pay-badge">COD</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
