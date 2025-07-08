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

export interface IDataProvider {
  // Authentication methods (optional - for demo mode)
  authenticateUser?(email: string, password: string): Promise<{ success: boolean; user?: any; error?: string }>;
  getDemoUser?(): any;

  // Customer methods
  getCustomers(): Customer[];
  getCustomer(id: string): Customer | undefined;
  addCustomer(customer: Omit<Customer, 'id' | 'createdDate' | 'qrCodeUrl' | 'totalUnpaid'>): Customer;
  updateCustomer(id: string, updates: Partial<Customer>): Customer | undefined;
  deleteCustomer(id: string): boolean;
  searchCustomers(query: string): Customer[];

  // Job methods
  getJobs(): Job[];
  getJob(id: string): Job | undefined;
  getJobsByCustomer(customerId: string): Job[];
  addJob(job: Omit<Job, 'id' | 'qrCodeUrl' | 'createdDate' | 'customerName'>): Job;
  updateJob(id: string, updates: Partial<Job>): Job | undefined;
  deleteJob(id: string): boolean;
  getJobsByDate(date: string): Job[];
  getJobsByDateRange(startDate: string, endDate: string): Job[];

  // Dashboard methods
  getDashboardStats(date?: string): DashboardStats;
  
  // QR Code methods
  generateCustomerQRCode(customerId: string): Promise<string>;
  generateJobQRCode(jobId: string): Promise<string>;
  
  // Data management
  exportData(): { customers: Customer[]; jobs: Job[] };
  importData(data: { customers: Customer[]; jobs: Job[] }): boolean;
  clearAllData(): void;

  // Analytics methods
  trackEvent(event: AnalyticsEvent): Promise<void>;
  initializeSession(sessionData: SessionInitData): Promise<void>;
  getAnalyticsData(query: AnalyticsQuery): Promise<any>;
  getConversionRates(timeframe: string): Promise<ConversionRate[]>;
  getPopularFeatures(timeframe: string): Promise<FeatureUsage[]>;
  getDemoEngagement(timeframe: string): Promise<DemoEngagement[]>;
  getUserJourneys(timeframe: string): Promise<UserJourney[]>;
}
