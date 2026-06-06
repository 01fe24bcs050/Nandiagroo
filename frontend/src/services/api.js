const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const normalizeEndpoint = (endpoint) => {
  if (endpoint.startsWith('http')) return endpoint;
  const cleanEndpoint = endpoint.startsWith('/api/')
    ? endpoint.slice(4)
    : endpoint;
  return `${API_URL}${cleanEndpoint.startsWith('/') ? cleanEndpoint : `/${cleanEndpoint}`}`;
};

const request = async (endpoint, options = {}) => {
  const response = await fetch(normalizeEndpoint(endpoint), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const error = new Error(data?.message || data?.details || 'Request failed');
    error.response = { status: response.status, data };
    throw error;
  }

  return { data };
};

export const authService = {
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  register: async (name, email, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  },

  getProfile: async (token) => {
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  forgotPassword: async (email) => {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to send OTP');
    return data;
  },

  resetPassword: async (email, otp, password) => {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to reset password');
    return data;
  },
};

export const productService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.brand) params.append('brand', filters.brand);
    if (filters.search) params.append('search', filters.search);

    const response = await fetch(`${API_URL}/products?${params}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) throw new Error('Product not found');
    return response.json();
  },

  create: async (productData, token) => {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  },
};

export const cartService = {
  getCart: async (token) => {
    const response = await fetch(`${API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch cart');
    return response.json();
  },

  addToCart: async (productId, quantity, token) => {
    const response = await fetch(`${API_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity }),
    });
    if (!response.ok) throw new Error('Failed to add to cart');
    return response.json();
  },

  updateCartItem: async (productId, quantity, token) => {
    const response = await fetch(`${API_URL}/cart/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity }),
    });
    if (!response.ok) throw new Error('Failed to update cart');
    return response.json();
  },

  removeFromCart: async (productId, token) => {
    const response = await fetch(`${API_URL}/cart/remove/${productId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to remove from cart');
    return response.json();
  },

  clearCart: async (token) => {
    const response = await fetch(`${API_URL}/cart/clear`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to clear cart');
    return response.json();
  },
};

export const orderService = {
  createOrder: async (orderData, token) => {
    try {
      // Log the full order data for debugging
      console.log('Sending Order Data:', {
        orderData,
        tokenPresent: !!token,
        tokenLength: token ? token.length : 0
      });

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      // More detailed error handling
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Order Creation Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(errorText || 'Failed to create order');
      }

      return response.json();
    } catch (error) {
      console.error('Detailed Order Creation Error:', {
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  },

  getMyOrders: async (token) => {
    const response = await fetch(`${API_URL}/orders/myorders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  getOrderById: async (id, token) => {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Order not found');
    return response.json();
  },

  cancelOrder: async (id, token) => {
    const response = await fetch(`${API_URL}/orders/${id}/cancel`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to cancel order');
    return data;
  },
};

export const queryService = {
  create: async (queryData) => request('/queries', {
    method: 'POST',
    body: JSON.stringify(queryData),
  }),

  getAll: async () => request('/queries'),

  getMy: async () => request('/queries/my'),

  update: async (id, queryData) => request(`/queries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(queryData),
  }),

  delete: async (id) => request(`/queries/${id}`, {
    method: 'DELETE',
  }),
};

export const testimonialService = {
  getAll: async () => request('/testimonials/all'),

  delete: async (id) => request(`/testimonials/${id}`, {
    method: 'DELETE',
  }),
};

export const reviewService = {
  create: async (reviewData, token) => {
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to submit review');
    return data;
  },

  update: async (id, reviewData, token) => {
    const response = await fetch(`${API_URL}/reviews/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update review');
    return data;
  },

  getByProduct: async (productId) => {
    const response = await fetch(`${API_URL}/reviews/product/${productId}`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
  },

  getMy: async (token) => {
    const response = await fetch(`${API_URL}/reviews/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch my reviews');
    return response.json();
  },
};

export const themeService = {
  getActive: async () => {
    const response = await fetch(`${API_URL}/themes/active`);
    if (!response.ok) throw new Error('Failed to fetch active theme');
    return response.json();
  },

  getAll: async (token) => {
    const response = await fetch(`${API_URL}/themes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch themes');
    return response.json();
  },

  create: async (themeData, token) => {
    const response = await fetch(`${API_URL}/themes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(themeData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create theme');
    return data;
  },

  update: async (id, themeData, token) => {
    const response = await fetch(`${API_URL}/themes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(themeData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update theme');
    return data;
  },

  delete: async (id, token) => {
    const response = await fetch(`${API_URL}/themes/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete theme');
    return data;
  },

  activate: async (id, token) => {
    const response = await fetch(`${API_URL}/themes/${id}/activate`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to activate theme');
    return data;
  },
};

const api = {
  authService,
  productService,
  cartService,
  orderService,
  queryService,
  testimonialService,
  reviewService,
  themeService,
  get: (endpoint) => request(endpoint),
  post: (endpoint, data) => request(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: (endpoint, data) => request(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (endpoint) => request(endpoint, {
    method: 'DELETE',
  }),
};

export default api;
