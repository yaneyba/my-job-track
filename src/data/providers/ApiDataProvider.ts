import { Customer, Job, DashboardStats } from '@/types';
import { IDataProvider } from './IDataProvider';
import { api } from '@/lib/api';

export class ApiDataProvider implements IDataProvider {
  // Customer methods
  getCustomers(): Customer[] {
    // Note: This method should be async, but interface is sync
    // For now, we'll return empty array and rely on React Query for async data
    console.warn('ApiDataProvider.getCustomers() is synchronous but should be async. Use React Query instead.');
    return [];
  }

  getCustomer(id: string): Customer | undefined {
    console.warn('ApiDataProvider.getCustomer() is synchronous but should be async. Use React Query instead.');
    return undefined;
  }

  async addCustomerAsync(customerData: Omit<Customer, 'id' | 'totalUnpaid'>): Promise<Customer> {
    return await api.createCustomer(customerData);
  }

  addCustomer(customerData: Omit<Customer, 'id' | 'totalUnpaid'>): Customer {
    throw new Error('Use addCustomerAsync instead for API data provider');
  }

  updateCustomer(id: string, updates: Partial<Customer>): Customer | undefined {
    throw new Error('Use async methods with React Query for API data provider');
  }

  deleteCustomer(id: string): boolean {
    throw new Error('Use async methods with React Query for API data provider');
  }

  searchCustomers(query: string): Customer[] {
    console.warn('ApiDataProvider.searchCustomers() is synchronous but should be async. Use React Query instead.');
    return [];
  }

  // Job methods
  getJobs(): Job[] {
    console.warn('ApiDataProvider.getJobs() is synchronous but should be async. Use React Query instead.');
    return [];
  }

  getJob(id: string): Job | undefined {
    console.warn('ApiDataProvider.getJob() is synchronous but should be async. Use React Query instead.');
    return undefined;
  }

  getJobsByCustomer(customerId: string): Job[] {
    console.warn('ApiDataProvider.getJobsByCustomer() is synchronous but should be async. Use React Query instead.');
    return [];
  }

  addJob(jobData: Omit<Job, 'id' | 'qrCodeUrl'>): Job {
    throw new Error('Use async methods with React Query for API data provider');
  }

  updateJob(id: string, updates: Partial<Job>): Job | undefined {
    throw new Error('Use async methods with React Query for API data provider');
  }

  deleteJob(id: string): boolean {
    throw new Error('Use async methods with React Query for API data provider');
  }

  getJobsByDate(date: string): Job[] {
    console.warn('ApiDataProvider.getJobsByDate() is synchronous but should be async. Use React Query instead.');
    return [];
  }

  getJobsByDateRange(startDate: string, endDate: string): Job[] {
    console.warn('ApiDataProvider.getJobsByDateRange() is synchronous but should be async. Use React Query instead.');
    return [];
  }

  // Dashboard methods
  getDashboardStats(date?: string): DashboardStats {
    console.warn('ApiDataProvider.getDashboardStats() is synchronous but should be async. Use React Query instead.');
    return {
      totalCustomers: 0,
      totalJobs: 0,
      todaysJobs: 0,
      completedJobs: 0,
      unpaidAmount: 0,
      weeklyRevenue: 0,
      monthlyRevenue: 0,
      pendingJobs: 0,
      recentJobs: [],
      upcomingJobs: []
    };
  }

  // QR Code methods
  async generateQRCode(data: any): Promise<string> {
    // This would typically be handled by the API or locally
    throw new Error('QR code generation should be handled separately in API mode');
  }

  // Data management
  exportData(): { customers: Customer[]; jobs: Job[] } {
    throw new Error('Data export should be handled via API endpoints');
  }

  importData(data: { customers: Customer[]; jobs: Job[] }): boolean {
    throw new Error('Data import should be handled via API endpoints');
  }

  clearAllData(): void {
    throw new Error('Data clearing should be handled via API endpoints');
  }
}
