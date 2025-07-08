// API client for connecting to the Cloudflare D1 backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  business_name?: string;
}

export interface Customer {
  id: string;
  user_id?: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  business_name?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  user_id: string;
  customer_id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  estimated_cost?: number;
  actual_cost?: number;
  estimated_hours?: number;
  actual_hours?: number;
  due_date?: string;
  paid: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  customer?: Partial<Customer>;
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

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  // Auth endpoints
  async register(data: RegisterRequest): Promise<ApiResponse> {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<ApiResponse> {
    const response = await this.request<ApiResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.success && (response as any).token) {
      this.setToken((response as any).token);
    }

    return response;
  }

  async logout(): Promise<void> {
    if (this.token) {
      try {
        await this.request('/api/auth/logout', {
          method: 'POST',
        });
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        this.setToken(null);
      }
    }
  }

  // Customer endpoints
  async getCustomers(): Promise<Customer[]> {
    return this.request('/api/customers');
  }

  async getCustomer(id: string): Promise<Customer> {
    return this.request(`/api/customers/${id}`);
  }

  async createCustomer(data: Omit<Customer, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Customer> {
    return this.request('/api/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
    return this.request(`/api/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.request(`/api/customers/${id}`, {
      method: 'DELETE',
    });
  }

  // Job endpoints
  async getJobs(params?: {
    status?: string;
    customer_id?: string;
    limit?: number;
    offset?: number;
  }): Promise<Job[]> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/api/jobs?${queryString}` : '/api/jobs';
    
    return this.request(endpoint);
  }

  async getJob(id: string): Promise<Job> {
    return this.request(`/api/jobs/${id}`);
  }

  async createJob(data: {
    customer_id: string;
    title: string;
    description?: string;
    status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    estimated_cost?: number;
    actual_cost?: number;
    estimated_hours?: number;
    actual_hours?: number;
    due_date?: string;
    paid?: boolean;
  }): Promise<Job> {
    return this.request('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateJob(id: string, data: Partial<Job>): Promise<Job> {
    return this.request(`/api/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteJob(id: string): Promise<void> {
    await this.request(`/api/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  async getTodaysJobs(): Promise<Job[]> {
    return this.request('/api/jobs/today');
  }

  async getUnpaidJobs(): Promise<Job[]> {
    return this.request('/api/jobs/unpaid');
  }

  async getJobStats(): Promise<{
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
    total_revenue: number;
    unpaid_amount: number;
  }> {
    return this.request('/api/jobs/stats');
  }

  // Dashboard endpoints
  async getDashboardStats(): Promise<DashboardStats> {
    return this.request('/api/dashboard/stats');
  }

  async getRecentJobs(limit?: number): Promise<Job[]> {
    const endpoint = limit ? `/api/dashboard/jobs/recent?limit=${limit}` : '/api/dashboard/jobs/recent';
    return this.request(endpoint);
  }

  async getUpcomingJobs(days?: number): Promise<Job[]> {
    const endpoint = days ? `/api/dashboard/jobs/upcoming?days=${days}` : '/api/dashboard/jobs/upcoming';
    return this.request(endpoint);
  }

  async getMonthlyRevenue(year?: number): Promise<{ month: number; revenue: number }[]> {
    const endpoint = year ? `/api/dashboard/revenue/monthly?year=${year}` : '/api/dashboard/revenue/monthly';
    return this.request(endpoint);
  }

  // Waitlist endpoints
  async addToWaitlist(data: { email: string; businessType?: string; source?: string }): Promise<ApiResponse> {
    return this.request('/api/waitlist', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
