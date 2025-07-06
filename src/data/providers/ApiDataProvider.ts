import { Customer, Job, DashboardStats } from '@/types';
import { IDataProvider } from './IDataProvider';
import apiClient from '@/lib/api';

export class ApiDataProvider implements IDataProvider {
  // Customer methods
  getCustomers(): Customer[] {
    // Note: This method should be async, but interface is sync
    // For now, we'll return empty array and rely on React Query for async data
    console.warn('ApiDataProvider.getCustomers() is synchronous but should be async. Use React Query instead.');
    return [];
  }

  getCustomer(_id: string): Customer | undefined {
    console.warn('ApiDataProvider.getCustomer() is synchronous but should be async. Use React Query instead.');
    return undefined;
  }

  async addCustomerAsync(customerData: Omit<Customer, 'id' | 'totalUnpaid'>): Promise<Customer> {
    // Note: Type mismatch between API Customer and App Customer types
    // This method should handle the type mapping when fully implemented
    const apiResult = await apiClient.createCustomer(customerData as any);
    return apiResult as unknown as Customer;
  }

  addCustomer(_customer: Omit<Customer, 'id' | 'createdDate' | 'qrCodeUrl'>): Customer {
    // Since the interface is synchronous but API calls are async,
    // this should not be used. Use React Query hooks instead.
    throw new Error('Use React Query hooks for async API operations');
  }

  updateCustomer(_id: string, _updates: Partial<Customer>): Customer | undefined {
    throw new Error('Use async methods with React Query for API data provider');
  }

  deleteCustomer(_id: string): boolean {
    throw new Error('Use async methods with React Query for API data provider');
  }

  searchCustomers(_query: string): Customer[] {
    console.warn('ApiDataProvider.searchCustomers() is synchronous but should be async. Use React Query instead.');
    return [];
  }

  // Job methods
  getJobs(): Job[] {
    console.warn('ApiDataProvider.getJobs() is synchronous but should be async. Use React Query instead.');
    return [];
  }

  getJob(_id: string): Job | undefined {
    console.warn('ApiDataProvider.getJob() is synchronous but should be async. Use React Query instead.');
    return undefined;
  }

  getJobsByCustomer(_customerId: string): Job[] {
    console.warn('ApiDataProvider.getJobsByCustomer() is synchronous but should be async. Use React Query instead.');
    return [];
  }

  addJob(_jobData: Omit<Job, 'id' | 'qrCodeUrl'>): Job {
    throw new Error('Use async methods with React Query for API data provider');
  }

  updateJob(_id: string, _updates: Partial<Job>): Job | undefined {
    throw new Error('Use async methods with React Query for API data provider');
  }

  deleteJob(_id: string): boolean {
    throw new Error('Use async methods with React Query for API data provider');
  }

  getJobsByDate(_date: string): Job[] {
    console.warn('ApiDataProvider.getJobsByDate() is synchronous but should be async. Use React Query instead.');
    return [];
  }

  getJobsByDateRange(_startDate: string, _endDate: string): Job[] {
    console.warn('ApiDataProvider.getJobsByDateRange() is synchronous but should be async. Use React Query instead.');
    return [];
  }

  // Dashboard methods
  getDashboardStats(_date?: string): DashboardStats {
    console.warn('ApiDataProvider.getDashboardStats() is synchronous but should be async. Use React Query instead.');
    return {
      todaysJobs: [],
      totalUnpaid: 0,
      unpaidJobsCount: 0,
      thisWeekEarnings: 0
    };
  }

  // QR Code methods
  async generateCustomerQRCode(customerId: string): Promise<string> {
    // Generate QR code for customer - this should be handled via API or locally
    console.warn('QR code generation should be handled via React Query and API endpoints');
    return `qr-customer-${customerId}`;
  }

  async generateJobQRCode(jobId: string): Promise<string> {
    // Generate QR code for job - this should be handled via API or locally
    console.warn('QR code generation should be handled via React Query and API endpoints');
    return `qr-job-${jobId}`;
  }

  // Data management
  exportData(): { customers: Customer[]; jobs: Job[] } {
    throw new Error('Data export should be handled via API endpoints');
  }

  importData(_data: { customers: Customer[]; jobs: Job[] }): boolean {
    throw new Error('Data import should be handled via API endpoints');
  }

  clearAllData(): void {
    throw new Error('Data clearing should be handled via API endpoints');
  }
}
