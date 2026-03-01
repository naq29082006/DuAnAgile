// Tự động chọn BASE_URL: nếu mở từ localhost:3000 thì dùng '' (cùng origin), còn lại dùng http://localhost:3000
const API_CONFIG = {
  BASE_URL: (typeof window !== 'undefined' && window.location.port === '3000' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) ? '' : 'http://localhost:3000',
  ENDPOINTS: {
    products: '/api/products',
    productById: (id) => `/api/products/${id}`,
    categories: '/api/categories',
    categoryById: (id) => `/api/categories/${id}`,
    users: '/api/users',
    userById: (id) => `/api/users/${id}`,
  },
  // Timeout (ms)
  TIMEOUT: 10000,
};
