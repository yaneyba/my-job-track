import { IDataProvider, Customer, Job, DashboardStats } from '../types';
import { format, isToday, startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';
import QRCode from 'qrcode';

export class LocalStorageDataProvider implements IDataProvider {
  private readonly CUSTOMERS_KEY = 'myjobtrack_customers';
  private readonly JOBS_KEY = 'myjobtrack_jobs';

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private saveCustomers(customers: Customer[]): void {
    localStorage.setItem(this.CUSTOMERS_KEY, JSON.stringify(customers));
  }

  private saveJobs(jobs: Job[]): void {
    localStorage.setItem(this.JOBS_KEY, JSON.stringify(jobs));
  }

  // Customer methods
  getCustomers(): Customer[] {
    const data = localStorage.getItem(this.CUSTOMERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  getCustomer(id: string): Customer | undefined {
    return this.getCustomers().find(customer => customer.id === id);
  }

  addCustomer(customerData: Omit<Customer, 'id' | 'createdDate' | 'qrCodeUrl'>): Customer {
    const customers = this.getCustomers();
    const id = this.generateId();
    const customer: Customer = {
      ...customerData,
      id,
      createdDate: new Date().toISOString(),
      qrCodeUrl: `/customer/${id}`,
      totalUnpaid: 0
    };
    
    customers.push(customer);
    this.saveCustomers(customers);
    return customer;
  }

  updateCustomer(id: string, updates: Partial<Customer>): Customer | undefined {
    const customers = this.getCustomers();
    const index = customers.findIndex(customer => customer.id === id);
    
    if (index === -1) return undefined;
    
    customers[index] = { ...customers[index], ...updates };
    this.saveCustomers(customers);
    return customers[index];
  }

  deleteCustomer(id: string): boolean {
    const customers = this.getCustomers();
    const filteredCustomers = customers.filter(customer => customer.id !== id);
    
    if (filteredCustomers.length === customers.length) return false;
    
    this.saveCustomers(filteredCustomers);
    
    // Also delete associated jobs
    const jobs = this.getJobs();
    const filteredJobs = jobs.filter(job => job.customerId !== id);
    this.saveJobs(filteredJobs);
    
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

  // Job methods
  getJobs(): Job[] {
    const data = localStorage.getItem(this.JOBS_KEY);
    return data ? JSON.parse(data) : [];
  }

  getJob(id: string): Job | undefined {
    return this.getJobs().find(job => job.id === id);
  }

  getJobsByCustomer(customerId: string): Job[] {
    return this.getJobs().filter(job => job.customerId === customerId);
  }

  addJob(jobData: Omit<Job, 'id' | 'qrCodeUrl'>): Job {
    const jobs = this.getJobs();
    const id = this.generateId();
    const job: Job = {
      ...jobData,
      id,
      qrCodeUrl: `/job/${id}/complete`
    };
    
    jobs.push(job);
    this.saveJobs(jobs);
    this.updateCustomerTotals();
    return job;
  }

  updateJob(id: string, updates: Partial<Job>): Job | undefined {
    const jobs = this.getJobs();
    const index = jobs.findIndex(job => job.id === id);
    
    if (index === -1) return undefined;
    
    jobs[index] = { ...jobs[index], ...updates };
    this.saveJobs(jobs);
    this.updateCustomerTotals();
    return jobs[index];
  }

  deleteJob(id: string): boolean {
    const jobs = this.getJobs();
    const filteredJobs = jobs.filter(job => job.id !== id);
    
    if (filteredJobs.length === jobs.length) return false;
    
    this.saveJobs(filteredJobs);
    this.updateCustomerTotals();
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
  getDashboardStats(date?: string): DashboardStats {
    const jobs = this.getJobs();
    const targetDate = date ? parseISO(date) : new Date();
    
    const todaysJobs = jobs.filter(job => {
      const jobDate = parseISO(job.scheduledDate);
      return date ? job.scheduledDate === date : isToday(jobDate);
    });

    const unpaidJobs = jobs.filter(job => job.paymentStatus === 'unpaid');
    const totalUnpaid = unpaidJobs.reduce((sum, job) => sum + job.price, 0);

    const weekStart = startOfWeek(targetDate);
    const weekEnd = endOfWeek(targetDate);
    const thisWeekJobs = jobs.filter(job => {
      const jobDate = parseISO(job.scheduledDate);
      return isWithinInterval(jobDate, { start: weekStart, end: weekEnd }) && 
             job.status === 'completed';
    });
    const thisWeekEarnings = thisWeekJobs.reduce((sum, job) => sum + job.price, 0);

    return {
      todaysJobs,
      totalUnpaid,
      unpaidJobsCount: unpaidJobs.length,
      thisWeekEarnings
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

  // Data management
  exportData(): { customers: Customer[]; jobs: Job[] } {
    return {
      customers: this.getCustomers(),
      jobs: this.getJobs()
    };
  }

  importData(data: { customers: Customer[]; jobs: Job[] }): boolean {
    try {
      this.saveCustomers(data.customers);
      this.saveJobs(data.jobs);
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  clearAllData(): void {
    localStorage.removeItem(this.CUSTOMERS_KEY);
    localStorage.removeItem(this.JOBS_KEY);
  }

  private updateCustomerTotals(): void {
    const customers = this.getCustomers();
    const jobs = this.getJobs();
    
    const updatedCustomers = customers.map(customer => {
      const customerJobs = jobs.filter(job => job.customerId === customer.id);
      const totalUnpaid = customerJobs
        .filter(job => job.paymentStatus === 'unpaid')
        .reduce((sum, job) => sum + job.price, 0);
      
      return { ...customer, totalUnpaid };
    });
    
    this.saveCustomers(updatedCustomers);
  }
}