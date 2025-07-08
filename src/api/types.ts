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
