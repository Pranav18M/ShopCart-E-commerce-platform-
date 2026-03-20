import api, { apiMultipart } from './api';

// ── Seller Service ──
export const sellerService = {
  requestSubscription: (formData) => apiMultipart.post('/seller/subscribe', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getSubscriptionStatus: () => api.get('/seller/subscription-status'),
  getSellerStats: () => api.get('/seller/stats'),
  getSellerOrders: () => api.get('/seller/orders'),
};

// ── Admin Service ──
const adminService = {
  getStats: () => api.get('/admin/stats'),
  getAllUsers: () => api.get('/admin/users'),
  getPendingSubscriptions: () => api.get('/admin/subscriptions/pending'),
  getAllSubscriptions: () => api.get('/admin/subscriptions'),
  approveSubscription: (id) => api.post(`/admin/subscriptions/${id}/approve`),
  rejectSubscription: (id) => api.post(`/admin/subscriptions/${id}/reject`),
  getPendingOrders: () => api.get('/admin/orders/pending-payment'),
  getAllOrders: () => api.get('/admin/orders'),
  approveOrderPayment: (id) => api.post(`/admin/orders/${id}/approve-payment`),
  rejectOrderPayment: (id) => api.post(`/admin/orders/${id}/reject-payment`),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
  getAllProducts: () => api.get('/admin/products'),
  approveProduct: (id) => api.post(`/admin/products/${id}/approve`),
  rejectProduct: (id) => api.post(`/admin/products/${id}/reject`),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  getCategories: () => api.get('/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
};
export default adminService;
