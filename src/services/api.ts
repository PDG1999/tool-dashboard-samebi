const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
}

// Test Results API
export const testResultsAPI = {
  // Submit a new test (public, no auth required)
  submit: async (data: {
    clientEmail?: string;
    clientName?: string;
    responses: any[];
    publicScores: any;
    professionalScores: any;
    riskLevel: string;
    primaryConcern: string;
    sessionData?: any;
  }) => {
    return apiCall('/test-results/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get all test results for counselor
  getAll: async () => {
    return apiCall('/test-results');
  },

  // Get test results for a specific client
  getByClient: async (clientId: string) => {
    return apiCall(`/test-results/client/${clientId}`);
  },

  // Get a single test result
  getById: async (id: string) => {
    return apiCall(`/test-results/${id}`);
  },

  // Update test result (add notes, follow-up)
  update: async (id: string, data: {
    sessionNotes?: string;
    followUpRequired?: boolean;
    followUpDate?: string;
  }) => {
    return apiCall(`/test-results/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Assign test result to counselor
  assign: async (id: string) => {
    return apiCall(`/test-results/${id}/assign`, {
      method: 'POST',
    });
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    return apiCall('/test-results/stats/dashboard');
  },
};

// Clients API
export const clientsAPI = {
  // Get all clients for counselor
  getAll: async () => {
    return apiCall('/clients');
  },

  // Get a single client
  getById: async (id: string) => {
    return apiCall(`/clients/${id}`);
  },

  // Create a new client
  create: async (data: {
    name: string;
    email?: string;
    phone?: string;
    notes?: string;
  }) => {
    return apiCall('/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update a client
  update: async (id: string, data: {
    name?: string;
    email?: string;
    phone?: string;
    status?: string;
    notes?: string;
  }) => {
    return apiCall(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete a client
  delete: async (id: string) => {
    return apiCall(`/clients/${id}`, {
      method: 'DELETE',
    });
  },
};

// Auth API
export const authAPI = {
  // Login
  login: async (email: string, password: string) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Register
  register: async (data: {
    name: string;
    email: string;
    password: string;
    practiceName?: string;
  }) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get current user
  getMe: async () => {
    return apiCall('/auth/me');
  },
};

// Counselors API
export const counselorsAPI = {
  // Get all counselors (supervisor only)
  getAll: async () => {
    return apiCall('/counselors');
  },
};

// Combined API object for easier imports
export const api = {
  getTestResults: testResultsAPI.getAll,
  getClients: clientsAPI.getAll,
  getCounselors: counselorsAPI.getAll,
  testResults: testResultsAPI,
  clients: clientsAPI,
  counselors: counselorsAPI,
  auth: authAPI,
};

export default api;

