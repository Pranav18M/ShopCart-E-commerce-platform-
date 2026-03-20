import api, { apiMultipart } from './api';

const orderService = {
  getMyOrders: () => api.get('/orders/my'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  placeOrder: (orderData) => {
    if (orderData.paymentScreenshot) {
      const formData = new FormData();
      Object.keys(orderData).forEach(key => {
        if (key === 'paymentScreenshot') {
          formData.append(key, orderData[key]);
        } else if (typeof orderData[key] === 'object') {
          formData.append(key, JSON.stringify(orderData[key]));
        } else {
          formData.append(key, orderData[key]);
        }
      });
      return apiMultipart.post('/orders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.post('/orders', orderData);
  },
  cancelOrder: (id) => api.post(`/orders/${id}/cancel`),
};
export default orderService;
