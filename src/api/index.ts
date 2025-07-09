// Main Cloudflare Worker API entry point
import { Env, AnalyticsFilters } from './types';
import { corsHeaders, handleCors } from './utils/cors';
import { AuthService } from './services/auth';
import { CustomerService } from './services/customers';
import { JobService } from './services/jobs';
import { DashboardService } from './services/dashboard';
import { AnalyticsService } from './services/analytics';
import { handleWaitlistRequest } from './services/waitlist-handler';
import { handleSpamMonitoringRequest } from './services/spam-monitoring';
import { handleAnalyticsTrack, handleSessionInit, handleAnalyticsQuery } from './analytics-handler';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return handleCors(request);
    }

    try {
      const url = new URL(request.url);
      const path = url.pathname;

      // Initialize services
      const authService = new AuthService(env.DB);
      const customerService = new CustomerService(env.DB);
      const jobService = new JobService(env.DB);
      const dashboardService = new DashboardService(env.DB);
      const analyticsService = new AnalyticsService(env.DB);

      // Route requests
      if (path.startsWith('/api/auth/')) {
        return await handleAuthRoutes(request, authService, path);
      } else if (path.startsWith('/api/customers')) {
        return await handleCustomerRoutes(request, customerService, authService, path);
      } else if (path.startsWith('/api/jobs')) {
        return await handleJobRoutes(request, jobService, authService, path);
      } else if (path.startsWith('/api/dashboard')) {
        return await handleDashboardRoutes(request, dashboardService, authService, path);
      } else if (path.startsWith('/api/analytics/') && (path.includes('/dashboard') || path.includes('/overview') || path.includes('/sessions') || path.includes('/events') || path.includes('/features') || path.includes('/funnels') || path.includes('/ab-tests'))) {
        return await handleAnalyticsDataRoutes(request, analyticsService, authService, path);
      } else if (path.startsWith('/api/analytics/')) {
        return await handleAnalyticsRoutes(request, path, env);
      } else if (path.startsWith('/api/waitlist')) {
        return await handleWaitlistRequest(request, env);
      } else if (path === '/api/admin/spam-stats') {
        return await handleSpamMonitoringRequest(request, env.DB);
      } else {
        return new Response('Not Found', { 
          status: 404,
          headers: corsHeaders
        });
      }
    } catch (error) {
      console.error('API Error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },
};

// Auth route handler
async function handleAuthRoutes(request: Request, authService: AuthService, path: string): Promise<Response> {
  const method = request.method;
  
  if (path === '/api/auth/login' && method === 'POST') {
    const { email, password } = await request.json();
    const result = await authService.login(email, password);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  if (path === '/api/auth/register' && method === 'POST') {
    const userData = await request.json();
    const result = await authService.register(userData);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  if (path === '/api/auth/logout' && method === 'POST') {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (token) {
      await authService.logout(token);
    }
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  return new Response('Not Found', { 
    status: 404,
    headers: corsHeaders
  });
}

// Customer route handler
async function handleCustomerRoutes(request: Request, customerService: CustomerService, authService: AuthService, path: string): Promise<Response> {
  // Authenticate user
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const user = await authService.validateToken(token);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const method = request.method;
  
  if (path === '/api/customers' && method === 'GET') {
    const customers = await customerService.getAll(user.id);
    return new Response(JSON.stringify(customers), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  if (path === '/api/customers' && method === 'POST') {
    const customerData = await request.json();
    const customer = await customerService.create({ ...customerData, userId: user.id });
    return new Response(JSON.stringify(customer), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  if (path.match(/^\/api\/customers\/[^\/]+$/) && method === 'GET') {
    const id = path.split('/').pop()!;
    const customer = await customerService.getById(id, user.id);
    if (!customer) {
      return new Response(JSON.stringify({ error: 'Customer not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    return new Response(JSON.stringify(customer), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  if (path.match(/^\/api\/customers\/[^\/]+$/) && method === 'PUT') {
    const id = path.split('/').pop()!;
    const customerData = await request.json();
    const customer = await customerService.update(id, customerData, user.id);
    return new Response(JSON.stringify(customer), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  if (path.match(/^\/api\/customers\/[^\/]+$/) && method === 'DELETE') {
    const id = path.split('/').pop()!;
    await customerService.delete(id, user.id);
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  return new Response('Not Found', { 
    status: 404,
    headers: corsHeaders
  });
}

// Job route handler
async function handleJobRoutes(request: Request, jobService: JobService, authService: AuthService, path: string): Promise<Response> {
  // Authenticate user
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const user = await authService.validateToken(token);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const method = request.method;
  const url = new URL(request.url);
  
  if (path === '/api/jobs' && method === 'GET') {
    const status = url.searchParams.get('status');
    const customerId = url.searchParams.get('customer_id');
    const limit = Number(url.searchParams.get('limit')) || 50;
    const offset = Number(url.searchParams.get('offset')) || 0;

    let jobs;
    if (status) {
      jobs = await jobService.getJobsByStatus(user.id, status as any);
    } else if (customerId) {
      jobs = await jobService.getJobsByCustomerId(user.id, customerId);
    } else {
      jobs = await jobService.getJobsByUserId(user.id, limit, offset);
    }
    
    return new Response(JSON.stringify(jobs), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  if (path === '/api/jobs' && method === 'POST') {
    const jobData = await request.json();
    const job = await jobService.createJob(user.id, jobData);
    return new Response(JSON.stringify(job), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  if (path === '/api/jobs/today' && method === 'GET') {
    const jobs = await jobService.getTodaysJobs(user.id);
    return new Response(JSON.stringify(jobs), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  if (path === '/api/jobs/unpaid' && method === 'GET') {
    const jobs = await jobService.getUnpaidJobs(user.id);
    return new Response(JSON.stringify(jobs), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  if (path === '/api/jobs/stats' && method === 'GET') {
    const stats = await jobService.getJobStats(user.id);
    return new Response(JSON.stringify(stats), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  if (path.match(/^\/api\/jobs\/[^\/]+$/) && method === 'GET') {
    const id = path.split('/').pop()!;
    const job = await jobService.getJobById(user.id, id);
    if (!job) {
      return new Response(JSON.stringify({ error: 'Job not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    return new Response(JSON.stringify(job), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  if (path.match(/^\/api\/jobs\/[^\/]+$/) && method === 'PUT') {
    const id = path.split('/').pop()!;
    const jobData = await request.json();
    const job = await jobService.updateJob(user.id, id, jobData);
    return new Response(JSON.stringify(job), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  if (path.match(/^\/api\/jobs\/[^\/]+$/) && method === 'DELETE') {
    const id = path.split('/').pop()!;
    const success = await jobService.deleteJob(user.id, id);
    return new Response(JSON.stringify({ success }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  return new Response('Not Found', { 
    status: 404,
    headers: corsHeaders
  });
}

// Dashboard route handler
async function handleDashboardRoutes(request: Request, dashboardService: DashboardService, authService: AuthService, path: string): Promise<Response> {
  // Authenticate user
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const user = await authService.validateToken(token);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const method = request.method;
  const url = new URL(request.url);
  
  if (path === '/api/dashboard/stats' && method === 'GET') {
    const stats = await dashboardService.getDashboardStats(user.id);
    return new Response(JSON.stringify(stats), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  if (path === '/api/dashboard/jobs/today' && method === 'GET') {
    const jobs = await dashboardService.getTodaysJobs(user.id);
    return new Response(JSON.stringify(jobs), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  if (path === '/api/dashboard/jobs/recent' && method === 'GET') {
    const limit = Number(url.searchParams.get('limit')) || 10;
    const jobs = await dashboardService.getRecentJobs(user.id, limit);
    return new Response(JSON.stringify(jobs), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  if (path === '/api/dashboard/jobs/upcoming' && method === 'GET') {
    const days = Number(url.searchParams.get('days')) || 7;
    const jobs = await dashboardService.getUpcomingJobs(user.id, days);
    return new Response(JSON.stringify(jobs), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  if (path === '/api/dashboard/revenue/monthly' && method === 'GET') {
    const year = Number(url.searchParams.get('year')) || new Date().getFullYear();
    const revenue = await dashboardService.getRevenueByMonth(user.id, year);
    return new Response(JSON.stringify(revenue), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  return new Response('Not Found', { 
    status: 404,
    headers: corsHeaders
  });
}

// Analytics route handler
async function handleAnalyticsRoutes(request: Request, path: string, env: Env): Promise<Response> {
  if (path === '/api/analytics/track') {
    return await handleAnalyticsTrack(request, env);
  }
  
  if (path === '/api/analytics/session') {
    return await handleSessionInit(request, env);
  }
  
  if (path.startsWith('/api/analytics/query')) {
    return await handleAnalyticsQuery(request, env);
  }
  
  return new Response('Not Found', { 
    status: 404,
    headers: corsHeaders
  });
}

// Analytics data route handler
async function handleAnalyticsDataRoutes(request: Request, analyticsService: AnalyticsService, authService: AuthService, path: string): Promise<Response> {
  // Authenticate user
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const user = await authService.validateToken(token);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const method = request.method;
  const url = new URL(request.url);
  
  // Parse filters from query parameters
  const filters = parseAnalyticsFilters(url.searchParams);
  
  try {
    if (path === '/api/analytics/dashboard' && method === 'GET') {
      const data = await analyticsService.getAnalyticsDashboard(filters);
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (path === '/api/analytics/overview' && method === 'GET') {
      const data = await analyticsService.getAnalyticsOverview(filters);
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (path === '/api/analytics/sessions' && method === 'GET') {
      const data = await analyticsService.getSessionMetrics(filters);
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (path === '/api/analytics/events' && method === 'GET') {
      const data = await analyticsService.getEventMetrics(filters);
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (path === '/api/analytics/features' && method === 'GET') {
      const data = await analyticsService.getFeatureUsage(filters);
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (path === '/api/analytics/funnels' && method === 'GET') {
      const data = await analyticsService.getFunnelAnalytics(filters);
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (path === '/api/analytics/ab-tests' && method === 'GET') {
      const data = await analyticsService.getABTestResults(filters);
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Not Found', { 
      status: 404,
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Analytics route error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

function parseAnalyticsFilters(searchParams: URLSearchParams): AnalyticsFilters | undefined {
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  
  if (!startDate || !endDate) {
    return undefined;
  }
  
  const filters: AnalyticsFilters = {
    dateRange: {
      start: startDate,
      end: endDate
    }
  };
  
  const userType = searchParams.get('userType');
  if (userType) {
    filters.userType = userType.split(',');
  }
  
  const demoMode = searchParams.get('demoMode');
  if (demoMode !== null) {
    filters.demoMode = demoMode === 'true';
  }
  
  const country = searchParams.get('country');
  if (country) {
    filters.country = country.split(',');
  }
  
  const eventCategory = searchParams.get('eventCategory');
  if (eventCategory) {
    filters.eventCategory = eventCategory.split(',');
  }
  
  return filters;
}
