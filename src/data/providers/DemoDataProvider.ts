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
