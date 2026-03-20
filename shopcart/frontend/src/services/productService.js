import api, { apiMultipart } from './api';

const productService = {
  getProducts: (params = {}) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  getFeaturedProducts: () => api.get('/products/featured'),
  getCategories: () => api.get('/categories'),
  searchProducts: (query) => api.get('/products/search', { params: { q: query } }),

  // Seller operations
  getSellerProducts: () => api.get('/seller/products'),
  createProduct: (formData) => apiMultipart.post('/seller/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateProduct: (id, formData) => apiMultipart.put(`/seller/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteProduct: (id) => api.delete(`/seller/products/${id}`),
};
export default productService;
