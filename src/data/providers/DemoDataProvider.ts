import { IDataProvider } from './IDataProvider';
import { 
  Customer, 
  Job, 
  DashboardStats, 
  AnalyticsEvent, 
  SessionInitData, 
  AnalyticsQuery, 
  ConversionRate, 
  FeatureUsage, 
  DemoEngagement, 
  UserJourney 
} from '@/types';
import { DemoData, getDemoCredentials, createDemoUser } from '@/hooks/useDemoData';
import demoData from '@/data/demo.json';
import apiClient from '@/lib/api';
import QRCode from 'qrcode';
import { parseISO, isWithinInterval } from 'date-fns';

/**
 * Demo Data Provider - Read-only provider that serves data from demo.json
 * All write operations are disabled to maintain demo data integrity
 * Includes authentication support for pure demo mode
 */
export class DemoDataProvider implements IDataProvider {
  private demoData: DemoData;

  constructor() {
    this.demoData = demoData as DemoData;
  }

  // Authentication methods for demo mode
  async authenticateUser(email: string, password: string): Promise<{ success: boolean; user?: any; error?: string }> {
    const credentials = getDemoCredentials();
    
    if (email === credentials.email && password === credentials.password) {
      const demoUser = createDemoUser();
      return {
        success: true,
        user: {
          id: demoUser.id,
          email: demoUser.email,
          name: demoUser.name,
          businessName: demoUser.businessName,
          phone: demoUser.phone,
          address: demoUser.address
        }
      };
    }
    
    return {
      success: false,
      error: 'Invalid demo credentials. Please check your environment variables.'
    };
  }

  getDemoUser() {
    return createDemoUser();
  }

  // Customer methods - Read-only
  getCustomers(): Customer[] {
    return this.demoData.customers
      .map(customer => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        businessName: '',
        notes: customer.notes,
        serviceType: 'General Service',
        totalUnpaid: this.calculateCustomerUnpaid(customer.id),
        createdDate: customer.createdAt,
        qrCodeUrl: `qr-customer-${customer.id}`
      }))
      .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
  }

  getCustomer(id: string): Customer | undefined {
    const customer = this.demoData.customers.find(c => c.id === id);
    if (!customer) return undefined;

    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      businessName: '',
      notes: customer.notes,
      serviceType: 'General Service',
      totalUnpaid: this.calculateCustomerUnpaid(customer.id),
      createdDate: customer.createdAt,
      qrCodeUrl: `qr-customer-${customer.id}`
    };
  }

  addCustomer(customerData: Omit<Customer, 'id' | 'createdDate' | 'qrCodeUrl' | 'totalUnpaid'>): Customer {
    console.log('DemoDataProvider: addCustomer called with NEW implementation');
    const customer: Customer = {
      ...customerData,
      id: `customer-${Date.now()}`,
      createdDate: new Date().toISOString(),
      qrCodeUrl: `qr-customer-${Date.now()}`,
      totalUnpaid: 0
    };
    
    // Add to demo data temporarily (in memory only)
    this.demoData.customers.push({
      id: customer.id,
      name: customer.name,
      email: customer.phone, // Use phone as email for demo
      phone: customer.phone,
      address: customer.address,
      notes: `Service Type: ${customer.serviceType}`,
      createdAt: customer.createdDate,
      updatedAt: customer.createdDate
    });
    
    console.log('DemoDataProvider: Customer added to demo data (temporary)');
    return customer;
  }

  updateCustomer(id: string, updates: Partial<Customer>): Customer | undefined {
    const customers = this.getCustomers();
    const customerIndex = customers.findIndex(c => c.id === id);
    
    if (customerIndex === -1) {
      console.warn('DemoDataProvider: Customer not found for update');
      return undefined;
    }
    
    const existingCustomer = customers[customerIndex];
    const updatedCustomer = { ...existingCustomer, ...updates };
    
    // Update the in-memory demo data
    const demoCustomerIndex = this.demoData.customers.findIndex(c => c.id === id);
    if (demoCustomerIndex !== -1) {
      this.demoData.customers[demoCustomerIndex] = {
        ...this.demoData.customers[demoCustomerIndex],
        name: updatedCustomer.name,
        phone: updatedCustomer.phone,
        address: updatedCustomer.address,
        notes: updatedCustomer.serviceType ? `Service Type: ${updatedCustomer.serviceType}` : this.demoData.customers[demoCustomerIndex].notes,
        updatedAt: new Date().toISOString()
      };
    }
    
    console.log('DemoDataProvider: Customer updated in demo data (temporary)');
    return updatedCustomer;
  }

  deleteCustomer(id: string): boolean {
    // Only allow deletion of customers created during this session (those with timestamp-based IDs)
    if (!id.startsWith('customer-')) {
      console.warn('DemoDataProvider: Cannot delete original demo customers');
      throw new Error('Demo mode: Cannot delete original demo customers. Only newly created customers can be deleted.');
    }
    
    // Find and remove from in-memory demo data
    const customerIndex = this.demoData.customers.findIndex(c => c.id === id);
    if (customerIndex === -1) {
      console.warn('DemoDataProvider: Customer not found for deletion');
      return false;
    }
    
    this.demoData.customers.splice(customerIndex, 1);
    console.log('DemoDataProvider: Customer deleted from demo data (temporary)');
    return true;
  }

  searchCustomers(query: string): Customer[] {
    const customers = this.getCustomers();
    const lowerQuery = query.toLowerCase();
    
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(lowerQuery) ||
      customer.phone.includes(query) ||
      customer.address.toLowerCase().includes(lowerQuery)
    );
  }

  // Job methods - Read-only
  getJobs(): Job[] {
    return this.demoData.jobs
      .map(job => ({
        id: job.id,
        customerId: job.customerId,
        customerName: job.customerName,
        title: job.serviceType,
        description: job.description,
        serviceType: job.serviceType,
        scheduledDate: job.scheduledDate,
        dueDate: job.scheduledDate,
        price: job.price,
        estimatedCost: job.price,
        actualCost: job.price,
        estimatedHours: job.estimatedDuration / 60,
        actualHours: job.estimatedDuration / 60,
        status: job.status,
        paymentStatus: job.paymentStatus,
        paid: job.paymentStatus === 'paid',
        notes: job.notes,
        completedDate: job.completedDate,
        completedAt: job.completedDate,
        createdDate: job.createdAt,
        qrCodeUrl: `qr-job-${job.id}`
      }))
      .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
  }

  getJob(id: string): Job | undefined {
    const job = this.demoData.jobs.find(j => j.id === id);
    if (!job) return undefined;

    return {
      id: job.id,
      customerId: job.customerId,
      customerName: job.customerName,
      title: job.serviceType,
      description: job.description,
      serviceType: job.serviceType,
      scheduledDate: job.scheduledDate,
      dueDate: job.scheduledDate,
      price: job.price,
      estimatedCost: job.price,
      actualCost: job.price,
      estimatedHours: job.estimatedDuration / 60,
      actualHours: job.estimatedDuration / 60,
      status: job.status,
      paymentStatus: job.paymentStatus,
      paid: job.paymentStatus === 'paid',
      notes: job.notes,
      completedDate: job.completedDate,
      completedAt: job.completedDate,
      createdDate: job.createdAt,
      qrCodeUrl: `qr-job-${job.id}`
    };
  }

  getJobsByCustomer(customerId: string): Job[] {
    return this.getJobs().filter(job => job.customerId === customerId);
  }

  addJob(jobData: Omit<Job, 'id' | 'qrCodeUrl' | 'createdDate' | 'customerName'>): Job {
    const customer = this.getCustomer(jobData.customerId);
    const job: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      qrCodeUrl: `qr-job-${Date.now()}`,
      createdDate: new Date().toISOString(),
      customerName: customer?.name || 'Unknown Customer'
    };
    
    // Add to demo data temporarily (in memory only)
    this.demoData.jobs.push({
      id: job.id,
      customerId: job.customerId,
      customerName: job.customerName,
      serviceType: job.serviceType,
      description: job.description || '',
      scheduledDate: job.scheduledDate,
      completedDate: job.completedDate,
      estimatedDuration: 120, // Default 2 hours
      price: job.price,
      status: job.status === 'pending' || job.status === 'cancelled' ? 'scheduled' : job.status,
      paymentStatus: 'unpaid',
      notes: job.notes,
      createdAt: job.createdDate,
      updatedAt: job.createdDate
    });
    
    console.log('DemoDataProvider: Job added to demo data (temporary)');
    return job;
  }

  updateJob(id: string, updates: Partial<Job>): Job | undefined {
    const jobs = this.getJobs();
    const jobIndex = jobs.findIndex(j => j.id === id);
    
    if (jobIndex === -1) {
      console.warn('DemoDataProvider: Job not found for update');
      return undefined;
    }
    
    const existingJob = jobs[jobIndex];
    const updatedJob = { ...existingJob, ...updates };
    
    // Update the in-memory demo data
    const demoJobIndex = this.demoData.jobs.findIndex(j => j.id === id);
    if (demoJobIndex !== -1) {
      this.demoData.jobs[demoJobIndex] = {
        ...this.demoData.jobs[demoJobIndex],
        serviceType: updatedJob.serviceType,
        description: updatedJob.description || '',
        scheduledDate: updatedJob.scheduledDate,
        completedDate: updatedJob.completedDate,
        price: updatedJob.price,
        status: updatedJob.status === 'pending' || updatedJob.status === 'cancelled' ? 'scheduled' : updatedJob.status,
        notes: updatedJob.notes,
        updatedAt: new Date().toISOString()
      };
    }
    
    console.log('DemoDataProvider: Job updated in demo data (temporary)');
    return updatedJob;
  }

  deleteJob(id: string): boolean {
    // Only allow deletion of jobs created during this session (those with timestamp-based IDs)
    if (!id.startsWith('job-')) {
      console.warn('DemoDataProvider: Cannot delete original demo jobs');
      throw new Error('Demo mode: Cannot delete original demo jobs. Only newly created jobs can be deleted.');
    }
    
    // Find and remove from in-memory demo data
    const jobIndex = this.demoData.jobs.findIndex(j => j.id === id);
    if (jobIndex === -1) {
      console.warn('DemoDataProvider: Job not found for deletion');
      return false;
    }
    
    this.demoData.jobs.splice(jobIndex, 1);
    console.log('DemoDataProvider: Job deleted from demo data (temporary)');
    return true;
  }

  getJobsByDate(date: string): Job[] {
    return this.getJobs().filter(job => job.scheduledDate === date);
  }

  getJobsByDateRange(startDate: string, endDate: string): Job[] {
    const jobs = this.getJobs();
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    
    return jobs.filter(job => {
      const jobDate = parseISO(job.scheduledDate);
      return isWithinInterval(jobDate, { start, end });
    });
  }

  // Dashboard methods
  getDashboardStats(_date?: string): DashboardStats {
    const jobs = this.getJobs();
    
    return {
      todaysJobs: jobs.filter(job => job.scheduledDate === new Date().toISOString().split('T')[0]),
      totalUnpaid: jobs.filter(job => job.paymentStatus === 'unpaid').reduce((sum, job) => sum + job.price, 0),
      unpaidJobsCount: jobs.filter(job => job.paymentStatus === 'unpaid').length,
      thisWeekEarnings: jobs.filter(job => job.paymentStatus === 'paid').reduce((sum, job) => sum + job.price, 0)
    };
  }

  // QR Code methods
  async generateCustomerQRCode(customerId: string): Promise<string> {
    const customer = this.getCustomer(customerId);
    if (!customer) throw new Error('Customer not found');
    
    const qrData = {
      type: 'customer',
      id: customerId,
      url: customer.qrCodeUrl,
      name: customer.name,
      phone: customer.phone
    };
    
    return await QRCode.toDataURL(JSON.stringify(qrData), {
      width: 200,
      margin: 2,
      color: {
        dark: '#2563eb',
        light: '#ffffff'
      }
    });
  }

  async generateJobQRCode(jobId: string): Promise<string> {
    const job = this.getJob(jobId);
    if (!job) throw new Error('Job not found');
    
    const qrData = {
      type: 'job',
      id: jobId,
      url: job.qrCodeUrl,
      customerId: job.customerId,
      serviceType: job.serviceType
    };
    
    return await QRCode.toDataURL(JSON.stringify(qrData), {
      width: 200,
      margin: 2,
      color: {
        dark: '#2563eb',
        light: '#ffffff'
      }
    });
  }

  // Data management - Disabled in demo mode
  exportData(): { customers: Customer[]; jobs: Job[] } {
    return {
      customers: this.getCustomers(),
      jobs: this.getJobs()
    };
  }

  importData(_data: { customers: Customer[]; jobs: Job[] }): boolean {
    console.warn('DemoDataProvider: Import operation disabled in demo mode');
    throw new Error('Demo mode: Cannot import data');
  }

  clearAllData(): void {
    console.log('DemoDataProvider: Clearing user-created data, preserving original demo data');
    
    // Import fresh demo data to reset everything
    const originalData = require('@/data/demo.json') as DemoData;
    
    // Reset to original demo data - this clears all user-created data
    // while preserving the original demo customers and jobs
    this.demoData = {
      customers: [...originalData.customers],
      jobs: [...originalData.jobs],
      demoUser: originalData.demoUser,
      serviceTypes: originalData.serviceTypes,
      dashboardStats: originalData.dashboardStats,
      notifications: originalData.notifications,
      recentActivity: originalData.recentActivity
    };
    
    console.log('DemoDataProvider: User data cleared, demo data preserved');
  }

  // Analytics methods - for demo mode, we'll store in localStorage for simulation AND in database for real tracking
  async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      // In demo mode, store events in localStorage for simulation
      const events = JSON.parse(localStorage.getItem('demo_analytics_events') || '[]');
      events.push(event);
      
      // Keep only last 100 events
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      
      localStorage.setItem('demo_analytics_events', JSON.stringify(events));
      console.log('📊 Demo Analytics Event Tracked:', event);

      // ALSO send to the database via API for real analytics tracking
      try {
        await apiClient.trackAnalyticsEvent(event);
        console.log('📊 Analytics Event Stored in Database:', event.event);
      } catch (apiError) {
        console.warn('Failed to store analytics event in database:', apiError);
        // Don't fail the whole function if API call fails
      }
    } catch (error) {
      console.warn('Failed to track demo analytics event:', error);
    }
  }

  async initializeSession(sessionData: SessionInitData): Promise<void> {
    try {
      // Store session data in localStorage for demo mode
      localStorage.setItem('demo_analytics_session', JSON.stringify(sessionData));
      console.log('📊 Demo Analytics Session Initialized:', sessionData);

      // ALSO send to the database via API for real analytics tracking
      try {
        await apiClient.initializeAnalyticsSession(sessionData);
        console.log('📊 Analytics Session Stored in Database:', sessionData.sessionId);
      } catch (apiError) {
        console.warn('Failed to store analytics session in database:', apiError);
        // Don't fail the whole function if API call fails
      }
    } catch (error) {
      console.warn('Failed to initialize demo analytics session:', error);
    }
  }

  async getAnalyticsData(query: AnalyticsQuery): Promise<any> {
    // Return mock analytics data for demo mode
    switch (query.query) {
      case 'conversion_rates':
        return this.getConversionRates(query.timeframe);
      case 'popular_features':
        return this.getPopularFeatures(query.timeframe);
      case 'demo_engagement':
        return this.getDemoEngagement(query.timeframe);
      case 'user_journeys':
        return this.getUserJourneys(query.timeframe);
      default:
        return null;
    }
  }

  async getConversionRates(timeframe: string): Promise<ConversionRate[]> {
    // Return mock conversion data for demo
    return [
      {
        conversion_source: 'add_customer',
        total_sessions: 45,
        conversions: 12,
        conversion_rate: 26.7
      },
      {
        conversion_source: 'schedule_job',
        total_sessions: 32,
        conversions: 8,
        conversion_rate: 25.0
      },
      {
        conversion_source: 'qr_scan',
        total_sessions: 18,
        conversions: 3,
        conversion_rate: 16.7
      }
    ];
  }

  async getPopularFeatures(timeframe: string): Promise<FeatureUsage[]> {
    // Return mock feature usage data
    return [
      {
        feature_name: 'add_customer',
        feature_category: 'customer_management',
        usage_count: 156,
        unique_sessions: 89
      },
      {
        feature_name: 'schedule_job',
        feature_category: 'job_management',
        usage_count: 143,
        unique_sessions: 76
      },
      {
        feature_name: 'qr_scan',
        feature_category: 'qr_features',
        usage_count: 67,
        unique_sessions: 34
      },
      {
        feature_name: 'theme_toggle',
        feature_category: 'settings',
        usage_count: 23,
        unique_sessions: 19
      }
    ];
  }

  async getDemoEngagement(timeframe: string): Promise<DemoEngagement[]> {
    // Return mock demo engagement data
    const today = new Date();
    const mockData: DemoEngagement[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      mockData.push({
        date: date.toISOString().split('T')[0],
        sessions: 15 + Math.floor(Math.random() * 10),
        avg_duration: 120 + Math.floor(Math.random() * 180),
        avg_page_views: 3.2 + Math.random() * 2,
        conversions: 2 + Math.floor(Math.random() * 4),
        conversion_rate: 15 + Math.random() * 15
      });
    }
    
    return mockData;
  }

  async getUserJourneys(timeframe: string): Promise<UserJourney[]> {
    // Return mock user journey data
    return [
      {
        pages_visited: '["/, "/demo", "/add-customer", "/waitlist"]',
        session_count: 23,
        avg_duration: 245,
        conversions: 8
      },
      {
        pages_visited: '["/, "/demo", "/jobs", "/add-job", "/waitlist"]',
        session_count: 18,
        avg_duration: 198,
        conversions: 5
      },
      {
        pages_visited: '["/, "/demo", "/qr", "/waitlist"]',
        session_count: 12,
        avg_duration: 156,
        conversions: 2
      }
    ];
  }

  // Helper methods
  private calculateCustomerUnpaid(customerId: string): number {
    return this.demoData.jobs
      .filter(job => job.customerId === customerId && job.paymentStatus === 'unpaid')
      .reduce((total, job) => total + job.price, 0);
  }
}
