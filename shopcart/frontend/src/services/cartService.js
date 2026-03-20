import api, { apiMultipart } from './api';

// ── Cart Service ──
const cartService = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity) => api.post('/cart/add', { productId, quantity }),
  updateCartItem: (cartItemId, quantity) => api.put(`/cart/update/${cartItemId}`, { quantity }),
  removeCartItem: (cartItemId) => api.delete(`/cart/remove/${cartItemId}`),
  clearCart: () => api.delete('/cart/clear'),
};
export default cartService;
