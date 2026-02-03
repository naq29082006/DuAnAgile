const API = {
  async request(path, options = {}) {
    const url = `${API_CONFIG.BASE_URL}${path}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      if (res.status === 204 || !text) return null;
      return JSON.parse(text);
    } catch (e) {
      clearTimeout(timeout);
      throw e;
    }
  },

  async getProducts(params = '', options = {}) {
    const sp = new URLSearchParams(typeof params === 'string' ? params : params);
    if (options.deleted) sp.set('deleted', '1');
    const q = sp.toString();
    return this.request(API_CONFIG.ENDPOINTS.products + (q ? '?' + q : ''));
  },

  async getProduct(id) {
    return this.request(API_CONFIG.ENDPOINTS.productById(id));
  },

  async createProduct(data) {
    return this.request(API_CONFIG.ENDPOINTS.products, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProduct(id, data) {
    return this.request(API_CONFIG.ENDPOINTS.productById(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteProduct(id, permanent = false) {
    const path = API_CONFIG.ENDPOINTS.productById(id) + (permanent ? '?permanent=1' : '');
    return this.request(path, { method: 'DELETE' });
  },

  async restoreProduct(id) {
    return this.request(API_CONFIG.ENDPOINTS.productById(id), {
      method: 'PUT',
      body: JSON.stringify({ isDeleted: 0 }),
    });
  },

  async getCategories(withCount = false, deleted = false) {
    const q = new URLSearchParams();
    if (withCount) q.set('withCount', '1');
    if (deleted) q.set('deleted', '1');
    const s = q.toString();
    return this.request(API_CONFIG.ENDPOINTS.categories + (s ? '?' + s : ''));
  },

  async getCategory(id) {
    return this.request(API_CONFIG.ENDPOINTS.categoryById(id));
  },

  async createCategory(data) {
    return this.request(API_CONFIG.ENDPOINTS.categories, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateCategory(id, data) {
    return this.request(API_CONFIG.ENDPOINTS.categoryById(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteCategory(id, permanent = false) {
    const path = API_CONFIG.ENDPOINTS.categoryById(id) + (permanent ? '?permanent=1' : '');
    return this.request(path, { method: 'DELETE' });
  },

  async restoreCategory(id) {
    return this.request(API_CONFIG.ENDPOINTS.categoryById(id), {
      method: 'PUT',
      body: JSON.stringify({ isDeleted: 0 }),
    });
  },

  async getUsers(deleted = false) {
    const path = API_CONFIG.ENDPOINTS.users + (deleted ? '?deleted=1' : '');
    return this.request(path);
  },

  async getUser(id) {
    return this.request(API_CONFIG.ENDPOINTS.userById(id));
  },

  async deleteUser(id, permanent = false, reason = '') {
    const path = API_CONFIG.ENDPOINTS.userById(id) + (permanent ? '?permanent=1' : '');
    return this.request(path, {
      method: 'DELETE',
      body: reason ? JSON.stringify({ reason }) : undefined,
    });
  },

  async restoreUser(id) {
    return this.request(API_CONFIG.ENDPOINTS.userById(id), {
      method: 'PUT',
      body: JSON.stringify({ isDeleted: 0 }),
    });
  },
};
