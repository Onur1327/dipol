const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Debug: API URL'ini logla
console.log('API_BASE_URL:', API_BASE_URL);

// Token'ı localStorage'dan al
const getToken = () => {
  return localStorage.getItem('token');
};

// Token'ı localStorage'a kaydet
const setToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

// API isteği yap
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log(`API Request: ${config.method || 'GET'} ${fullUrl}`);
    console.log('Request config:', { 
      method: config.method, 
      headers: config.headers,
      body: config.body ? (typeof config.body === 'string' ? config.body.substring(0, 100) : 'Object') : undefined
    });
    
    const response = await fetch(fullUrl, config);
    console.log('Response status:', response.status, response.statusText);
    
    // Response body'yi text olarak oku
    const text = await response.text();
    
    // Boş response kontrolü
    if (!text || text.trim() === '') {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return { success: true };
    }
    
    // JSON parse işlemi
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Response text:', text);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${text.substring(0, 100)}`);
      }
      throw new Error('Sunucudan geçersiz yanıt alındı.');
    }

    if (!response.ok) {
      const errorMessage = data.message || data.error || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Network hatası kontrolü
    if (error.name === 'TypeError' && (error.message.includes('fetch') || error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('internet'))) {
      console.error('Network hatası tespit edildi. Backend URL:', API_BASE_URL);
      console.error('Backend durumu kontrol ediliyor...');
      // Backend durumunu kontrol et
      fetch('http://localhost:3001/api/health')
        .then(res => res.json())
        .then(data => console.log('Backend health check:', data))
        .catch(err => console.error('Backend health check başarısız:', err));
      throw new Error('Sunucuya bağlanılamıyor. Backend sunucusunun çalıştığından emin olun (http://localhost:3001). Lütfen backend sunucusunu başlatın.');
    }
    // JSON parse hatası kontrolü
    if (error.message.includes('JSON') || error.message.includes('Unexpected end')) {
      throw new Error('Sunucudan geçersiz yanıt alındı. Backend sunucusunun düzgün çalıştığından emin olun.');
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: async (userData) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: userData,
    });
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },

  login: async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },

  getMe: async () => {
    return apiRequest('/auth/me');
  },

  logout: () => {
    setToken(null);
  },
};

// Products API
export const productsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/products${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return apiRequest(`/products/${id}`);
  },

  create: async (product) => {
    return apiRequest('/products', {
      method: 'POST',
      body: product,
    });
  },

  update: async (id, product) => {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: product,
    });
  },

  delete: async (id) => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  getStats: async () => {
    return apiRequest('/products/stats');
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    return apiRequest('/categories');
  },

  create: async (category) => {
    return apiRequest('/categories', {
      method: 'POST',
      body: category,
    });
  },

  update: async (id, category) => {
    return apiRequest(`/categories/${id}`, {
      method: 'PUT',
      body: category,
    });
  },

  delete: async (id) => {
    return apiRequest(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
};

// Orders API
export const ordersAPI = {
  create: async (orderData) => {
    return apiRequest('/orders', {
      method: 'POST',
      body: orderData,
    });
  },

  getMyOrders: async () => {
    return apiRequest('/orders/my-orders');
  },

  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/orders${queryString ? `?${queryString}` : ''}`);
  },

  updateStatus: async (id, status) => {
    return apiRequest(`/orders/${id}/status`, {
      method: 'PUT',
      body: { status },
    });
  },

  delete: async (id) => {
    return apiRequest(`/orders/${id}`, {
      method: 'DELETE',
    });
  },

  getStats: async () => {
    return apiRequest('/orders/stats');
  },
};

// Users API
export const usersAPI = {
  getAll: async () => {
    return apiRequest('/users');
  },

  delete: async (id) => {
    return apiRequest(`/users/${id}`, {
      method: 'DELETE',
    });
  },

  getStats: async () => {
    return apiRequest('/users/stats');
  },
};

// Cart API
export const cartAPI = {
  getCart: async () => {
    return apiRequest('/cart');
  },

  addToCart: async (productId, size, color, quantity = 1) => {
    return apiRequest('/cart', {
      method: 'POST',
      body: { productId, size, color, quantity },
    });
  },

  updateCartItem: async (itemId, quantity) => {
    return apiRequest(`/cart/${itemId}`, {
      method: 'PUT',
      body: { quantity },
    });
  },

  removeFromCart: async (itemId) => {
    return apiRequest(`/cart/${itemId}`, {
      method: 'DELETE',
    });
  },

  clearCart: async () => {
    return apiRequest('/cart', {
      method: 'DELETE',
    });
  },
};

export { getToken, setToken };

