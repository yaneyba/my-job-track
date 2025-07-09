// Cloudflare Worker environment types
export interface Env {
  DB: any; // D1Database type will be available at runtime
  CORS_ORIGIN?: string;
  ENVIRONMENT?: string;
  SLACK_WEBHOOK_URL?: string;
}

// Database types
export interface User {
  id: string;
  email: string;
  name: string;
  business_name?: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  user_id?: string; // For database association
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  business_name?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type JobStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Job {
  id: string;
  user_id: string;
  customer_id: string;
  title: string;
  description?: string;
  status: JobStatus;
  estimated_cost?: number;
  actual_cost?: number;
  estimated_hours?: number;
  actual_hours?: number;
  due_date?: string;
  paid: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  // Populated fields
  customer?: Partial<Customer>;
}

export interface Session {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface DashboardStats {
  totalCustomers: number;
  totalJobs: number;
  completedJobs: number;
  pendingJobs: number;
  totalRevenue: number;
  thisWeekEarnings: number;
  thisMonthEarnings: number;
  unpaidJobsCount: number;
  totalUnpaid: number;
  todaysJobs: Job[];
  recentJobs: Job[];
  upcomingJobs: Job[];
}

// API Request/Response types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: Omit<User, 'password_hash'>;
  error?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  business_name?: string;
}

// Job request types
export interface CreateJobRequest {
  customer_id: string;
  title: string;
  description?: string;
  status?: JobStatus;
  estimated_cost?: number;
  actual_cost?: number;
  estimated_hours?: number;
  actual_hours?: number;
  due_date?: string;
  paid?: boolean;
}

export interface UpdateJobRequest {
  title?: string;
  description?: string;
  status?: JobStatus;
  estimated_cost?: number;
  actual_cost?: number;
  estimated_hours?: number;
  actual_hours?: number;
  due_date?: string;
  paid?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Create types (without id, createdAt, updatedAt)
export type CreateCustomer = Omit<Customer, 'id' | 'created_at' | 'updated_at' | 'user_id'>;
export type UpdateCustomer = Partial<CreateCustomer>;

export type CreateJob = Omit<Job, 'id' | 'created_at' | 'updated_at' | 'customer'>;
export type UpdateJob = Partial<CreateJob>;

export type CreateUser = Omit<User, 'id' | 'created_at' | 'updated_at'>;

// Utility types
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Analytics Dashboard Data Types
export interface AnalyticsDashboardData {
  overview: AnalyticsOverview;
  sessions: AnalyticsSessionMetrics;
  events: AnalyticsEventMetrics;
  features: FeatureUsageMetrics;
  funnels: FunnelAnalytics;
  abTests: ABTestResults[];
}

export interface AnalyticsOverview {
  totalSessions: number;
  totalEvents: number;
  averageSessionDuration: number;
  conversionRate: number;
  demoModeUsage: number;
  topLandingPages: PageMetric[];
  topExitPages: PageMetric[];
  userTypeBreakdown: UserTypeMetric[];
}

export interface AnalyticsSessionMetrics {
  dailySessions: DailyMetric[];
  sessionDuration: SessionDurationMetric[];
  bounceRate: number;
  returnVisitorRate: number;
  geographicData: GeographicMetric[];
  deviceData: DeviceMetric[];
}

export interface AnalyticsEventMetrics {
  topEvents: EventMetric[];
  eventCategories: CategoryMetric[];
  conversionEvents: ConversionMetric[];
  dailyEvents: DailyMetric[];
}

export interface FeatureUsageMetrics {
  topFeatures: FeatureMetric[];
  featureAdoption: FeatureAdoptionMetric[];
  demoModeFeatures: FeatureMetric[];
}

export interface FunnelAnalytics {
  conversionFunnel: FunnelStep[];
  dropOffPoints: DropOffMetric[];
  averageTimeToConvert: number;
}

export interface ABTestResults {
  testName: string;
  variants: ABTestVariant[];
  conversionRates: Record<string, number>;
  significance: number;
  winner?: string;
}

// Metric Types
export interface PageMetric {
  page: string;
  views: number;
  percentage: number;
}

export interface UserTypeMetric {
  userType: string;
  count: number;
  percentage: number;
  conversionRate: number;
}

export interface DailyMetric {
  date: string;
  count: number;
  value?: number;
}

export interface SessionDurationMetric {
  range: string;
  count: number;
  percentage: number;
}

export interface GeographicMetric {
  country: string;
  sessions: number;
  percentage: number;
}

export interface DeviceMetric {
  device: string;
  sessions: number;
  percentage: number;
}

export interface EventMetric {
  eventName: string;
  count: number;
  uniqueSessions: number;
  conversionRate?: number;
}

export interface CategoryMetric {
  category: string;
  count: number;
  percentage: number;
}

export interface ConversionMetric {
  source: string;
  conversions: number;
  rate: number;
}

export interface FeatureMetric {
  featureName: string;
  usage: number;
  uniqueUsers: number;
  adoptionRate: number;
}

export interface FeatureAdoptionMetric {
  feature: string;
  weeklyUsage: DailyMetric[];
  trend: 'up' | 'down' | 'stable';
}

export interface FunnelStep {
  step: string;
  users: number;
  conversionRate: number;
  dropOffRate: number;
}

export interface DropOffMetric {
  step: string;
  dropOffs: number;
  percentage: number;
}

export interface ABTestVariant {
  name: string;
  users: number;
  conversions: number;
  conversionRate: number;
}

// Analytics Filters
export interface AnalyticsFilters {
  dateRange: {
    start: string;
    end: string;
  };
  userType?: string[];
  demoMode?: boolean;
  country?: string[];
  eventCategory?: string[];
}
