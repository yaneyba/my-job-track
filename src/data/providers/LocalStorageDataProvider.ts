import { v4 as uuidv4 } from 'uuid';
import { Customer, Job, DashboardStats } from '@/types';
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
}
