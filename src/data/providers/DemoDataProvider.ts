import { IDataProvider } from './IDataProvider';
import { Customer, Job, DashboardStats } from '@/types';
import { DemoData, getDemoCredentials, createDemoUser } from '@/hooks/useDemoData';
import demoData from '@/data/demo.json';
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
    return this.demoData.customers.map(customer => ({
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
    }));
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

  addCustomer(_customerData: Omit<Customer, 'id' | 'createdDate' | 'qrCodeUrl'>): Customer {
    console.warn('DemoDataProvider: Add customer operation disabled in demo mode');
    throw new Error('Demo mode: Cannot add customers');
  }

  updateCustomer(_id: string, _updates: Partial<Customer>): Customer | undefined {
    console.warn('DemoDataProvider: Update customer operation disabled in demo mode');
    throw new Error('Demo mode: Cannot update customers');
  }

  deleteCustomer(_id: string): boolean {
    console.warn('DemoDataProvider: Delete customer operation disabled in demo mode');
    throw new Error('Demo mode: Cannot delete customers');
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
    return this.demoData.jobs.map(job => ({
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
    }));
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

  addJob(_jobData: Omit<Job, 'id' | 'qrCodeUrl' | 'createdDate' | 'customerName'>): Job {
    console.warn('DemoDataProvider: Add job operation disabled in demo mode');
    throw new Error('Demo mode: Cannot add jobs');
  }

  updateJob(_id: string, _updates: Partial<Job>): Job | undefined {
    console.warn('DemoDataProvider: Update job operation disabled in demo mode');
    throw new Error('Demo mode: Cannot update jobs');
  }

  deleteJob(_id: string): boolean {
    console.warn('DemoDataProvider: Delete job operation disabled in demo mode');
    throw new Error('Demo mode: Cannot delete jobs');
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
    console.warn('DemoDataProvider: Clear data operation disabled in demo mode');
    throw new Error('Demo mode: Cannot clear data');
  }

  // Helper methods
  private calculateCustomerUnpaid(customerId: string): number {
    return this.demoData.jobs
      .filter(job => job.customerId === customerId && job.paymentStatus === 'unpaid')
      .reduce((total, job) => total + job.price, 0);
  }
}
