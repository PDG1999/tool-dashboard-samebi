/**
 * PostgREST Adapter
 * Übersetzt Express API Calls zu PostgREST Format
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper function for PostgREST API calls
async function postgrestCall(endpoint: string, options: RequestInit = {}) {
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
    const error = await response.json().catch(() => ({ message: 'API error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  // PostgREST returns empty body for some operations
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    // TODO: PostgREST login function muss noch erstellt werden
    // Für jetzt: Fallback auf Express API
    const response = await fetch('https://api-check.samebi.net/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Login fehlgeschlagen');
    }
    
    const data = await response.json();
    localStorage.setItem('auth_token', data.token);
    return data;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
  },

  getCurrentUser: async () => {
    return { 
      id: 'temp',
      name: 'Current User',
      email: 'user@example.com' 
    };
  },
};

// Test Results API (PostgREST)
export const testResultsAPI = {
  getAll: async () => {
    return postgrestCall('/test_results?order=created_at.desc');
  },

  getByClient: async (clientId: string) => {
    return postgrestCall(`/test_results?client_id=eq.${clientId}&order=created_at.desc`);
  },

  getById: async (id: string) => {
    const result = await postgrestCall(`/test_results?id=eq.${id}&limit=1`);
    return result[0] || null;
  },

  update: async (id: string, data: any) => {
    return postgrestCall(`/test_results?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  submit: async (data: any) => {
    return postgrestCall('/test_results', {
      method: 'POST',
      body: JSON.stringify({
        client_id: data.clientId || null,
        counselor_id: data.counselorId || null,
        responses: data.responses,
        public_scores: data.publicScores,
        professional_scores: data.professionalScores,
        risk_level: data.riskLevel,
        primary_concern: data.primaryConcern,
        tracking_data: data.trackingData,
        session_data: data.sessionData,
        aborted: data.aborted || false,
        aborted_at_question: data.abortedAtQuestion || null,
        completed_questions: data.completedQuestions || null,
      }),
    });
  },

  saveProgress: async (data: any) => {
    // Check if progress exists
    const existing = await postgrestCall(`/test_progress?session_id=eq.${data.sessionId}&limit=1`).catch(() => []);
    
    if (existing && existing.length > 0) {
      // Update existing
      return postgrestCall(`/test_progress?session_id=eq.${data.sessionId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          responses: data.responses,
          current_question: data.currentQuestion,
          last_saved_at: new Date().toISOString(),
        }),
      });
    } else {
      // Insert new
      return postgrestCall('/test_progress', {
        method: 'POST',
        body: JSON.stringify({
          session_id: data.sessionId,
          responses: data.responses,
          current_question: data.currentQuestion,
          test_type: data.testType || 'screening',
        }),
      });
    }
  },

  getProgress: async (sessionId: string) => {
    const result = await postgrestCall(`/test_progress?session_id=eq.${sessionId}&limit=1`);
    return result[0] || null;
  },

  getDashboardStats: async () => {
    // PostgREST kann keine custom stats berechnen - wir machen das Client-seitig
    const allTests = await postgrestCall('/test_results');
    return {
      totalTests: allTests.length,
      criticalCases: allTests.filter((t: any) => t.risk_level === 'critical').length,
      highRiskCases: allTests.filter((t: any) => t.risk_level === 'high').length,
    };
  },
};

// Clients API (PostgREST)
export const clientsAPI = {
  getAll: async () => {
    return postgrestCall('/clients?order=created_at.desc');
  },

  getById: async (id: string) => {
    const result = await postgrestCall(`/clients?id=eq.${id}&limit=1`);
    return result[0] || null;
  },

  create: async (data: any) => {
    return postgrestCall('/clients', {
      method: 'POST',
      body: JSON.stringify({
        counselor_id: data.counselorId,
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        notes: data.notes || null,
        status: 'active',
      }),
    });
  },

  update: async (id: string, data: any) => {
    return postgrestCall(`/clients?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return postgrestCall(`/clients?id=eq.${id}`, {
      method: 'DELETE',
    });
  },
};

// Counselors API (PostgREST)
export const counselorsAPI = {
  getStats: async () => {
    const counselors = await postgrestCall('/counselors');
    return {
      totalCounselors: counselors.length,
      activeCounselors: counselors.filter((c: any) => c.is_active).length,
    };
  },
};

// Export as default
export default {
  auth: authAPI,
  testResults: testResultsAPI,
  clients: clientsAPI,
  counselors: counselorsAPI,
};

