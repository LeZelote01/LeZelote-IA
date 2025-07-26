import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, logout user
      localStorage.removeItem('authToken');
      localStorage.removeItem('lezelote-user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
  
  updateCurrentUser: async (userData) => {
    const response = await api.put('/api/auth/me', userData);
    return response.data;
  }
};

// Dashboard API
export const dashboardAPI = {
  getDashboard: async () => {
    const response = await api.get('/api/dashboard');
    return response.data;
  }
};

// Workflows API
export const workflowsAPI = {
  getWorkflows: async (params = {}) => {
    const response = await api.get('/api/workflows', { params });
    return response.data;
  },
  
  getWorkflow: async (id) => {
    const response = await api.get(`/api/workflows/${id}`);
    return response.data;
  },
  
  createWorkflow: async (workflowData) => {
    const response = await api.post('/api/workflows', workflowData);
    return response.data;
  },
  
  updateWorkflow: async (id, workflowData) => {
    const response = await api.put(`/api/workflows/${id}`, workflowData);
    return response.data;
  },
  
  deleteWorkflow: async (id) => {
    const response = await api.delete(`/api/workflows/${id}`);
    return response.data;
  }
};

// Documents API
export const documentsAPI = {
  getDocuments: async (params = {}) => {
    const response = await api.get('/api/documents', { params });
    return response.data;
  },
  
  getDocument: async (id) => {
    const response = await api.get(`/api/documents/${id}`);
    return response.data;
  },
  
  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  },
  
  processDocument: async (id) => {
    const response = await api.post(`/api/documents/${id}/process`);
    return response.data;
  }
};

// Leads API
export const leadsAPI = {
  getLeads: async (params = {}) => {
    const response = await api.get('/api/leads', { params });
    return response.data;
  },
  
  getLead: async (id) => {
    const response = await api.get(`/api/leads/${id}`);
    return response.data;
  },
  
  createLead: async (leadData) => {
    const response = await api.post('/api/leads', leadData);
    return response.data;
  },
  
  updateLead: async (id, leadData) => {
    const response = await api.put(`/api/leads/${id}`, leadData);
    return response.data;
  }
};

// Email Campaigns API
export const campaignsAPI = {
  getCampaigns: async (params = {}) => {
    const response = await api.get('/api/email-campaigns', { params });
    return response.data;
  },
  
  createCampaign: async (campaignData) => {
    const response = await api.post('/api/email-campaigns', campaignData);
    return response.data;
  }
};

// Support Tickets API
export const supportAPI = {
  getTickets: async (params = {}) => {
    const response = await api.get('/api/tickets', { params });
    return response.data;
  },
  
  createTicket: async (ticketData) => {
    const response = await api.post('/api/tickets', ticketData);
    return response.data;
  }
};

// Chat API
export const chatAPI = {
  sendMessage: async (message, model = 'GPT-4') => {
    const response = await api.post('/api/chat', {
      message,
      sender: 'user',
      type: 'text',
      model
    });
    return response.data;
  }
};

// Analytics API
export const analyticsAPI = {
  getAnalytics: async (days = 30) => {
    const response = await api.get('/api/analytics', { params: { days } });
    return response.data;
  }
};

// API Keys API
export const apiKeysAPI = {
  getApiKeys: async () => {
    const response = await api.get('/api/api-keys');
    return response.data;
  },
  
  createApiKey: async (keyData) => {
    const response = await api.post('/api/api-keys', keyData);
    return response.data;
  }
};

// Integrations API
export const integrationsAPI = {
  getIntegrations: async () => {
    const response = await api.get('/api/integrations');
    return response.data;
  }
};

// AI Models API
export const aiModelsAPI = {
  getAiModels: async () => {
    const response = await api.get('/api/ai-models');
    return response.data;
  }
};

export default api;