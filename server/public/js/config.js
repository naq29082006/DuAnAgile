// Cùng server: dùng '' để gọi API cùng origin. Nếu tách frontend ra domain khác thì đổi thành địa chỉ API (vd: 'http://localhost:3000')
const API_CONFIG = {
  BASE_URL: '',
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
