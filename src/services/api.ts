const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_URL || 'https://auth.samebi.net';

// Helper function for PostgREST API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...(options.method === 'POST' && { 'Prefer': 'return=representation' }),
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

  // PostgREST returns empty body for some operations
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// Test Results API (PostgREST)
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
    return apiCall('/test_results', {
      method: 'POST',
      body: JSON.stringify({
        client_id: null,
        counselor_id: null,
        responses: data.responses,
        public_scores: data.publicScores,
        professional_scores: data.professionalScores,
        risk_level: data.riskLevel,
        primary_concern: data.primaryConcern,
        session_data: data.sessionData,
      }),
    });
  },

  // Get all test results for counselor
  getAll: async () => {
    return apiCall('/test_results?order=created_at.desc&select=*,client:clients(name,email),counselor:counselors(name,email)');
  },

  // Get test results for a specific client
  getByClient: async (clientId: string) => {
    return apiCall(`/test_results?client_id=eq.${clientId}&order=created_at.desc`);
  },

  // Get a single test result
  getById: async (id: string) => {
    const result = await apiCall(`/test_results?id=eq.${id}&limit=1`);
    return result[0] || null;
  },

  // Update test result (add notes, follow-up)
  update: async (id: string, data: {
    sessionNotes?: string;
    followUpRequired?: boolean;
    followUpDate?: string;
  }) => {
    return apiCall(`/test_results?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        session_notes: data.sessionNotes,
        follow_up_required: data.followUpRequired,
        follow_up_date: data.followUpDate,
      }),
    });
  },

  // Assign test result to counselor
  assign: async (id: string) => {
    // Not implemented in PostgREST yet
    throw new Error('Not implemented');
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    const allTests = await apiCall('/test_results');
    return {
      totalTests: allTests.length,
      criticalCases: allTests.filter((t: any) => t.risk_level === 'critical').length,
      highRiskCases: allTests.filter((t: any) => t.risk_level === 'high').length,
    };
  },
};

// Clients API (PostgREST)
export const clientsAPI = {
  // Get all clients for counselor
  getAll: async () => {
    return apiCall('/clients?order=created_at.desc');
  },

  // Get a single client
  getById: async (id: string) => {
    const result = await apiCall(`/clients?id=eq.${id}&limit=1`);
    return result[0] || null;
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
      body: JSON.stringify({
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        notes: data.notes || null,
        status: 'active',
      }),
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
    return apiCall(`/clients?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Delete a client
  delete: async (id: string) => {
    return apiCall(`/clients?id=eq.${id}`, {
      method: 'DELETE',
    });
  },
};

// Auth API (Dedicated Auth Service)
export const authAPI = {
  // Login via dedicated Auth Service
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${AUTH_SERVICE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Login failed' }));
        throw new Error(error.error || error.message || `Login failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Store token
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Verify token
  verify: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No token found');
    }

    try {
      const response = await fetch(`${AUTH_SERVICE_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Token verification failed');
      }

      const data = await response.json();
      return data.valid;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  },

  // Register (ready for future use)
  register: async (data: {
    name: string;
    email: string;
    password: string;
    practiceName?: string;
  }) => {
    try {
      const response = await fetch(`${AUTH_SERVICE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Registration failed' }));
        throw new Error(error.error || error.message || 'Registration failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Get current user from token
  getMe: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    // Decode JWT token to get user info
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.user_id,
        email: payload.email,
        role: payload.role,
        name: payload.name,
      };
    } catch (e) {
      console.error('Token decode error:', e);
      throw new Error('Invalid token');
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('auth_token');
  },
};

// Counselors API (PostgREST)
export const counselorsAPI = {
  // Get all counselors (supervisor only)
  getAll: async () => {
    return apiCall('/counselors?order=created_at.desc&select=*,total_clients,total_tests,avg_risk_score');
  },
  
  // Get counselor statistics (supervisor only)
  getStats: async () => {
    const counselors = await apiCall('/counselors');
    return {
      totalCounselors: counselors.length,
      activeCounselors: counselors.filter((c: any) => c.is_active).length,
    };
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

