export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  counselorId: string;
  createdAt: Date;
  lastTestAt?: Date;
  status: 'active' | 'inactive' | 'archived';
  notes?: string;
}

export interface TestResult {
  id: string;
  clientId: string;
  counselorId: string;
  responses: Response[];
  publicScores: PublicScores;
  professionalScores: ProfessionalScores;
  completedAt: Date;
  sessionNotes?: string;
  followUpRequired: boolean;
  followUpDate?: Date;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  primaryConcern: string;
}

export interface Response {
  questionId: string;
  value: number;
}

export interface PublicScores {
  timeManagement: number;
  financialHealth: number;
  emotionalHealth: number;
  socialConnections: number;
  physicalHealth: number;
  overall: number;
}

export interface ProfessionalScores {
  gambling: number;
  alcohol: number;
  substances: number;
  shopping: number;
  digital: number;
  overall: number;
  primaryConcern: string;
  riskLevel: 'Niedrig' | 'Mittel' | 'Hoch' | 'Kritisch';
  consistency: number;
  confidence: number;
}

export interface Counselor {
  id: string;
  name: string;
  email: string;
  licenseNumber?: string;
  specialization?: string[];
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface DashboardStats {
  totalClients: number;
  totalTests: number;
  testsThisMonth: number;
  highRiskClients: number;
  averageRiskScore: number;
  mostCommonConcern: string;
  testsByMonth: { month: string; count: number }[];
  riskDistribution: { level: string; count: number }[];
}

export interface FilterOptions {
  dateRange: {
    start: Date;
    end: Date;
  };
  riskLevel: string[];
  concern: string[];
  counselorId?: string;
}
