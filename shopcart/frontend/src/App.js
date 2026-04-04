import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import SplashScreen from './components/common/SplashScreen';
import './styles/global.css';

const HomePage          = lazy(() => import('./pages/HomePage'));
const LoginPage         = lazy(() => import('./pages/LoginPage'));
const RegisterPage      = lazy(() => import('./pages/RegisterPage'));
const ProductListPage   = lazy(() => import('./pages/ProductListPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage          = lazy(() => import('./pages/CartPage'));
const CheckoutPage      = lazy(() => import('./pages/CheckoutPage'));
const OrdersPage        = lazy(() => import('./pages/OrdersPage'));
const OrderDetailPage   = lazy(() => import('./pages/OrderDetailPage'));
const ProfilePage       = lazy(() => import('./pages/ProfilePage'));
const BecomeSellerPage  = lazy(() => import('./pages/BecomeSellerPage'));
const SellerDashboard   = lazy(() => import('./pages/SellerDashboard'));
const AdminDashboard    = lazy(() => import('./pages/AdminDashboard'));
const NotFoundPage      = lazy(() => import('./pages/NotFoundPage'));

const PageWrapper = ({ children }) => (
  <div className="page-enter">{children}</div>
);

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <Routes>
        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><RegisterPage /></PageWrapper>} />
        <Route path="/products" element={<PageWrapper><ProductListPage /></PageWrapper>} />
        <Route path="/products/:id" element={<PageWrapper><ProductDetailPage /></PageWrapper>} />
        <Route path="/cart" element={<ProtectedRoute><PageWrapper><CartPage /></PageWrapper></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><PageWrapper><CheckoutPage /></PageWrapper></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><PageWrapper><OrdersPage /></PageWrapper></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><PageWrapper><OrderDetailPage /></PageWrapper></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><PageWrapper><ProfilePage /></PageWrapper></ProtectedRoute>} />
        <Route path="/become-seller" element={<ProtectedRoute><PageWrapper><BecomeSellerPage /></PageWrapper></ProtectedRoute>} />
        <Route path="/seller/*" element={
          <ProtectedRoute requiredRole="SELLER">
            <PageWrapper><SellerDashboard /></PageWrapper>
          </ProtectedRoute>
        } />
        <Route path="/admin/*" element={
          <ProtectedRoute requiredRole="ADMIN">
            <PageWrapper><AdminDashboard /></PageWrapper>
          </ProtectedRoute>
        } />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  const [showSplash, setShowSplash] = React.useState(() => {
    return !sessionStorage.getItem('splashShown');
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('splashShown', 'true');
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <Provider store={store}>
        <AuthProvider>
          <CartProvider>
            <Router>
              <div className="app-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar />
                <main style={{ flex: 1, paddingTop: 'var(--navbar-height)' }}>
                  <AppRoutes />
                </main>
                <Footer />
              </div>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    borderRadius: '8px',
                    fontFamily: 'var(--font-main)',
                    fontSize: '14px',
                    fontWeight: '600',
                  },
                  success: { style: { background: '#388e3c', color: '#fff' } },
                  error: { style: { background: '#d32f2f', color: '#fff' } },
                }}
              />
            </Router>
          </CartProvider>
        </AuthProvider>
      </Provider>
    </>
  );
}

export default App;
