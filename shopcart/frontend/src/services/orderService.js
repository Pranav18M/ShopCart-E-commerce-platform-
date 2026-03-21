import api, { apiMultipart } from './api';

const orderService = {
  getMyOrders: () => api.get('/orders/my'),
  getOrderById: (id) => api.get(`/orders/${id}`),

  placeOrder: (formData) => {
    // Always send as multipart/form-data since backend uses @RequestParam
    return apiMultipart.post('/orders', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  cancelOrder: (id) => api.post(`/orders/${id}/cancel`),
};

export default orderService;