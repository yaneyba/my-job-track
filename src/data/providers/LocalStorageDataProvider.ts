import { v4 as uuidv4 } from 'uuid';
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
import { IDataProvider } from './IDataProvider';
import { format, startOfDay, endOfDay, isWithinInterval, parseISO } from 'date-fns';

/**
 * Local Storage Data Provider for waitlisted users
 * Allows full testing of the app with persistent local storage
 */
export class LocalStorageDataProvider implements IDataProvider {
  private static readonly STORAGE_PREFIX = 'jobtrack_waitlist_';
  private static readonly CUSTOMERS_KEY = `${LocalStorageDataProvider.STORAGE_PREFIX}customers`;
  private static readonly JOBS_KEY = `${LocalStorageDataProvider.STORAGE_PREFIX}jobs`;
  private static readonly USER_KEY = `${LocalStorageDataProvider.STORAGE_PREFIX}user`;

  constructor() {
    this.initializeWithSampleData();
  }

  private initializeWithSampleData(): void {
    // Only initialize if no data exists
    if (!this.getCustomers().length && !this.getJobs().length) {
      this.createSampleData();
    }
  }

  private createSampleData(): void {
    // Create sample customers
    const sampleCustomers: Customer[] = [
      {
        id: uuidv4(),
        name: 'Sample Customer 1',
        phone: '+1-555-0101',
        address: '123 Main St, Anytown, USA',
        serviceType: 'Weekly Cleaning',
        notes: 'This is a sample customer for testing purposes.',
        totalUnpaid: 0,
        createdDate: new Date().toISOString(),
        qrCodeUrl: ''
      },
      {
        id: uuidv4(),
        name: 'Sample Customer 2',
        phone: '+1-555-0102',
        address: '456 Oak Ave, Sample City, USA',
        serviceType: 'Bi-weekly Cleaning',
        notes: 'Another sample customer to demonstrate the app features.',
        totalUnpaid: 150,
        createdDate: new Date().toISOString(),
        qrCodeUrl: ''
      }
    ];

    // Create sample jobs
    const sampleJobs: Job[] = [
      {
        id: uuidv4(),
        customerId: sampleCustomers[0].id,
        customerName: sampleCustomers[0].name,
        title: 'Weekly Cleaning Service',
        serviceType: sampleCustomers[0].serviceType,
        scheduledDate: format(new Date(), 'yyyy-MM-dd'),
        price: 80,
        status: 'scheduled',
        paymentStatus: 'unpaid',
        paid: false,
        notes: 'Regular weekly cleaning service',
        createdDate: new Date().toISOString(),
        qrCodeUrl: ''
      }
    ];

    this.saveToStorage(LocalStorageDataProvider.CUSTOMERS_KEY, sampleCustomers);
    this.saveToStorage(LocalStorageDataProvider.JOBS_KEY, sampleJobs);
  }

  private getFromStorage<T>(key: string): T[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Failed to get data from storage for key ${key}:`, error);
      return [];
    }
  }

  private saveToStorage<T>(key: string, data: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to save data to storage for key ${key}:`, error);
    }
  }

  // Customer methods
  getCustomers(): Customer[] {
    return this.getFromStorage<Customer>(LocalStorageDataProvider.CUSTOMERS_KEY);
  }

  getCustomer(id: string): Customer | undefined {
    const customers = this.getCustomers();
    return customers.find(customer => customer.id === id);
  }

  addCustomer(customerData: Omit<Customer, 'id' | 'createdDate' | 'qrCodeUrl' | 'totalUnpaid'>): Customer {
    const customers = this.getCustomers();
    const customer: Customer = {
      ...customerData,
      id: uuidv4(),
      createdDate: new Date().toISOString(),
      qrCodeUrl: '',
      totalUnpaid: 0
    };
    
    customers.push(customer);
    this.saveToStorage(LocalStorageDataProvider.CUSTOMERS_KEY, customers);
    return customer;
  }

  updateCustomer(id: string, updates: Partial<Customer>): Customer | undefined {
    const customers = this.getCustomers();
    const index = customers.findIndex(customer => customer.id === id);
    
    if (index === -1) return undefined;
    
    customers[index] = { ...customers[index], ...updates };
    this.saveToStorage(LocalStorageDataProvider.CUSTOMERS_KEY, customers);
    return customers[index];
  }

  deleteCustomer(id: string): boolean {
    const customers = this.getCustomers();
    const filteredCustomers = customers.filter(customer => customer.id !== id);
    
    if (filteredCustomers.length === customers.length) return false;
    
    // Also delete associated jobs
    const jobs = this.getJobs();
    const filteredJobs = jobs.filter(job => job.customerId !== id);
    this.saveToStorage(LocalStorageDataProvider.JOBS_KEY, filteredJobs);
    
    this.saveToStorage(LocalStorageDataProvider.CUSTOMERS_KEY, filteredCustomers);
    return true;
  }

  searchCustomers(query: string): Customer[] {
    const customers = this.getCustomers();
    const lowercaseQuery = query.toLowerCase();
    
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(lowercaseQuery) ||
      customer.phone.toLowerCase().includes(lowercaseQuery) ||
      customer.address.toLowerCase().includes(lowercaseQuery) ||
      customer.serviceType.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Job methods
  getJobs(): Job[] {
    return this.getFromStorage<Job>(LocalStorageDataProvider.JOBS_KEY);
  }

  getJob(id: string): Job | undefined {
    const jobs = this.getJobs();
    return jobs.find(job => job.id === id);
  }

  getJobsByCustomer(customerId: string): Job[] {
    const jobs = this.getJobs();
    return jobs.filter(job => job.customerId === customerId);
  }

  addJob(jobData: Omit<Job, 'id' | 'qrCodeUrl' | 'createdDate' | 'customerName'>): Job {
    const jobs = this.getJobs();
    const customer = this.getCustomer(jobData.customerId);
    
    if (!customer) {
      throw new Error('Customer not found');
    }
    
    const job: Job = {
      ...jobData,
      id: uuidv4(),
      customerName: customer.name,
      createdDate: new Date().toISOString(),
      qrCodeUrl: ''
    };
    
    jobs.push(job);
    this.saveToStorage(LocalStorageDataProvider.JOBS_KEY, jobs);
    
    // Update customer's total unpaid if job is unpaid
    if (job.paymentStatus === 'unpaid') {
      this.updateCustomerTotalUnpaid(job.customerId);
    }
    
    return job;
  }

  updateJob(id: string, updates: Partial<Job>): Job | undefined {
    const jobs = this.getJobs();
    const index = jobs.findIndex(job => job.id === id);
    
    if (index === -1) return undefined;
    
    const oldJob = jobs[index];
    jobs[index] = { ...oldJob, ...updates };
    this.saveToStorage(LocalStorageDataProvider.JOBS_KEY, jobs);
    
    // Update customer's total unpaid if payment status changed
    if (updates.paymentStatus && updates.paymentStatus !== oldJob.paymentStatus) {
      this.updateCustomerTotalUnpaid(jobs[index].customerId);
    }
    
    return jobs[index];
  }

  deleteJob(id: string): boolean {
    const jobs = this.getJobs();
    const jobToDelete = jobs.find(job => job.id === id);
    const filteredJobs = jobs.filter(job => job.id !== id);
    
    if (filteredJobs.length === jobs.length) return false;
    
    this.saveToStorage(LocalStorageDataProvider.JOBS_KEY, filteredJobs);
    
    // Update customer's total unpaid
    if (jobToDelete) {
      this.updateCustomerTotalUnpaid(jobToDelete.customerId);
    }
    
    return true;
  }

  getJobsByDate(date: string): Job[] {
    const jobs = this.getJobs();
    return jobs.filter(job => job.scheduledDate === date);
  }

  getJobsByDateRange(startDate: string, endDate: string): Job[] {
    const jobs = this.getJobs();
    const start = startOfDay(parseISO(startDate));
    const end = endOfDay(parseISO(endDate));
    
    return jobs.filter(job => {
      const jobDate = parseISO(job.scheduledDate);
      return isWithinInterval(jobDate, { start, end });
    });
  }

  private updateCustomerTotalUnpaid(customerId: string): void {
    const jobs = this.getJobsByCustomer(customerId);
    const totalUnpaid = jobs
      .filter(job => job.paymentStatus === 'unpaid')
      .reduce((sum, job) => sum + job.price, 0);
    
    this.updateCustomer(customerId, { totalUnpaid });
  }

  // Dashboard methods
  getDashboardStats(date?: string): DashboardStats {
    const jobs = this.getJobs();
    const targetDate = date || format(new Date(), 'yyyy-MM-dd');
    
    const todaysJobs = jobs.filter(job => job.scheduledDate === targetDate);
    
    const totalUnpaid = jobs
      .filter(job => job.paymentStatus === 'unpaid')
      .reduce((sum, job) => sum + job.price, 0);
    
    const unpaidJobsCount = jobs.filter(job => job.paymentStatus === 'unpaid').length;
    
    const thisWeekEarnings = jobs
      .filter(job => job.paymentStatus === 'paid')
      .reduce((sum, job) => sum + job.price, 0);

    return {
      todaysJobs,
      totalUnpaid,
      unpaidJobsCount,
      thisWeekEarnings
    };
  }

  // QR Code methods (mock implementation for waitlisted users)
  async generateCustomerQRCode(_customerId: string): Promise<string> {
    // Return a mock QR code URL for testing
    return `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y5ZmFmYiIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2YjczODAiPk1vY2sgUVIgQ29kZTwvdGV4dD4KPC9zdmc+`;
  }

  async generateJobQRCode(_jobId: string): Promise<string> {
    // Return a mock QR code URL for testing
    return `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y5ZmFmYiIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2YjczODAiPk1vY2sgUVIgQ29kZTwvdGV4dD4KPC9zdmc+`;
  }

  // Data management
  exportData(): { customers: Customer[]; jobs: Job[] } {
    return {
      customers: this.getCustomers(),
      jobs: this.getJobs()
    };
  }

  importData(data: { customers: Customer[]; jobs: Job[] }): boolean {
    try {
      this.saveToStorage(LocalStorageDataProvider.CUSTOMERS_KEY, data.customers);
      this.saveToStorage(LocalStorageDataProvider.JOBS_KEY, data.jobs);
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  clearAllData(): void {
    localStorage.removeItem(LocalStorageDataProvider.CUSTOMERS_KEY);
    localStorage.removeItem(LocalStorageDataProvider.JOBS_KEY);
    localStorage.removeItem(LocalStorageDataProvider.USER_KEY);
  }

  // Authentication methods for waitlisted users
  authenticateUser(email: string, _password: string): Promise<{ success: boolean; user?: any; error?: string }> {
    return Promise.resolve({
      success: true,
      user: {
        id: 'waitlist-user',
        email,
        name: 'Test User',
        businessName: 'Test Business',
        createdAt: new Date().toISOString(),
        isWaitlisted: true
      }
    });
  }

  getDemoUser(): any {
    return {
      id: 'waitlist-user',
      email: 'test@example.com',
      name: 'Test User',
      businessName: 'Test Business',
      createdAt: new Date().toISOString(),
      isWaitlisted: true
    };
  }

  // Waitlist-specific methods
  static isWaitlistedUser(email: string): boolean {
    try {
      const waitlistEmails = localStorage.getItem('jobtrack_waitlist_emails');
      if (!waitlistEmails) return false;
      
      const emails: string[] = JSON.parse(waitlistEmails);
      return emails.includes(email.toLowerCase());
    } catch (error) {
      console.error('Failed to check waitlist status:', error);
      return false;
    }
  }

  static addToWaitlistStorage(email: string): void {
    try {
      const waitlistEmails = localStorage.getItem('jobtrack_waitlist_emails');
      const emails: string[] = waitlistEmails ? JSON.parse(waitlistEmails) : [];
      
      if (!emails.includes(email.toLowerCase())) {
        emails.push(email.toLowerCase());
        localStorage.setItem('jobtrack_waitlist_emails', JSON.stringify(emails));
      }
    } catch (error) {
      console.error('Failed to add to waitlist storage:', error);
    }
  }

  static getWaitlistStorageSize(): string {
    try {
      let totalSize = 0;
      const keys = [
        LocalStorageDataProvider.CUSTOMERS_KEY,
        LocalStorageDataProvider.JOBS_KEY,
        LocalStorageDataProvider.USER_KEY,
        'jobtrack_waitlist_emails'
      ];
      
      keys.forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
          totalSize += item.length;
        }
      });
      
      // Convert bytes to KB/MB
      if (totalSize < 1024) {
        return `${totalSize} bytes`;
      } else if (totalSize < 1024 * 1024) {
        return `${(totalSize / 1024).toFixed(1)} KB`;
      } else {
        return `${(totalSize / (1024 * 1024)).toFixed(1)} MB`;
      }
    } catch (error) {
      return 'Unknown';
    }
  }

  // Analytics methods - store in localStorage for waitlisted users
  async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      const storageKey = `${LocalStorageDataProvider.STORAGE_PREFIX}analytics_events`;
      const events = JSON.parse(localStorage.getItem(storageKey) || '[]');
      events.push(event);
      
      // Keep only last 200 events for waitlisted users
      if (events.length > 200) {
        events.splice(0, events.length - 200);
      }
      
      localStorage.setItem(storageKey, JSON.stringify(events));
      console.log('📊 Waitlist Analytics Event Tracked:', event);
    } catch (error) {
      console.warn('Failed to track waitlist analytics event:', error);
    }
  }

  async initializeSession(sessionData: SessionInitData): Promise<void> {
    try {
      const storageKey = `${LocalStorageDataProvider.STORAGE_PREFIX}analytics_session`;
      localStorage.setItem(storageKey, JSON.stringify(sessionData));
      console.log('📊 Waitlist Analytics Session Initialized:', sessionData);
    } catch (error) {
      console.warn('Failed to initialize waitlist analytics session:', error);
    }
  }

  async getAnalyticsData(query: AnalyticsQuery): Promise<any> {
    // For waitlisted users, we can return real analytics from stored events
    const storageKey = `${LocalStorageDataProvider.STORAGE_PREFIX}analytics_events`;
    const events: AnalyticsEvent[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    switch (query.query) {
      case 'conversion_rates':
        return this.calculateConversionRatesFromEvents(events, query.timeframe);
      case 'popular_features':
        return this.calculatePopularFeaturesFromEvents(events, query.timeframe);
      case 'demo_engagement':
        return this.calculateDemoEngagementFromEvents(events, query.timeframe);
      case 'user_journeys':
        return this.calculateUserJourneysFromEvents(events, query.timeframe);
      default:
        return null;
    }
  }

  private calculateConversionRatesFromEvents(events: AnalyticsEvent[], timeframe: string): ConversionRate[] {
    const conversionEvents = events.filter(e => e.event === 'waitlist_signup_completed');
    const ctaEvents = events.filter(e => e.event === 'waitlist_cta_triggered');
    
    const sourceStats: Record<string, { total: number; conversions: number }> = {};
    
    ctaEvents.forEach(event => {
      const source = event.properties.source || 'unknown';
      if (!sourceStats[source]) {
        sourceStats[source] = { total: 0, conversions: 0 };
      }
      sourceStats[source].total++;
    });
    
    conversionEvents.forEach(event => {
      const source = event.properties.source || 'unknown';
      if (sourceStats[source]) {
        sourceStats[source].conversions++;
      }
    });
    
    return Object.entries(sourceStats).map(([source, stats]) => ({
      conversion_source: source,
      total_sessions: stats.total,
      conversions: stats.conversions,
      conversion_rate: stats.total > 0 ? (stats.conversions / stats.total) * 100 : 0
    }));
  }

  private calculatePopularFeaturesFromEvents(events: AnalyticsEvent[], timeframe: string): FeatureUsage[] {
    const featureEvents = events.filter(e => e.event === 'feature_interaction');
    const featureStats: Record<string, { count: number; sessions: Set<string> }> = {};
    
    featureEvents.forEach(event => {
      const feature = event.properties.feature || 'unknown';
      if (!featureStats[feature]) {
        featureStats[feature] = { count: 0, sessions: new Set() };
      }
      featureStats[feature].count++;
      if (event.sessionId) {
        featureStats[feature].sessions.add(event.sessionId);
      }
    });
    
    return Object.entries(featureStats)
      .map(([feature, stats]) => ({
        feature_name: feature,
        feature_category: this.categorizeFeature(feature),
        usage_count: stats.count,
        unique_sessions: stats.sessions.size
      }))
      .sort((a, b) => b.usage_count - a.usage_count);
  }

  private calculateDemoEngagementFromEvents(events: AnalyticsEvent[], timeframe: string): DemoEngagement[] {
    const demoEvents = events.filter(e => e.demoMode);
    const sessionStats: Record<string, { sessions: Set<string>; conversions: number; pageViews: number }> = {};
    
    demoEvents.forEach(event => {
      const date = new Date(event.timestamp).toISOString().split('T')[0];
      if (!sessionStats[date]) {
        sessionStats[date] = { sessions: new Set(), conversions: 0, pageViews: 0 };
      }
      
      if (event.sessionId) {
        sessionStats[date].sessions.add(event.sessionId);
      }
      
      if (event.event === 'waitlist_signup_completed') {
        sessionStats[date].conversions++;
      }
      
      if (event.event === 'page_view') {
        sessionStats[date].pageViews++;
      }
    });
    
    return Object.entries(sessionStats).map(([date, stats]) => ({
      date,
      sessions: stats.sessions.size,
      avg_duration: 180, // Mock average duration
      avg_page_views: stats.sessions.size > 0 ? stats.pageViews / stats.sessions.size : 0,
      conversions: stats.conversions,
      conversion_rate: stats.sessions.size > 0 ? (stats.conversions / stats.sessions.size) * 100 : 0
    }));
  }

  private calculateUserJourneysFromEvents(events: AnalyticsEvent[], timeframe: string): UserJourney[] {
    // This would require more complex session tracking
    // For now, return mock data similar to demo provider
    return [
      {
        pages_visited: '["/, "/waitlist-test", "/add-customer", "/waitlist"]',
        session_count: 8,
        avg_duration: 210,
        conversions: 3
      },
      {
        pages_visited: '["/, "/waitlist-test", "/jobs", "/waitlist"]',
        session_count: 5,
        avg_duration: 165,
        conversions: 1
      }
    ];
  }

  private categorizeFeature(feature: string): string {
    if (feature.includes('customer')) return 'customer_management';
    if (feature.includes('job')) return 'job_management';
    if (feature.includes('qr')) return 'qr_features';
    if (feature.includes('theme') || feature.includes('language')) return 'settings';
    return 'other';
  }

  async getConversionRates(timeframe: string): Promise<ConversionRate[]> {
    return this.calculateConversionRatesFromEvents(
      JSON.parse(localStorage.getItem(`${LocalStorageDataProvider.STORAGE_PREFIX}analytics_events`) || '[]'),
      timeframe
    );
  }

  async getPopularFeatures(timeframe: string): Promise<FeatureUsage[]> {
    return this.calculatePopularFeaturesFromEvents(
      JSON.parse(localStorage.getItem(`${LocalStorageDataProvider.STORAGE_PREFIX}analytics_events`) || '[]'),
      timeframe
    );
  }

  async getDemoEngagement(timeframe: string): Promise<DemoEngagement[]> {
    return this.calculateDemoEngagementFromEvents(
      JSON.parse(localStorage.getItem(`${LocalStorageDataProvider.STORAGE_PREFIX}analytics_events`) || '[]'),
      timeframe
    );
  }

  async getUserJourneys(timeframe: string): Promise<UserJourney[]> {
    return this.calculateUserJourneysFromEvents(
      JSON.parse(localStorage.getItem(`${LocalStorageDataProvider.STORAGE_PREFIX}analytics_events`) || '[]'),
      timeframe
    );
  }
}
