// User Tracking & Session Management

export interface UserSession {
  sessionId: string;
  fingerprint: string;
  ipAddress?: string;
  userAgent: string;
  screenResolution: string;
  timezone: string;
  language: string;
  geolocation?: {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
  };
  browserInfo: {
    browser: string;
    version: string;
    os: string;
    isMobile: boolean;
  };
  firstVisit: string;
  lastVisit: string;
  visitCount: number;
}

export interface QuestionMetrics {
  questionId: string;
  startTime: number;
  endTime?: number;
  timeSpent?: number;
  answerChanges: number;
  initialAnswer?: number;
  finalAnswer?: number;
  scrolledToBottom: boolean;
  focusLost: number;
}

export interface TestSession {
  sessionId: string;
  userSession: UserSession;
  startTime: number;
  endTime?: number;
  totalTime?: number;
  questionMetrics: QuestionMetrics[];
  completed: boolean;
  abortedAt?: string;
  resumeCount: number;
}

// Generate Browser Fingerprint
export function generateFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Browser Fingerprint', 2, 2);
  }
  
  const fingerprint = {
    canvas: canvas.toDataURL(),
    userAgent: navigator.userAgent,
    language: navigator.language,
    languages: navigator.languages,
    platform: navigator.platform,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: (navigator as any).deviceMemory,
    screenResolution: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth,
    pixelRatio: window.devicePixelRatio,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: new Date().getTimezoneOffset(),
    touchSupport: 'ontouchstart' in window,
    fonts: detectFonts(),
  };
  
  return hashCode(JSON.stringify(fingerprint));
}

// Detect installed fonts
function detectFonts(): string[] {
  const baseFonts = ['monospace', 'sans-serif', 'serif'];
  const testFonts = [
    'Arial', 'Verdana', 'Courier New', 'Georgia', 'Times New Roman',
    'Comic Sans MS', 'Impact', 'Trebuchet MS', 'Helvetica', 'Tahoma'
  ];
  
  const detected: string[] = [];
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return detected;
  
  baseFonts.forEach(baseFont => {
    const baseWidth = ctx.measureText('mmmmmmmmmmlli').width;
    
    testFonts.forEach(testFont => {
      ctx.font = `72px ${testFont}, ${baseFont}`;
      const testWidth = ctx.measureText('mmmmmmmmmmlli').width;
      
      if (testWidth !== baseWidth) {
        detected.push(testFont);
      }
    });
  });
  
  return detected;
}

// Simple hash function
function hashCode(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// Get or create session ID
export function getOrCreateSessionId(): string {
  let sessionId = localStorage.getItem('samebi_session_id');
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('samebi_session_id', sessionId);
  }
  
  return sessionId;
}

// Get User Session Info
export async function getUserSession(): Promise<UserSession> {
  const sessionId = getOrCreateSessionId();
  const fingerprint = generateFingerprint();
  
  // Try to get geolocation (optional)
  let geolocation: UserSession['geolocation'] | undefined;
  
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
    });
    
    geolocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp,
    };
  } catch (error) {
    console.log('Geolocation not available or denied');
  }
  
  // Parse user agent
  const ua = navigator.userAgent;
  const browserInfo = {
    browser: getBrowser(ua),
    version: getBrowserVersion(ua),
    os: getOS(ua),
    isMobile: /Mobile|Android|iPhone/i.test(ua),
  };
  
  // Get or update visit tracking
  const existingSession = localStorage.getItem('samebi_user_session');
  let visitCount = 1;
  let firstVisit = new Date().toISOString();
  
  if (existingSession) {
    const parsed = JSON.parse(existingSession);
    visitCount = (parsed.visitCount || 0) + 1;
    firstVisit = parsed.firstVisit || firstVisit;
  }
  
  const userSession: UserSession = {
    sessionId,
    fingerprint,
    userAgent: ua,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    geolocation,
    browserInfo,
    firstVisit,
    lastVisit: new Date().toISOString(),
    visitCount,
  };
  
  // Save to localStorage
  localStorage.setItem('samebi_user_session', JSON.stringify(userSession));
  
  return userSession;
}

// Helper functions
function getBrowser(ua: string): string {
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  if (ua.includes('Opera')) return 'Opera';
  return 'Unknown';
}

function getBrowserVersion(ua: string): string {
  const match = ua.match(/(Firefox|Chrome|Safari|Edge|Opera)\/(\d+)/);
  return match ? match[2] : 'Unknown';
}

function getOS(ua: string): string {
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac')) return 'MacOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'Unknown';
}

// Question Metrics Tracker
export class QuestionMetricsTracker {
  private metrics: Map<string, QuestionMetrics> = new Map();
  private currentQuestion: string | null = null;
  private focusLostCount = 0;
  
  constructor() {
    // Track focus lost
    window.addEventListener('blur', () => {
      if (this.currentQuestion) {
        this.focusLostCount++;
        const metric = this.metrics.get(this.currentQuestion);
        if (metric) {
          metric.focusLost = this.focusLostCount;
        }
      }
    });
    
    // Track scroll
    window.addEventListener('scroll', () => {
      if (this.currentQuestion) {
        const metric = this.metrics.get(this.currentQuestion);
        if (metric) {
          const scrolledToBottom = 
            window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
          metric.scrolledToBottom = scrolledToBottom;
        }
      }
    });
  }
  
  startQuestion(questionId: string) {
    this.currentQuestion = questionId;
    this.focusLostCount = 0;
    
    if (!this.metrics.has(questionId)) {
      this.metrics.set(questionId, {
        questionId,
        startTime: Date.now(),
        answerChanges: 0,
        scrolledToBottom: false,
        focusLost: 0,
      });
    }
  }
  
  recordAnswer(questionId: string, answer: number) {
    const metric = this.metrics.get(questionId);
    
    if (metric) {
      if (metric.initialAnswer === undefined) {
        metric.initialAnswer = answer;
      } else if (metric.finalAnswer !== answer) {
        metric.answerChanges++;
      }
      
      metric.finalAnswer = answer;
      metric.endTime = Date.now();
      metric.timeSpent = metric.endTime - metric.startTime;
    }
  }
  
  getMetrics(): QuestionMetrics[] {
    return Array.from(this.metrics.values());
  }
  
  getQuestionMetric(questionId: string): QuestionMetrics | undefined {
    return this.metrics.get(questionId);
  }
}

// Test Session Tracker
export class TestSessionTracker {
  private session: TestSession;
  private metricsTracker: QuestionMetricsTracker;
  
  constructor(userSession: UserSession) {
    this.metricsTracker = new QuestionMetricsTracker();
    
    // Try to load existing session
    const existingSession = localStorage.getItem('samebi_test_session');
    
    if (existingSession) {
      this.session = JSON.parse(existingSession);
      this.session.resumeCount++;
    } else {
      this.session = {
        sessionId: userSession.sessionId,
        userSession,
        startTime: Date.now(),
        questionMetrics: [],
        completed: false,
        resumeCount: 0,
      };
    }
    
    this.save();
  }
  
  startQuestion(questionId: string) {
    this.metricsTracker.startQuestion(questionId);
  }
  
  recordAnswer(questionId: string, answer: number) {
    this.metricsTracker.recordAnswer(questionId, answer);
    this.save();
  }
  
  complete() {
    this.session.endTime = Date.now();
    this.session.totalTime = this.session.endTime - this.session.startTime;
    this.session.completed = true;
    this.session.questionMetrics = this.metricsTracker.getMetrics();
    this.save();
  }
  
  abort(currentQuestion: string) {
    this.session.abortedAt = currentQuestion;
    this.session.questionMetrics = this.metricsTracker.getMetrics();
    this.save();
  }
  
  getSession(): TestSession {
    this.session.questionMetrics = this.metricsTracker.getMetrics();
    return this.session;
  }
  
  private save() {
    localStorage.setItem('samebi_test_session', JSON.stringify(this.session));
  }
  
  static clearSession() {
    localStorage.removeItem('samebi_test_session');
  }
}

