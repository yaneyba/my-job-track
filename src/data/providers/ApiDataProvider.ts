import { Customer, Job, DashboardStats } from '@/types';
import { IDataProvider } from './IDataProvider';
import apiClient from '@/lib/api';

export class ApiDataProvider implements IDataProvider {
  private customersCache: Customer[] = [];
  private jobsCache: Job[] = [];
  private lastFetchTime = 0;
  private readonly CACHE_TTL = 30000; // 30 seconds cache

  constructor() {
    console.log('🚀 ApiDataProvider initialized - using API mode!');
    console.log('🔑 Current auth token:', apiClient.getToken() ? 'Present' : 'Missing');
    // Pre-fetch data on initialization only if we have a token
    if (apiClient.getToken()) {
      this.refreshCache();
    } else {
      console.log('⚠️ No auth token found, skipping initial cache refresh');
    }
  }

  private async refreshCache(): Promise<void> {
    try {
      const now = Date.now();
      if (now - this.lastFetchTime < this.CACHE_TTL) {
        return; // Use cached data
      }

      // Check if we have a valid token before making API calls
      if (!apiClient.getToken()) {
        console.log('⚠️ No auth token available, skipping cache refresh');
        return;
      }

      console.log('🔄 Refreshing cache from API...');

      // Fetch customers and jobs in parallel
      const [customers, jobs] = await Promise.all([
        apiClient.getCustomers(),
        apiClient.getJobs()
      ]);

      // Only update cache if we got valid data
      if (Array.isArray(customers) && Array.isArray(jobs)) {
        this.customersCache = customers.map(this.mapApiCustomerToAppCustomer);
        this.jobsCache = jobs.map(this.mapApiJobToAppJob);
        
        // Update totalUnpaid for each customer after jobs are loaded
        this.customersCache = this.customersCache.map(customer => ({
          ...customer,
          totalUnpaid: this.calculateCustomerUnpaid(customer.id)
        }));
        
        this.lastFetchTime = now;
        console.log(`✅ Cache refreshed: ${this.customersCache.length} customers, ${this.jobsCache.length} jobs`);
      } else {
        console.warn('⚠️ API returned invalid data format, keeping existing cache');
      }
    } catch (error) {
      // Check if this is an authentication error (expected when logging out from demo mode)
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.log('⚠️ API request failed (likely due to missing authentication), keeping existing cache');
      } else {
        console.error('❌ Failed to refresh cache:', error);
      }
      console.warn('🔄 Continuing with existing cache data');
      // Don't update lastFetchTime on error so we'll retry sooner
    }
  }

  private mapApiCustomerToAppCustomer = (apiCustomer: any): Customer => {
    return {
      id: apiCustomer.id,
      name: apiCustomer.name,
      email: apiCustomer.email || '',
      phone: apiCustomer.phone || '',
      address: apiCustomer.address || '',
      businessName: apiCustomer.business_name || '',
      notes: apiCustomer.notes || '',
      serviceType: 'General Service', // Default service type
      createdDate: apiCustomer.created_at,
      totalUnpaid: 0, // Will be calculated later
      qrCodeUrl: `qr-customer-${apiCustomer.id}`
    };
  }

  private mapApiJobToAppJob = (apiJob: any): Job => {
    // Map API status to app status
    const mapStatus = (apiStatus: string): 'scheduled' | 'in-progress' | 'completed' | 'pending' | 'cancelled' => {
      switch (apiStatus) {
        case 'pending': return 'pending';
        case 'in_progress': return 'in-progress';
        case 'completed': return 'completed';
        case 'cancelled': return 'cancelled';
        default: return 'scheduled';
      }
    };

    return {
      id: apiJob.id,
      customerId: apiJob.customer_id,
      customerName: apiJob.customer?.name || 'Unknown Customer',
      title: apiJob.title,
      description: apiJob.description || '',
      serviceType: 'General Service', // Default service type
      scheduledDate: apiJob.due_date || apiJob.created_at,
      dueDate: apiJob.due_date || '',
      price: apiJob.actual_cost || apiJob.estimated_cost || 0,
      estimatedCost: apiJob.estimated_cost || 0,
      actualCost: apiJob.actual_cost || 0,
      estimatedHours: apiJob.estimated_hours || 0,
      actualHours: apiJob.actual_hours || 0,
      status: mapStatus(apiJob.status),
      paymentStatus: apiJob.paid ? 'paid' : 'unpaid',
      paid: apiJob.paid || false,
      notes: apiJob.description || '',
      completedDate: apiJob.completed_at || '',
      completedAt: apiJob.completed_at || '',
      createdDate: apiJob.created_at,
      qrCodeUrl: `qr-job-${apiJob.id}`
    };
  }

  private calculateCustomerUnpaid(customerId: string): number {
    return this.jobsCache
      .filter(job => job.customerId === customerId && !job.paid)
      .reduce((total, job) => total + (job.actualCost || job.estimatedCost || job.price || 0), 0);
  }
  
  // Customer methods
  getCustomers(): Customer[] {
    // Trigger cache refresh in background if needed
    const cacheAge = Date.now() - this.lastFetchTime;
    console.log(`📋 Getting customers (cache age: ${Math.round(cacheAge/1000)}s, ${this.customersCache.length} in cache)`);
    
    this.refreshCache();
    return this.customersCache;
  }

  getCustomer(id: string): Customer | undefined {
    this.refreshCache();
    return this.customersCache.find(customer => customer.id === id);
  }

  async addCustomerAsync(customerData: Omit<Customer, 'id' | 'totalUnpaid' | 'createdDate' | 'qrCodeUrl'>): Promise<Customer> {
    try {
      console.log('🌐 Sending customer to API:', customerData);
      
      const apiCustomerData = {
        name: customerData.name,
        email: customerData.email || undefined,
        phone: customerData.phone || undefined,
        address: customerData.address || undefined,
        business_name: customerData.businessName || undefined,
        notes: customerData.notes || undefined
      };
      
      console.log('📤 API payload:', apiCustomerData);
      const apiCustomer = await apiClient.createCustomer(apiCustomerData);
      console.log('📥 API response:', apiCustomer);
      
      const newCustomer = this.mapApiCustomerToAppCustomer(apiCustomer);
      
      // Update cache (don't duplicate, this is for direct async calls)
      const existingIndex = this.customersCache.findIndex(c => c.id === apiCustomer.id);
      if (existingIndex === -1) {
        this.customersCache.push(newCustomer);
        console.log('💾 Added new customer to cache via async method');
      }
      
      return newCustomer;
    } catch (error) {
      console.error('❌ Failed to add customer via API:', error);
      throw error;
    }
  }

  addCustomer(customer: Omit<Customer, 'id' | 'createdDate' | 'qrCodeUrl' | 'totalUnpaid'>): Customer {
    console.log('➕ Adding customer optimistically:', customer.name);
    
    // For synchronous interface, create optimistic customer and sync in background
    const newCustomer: Customer = {
      ...customer,
      id: `temp-${Date.now()}`,
      totalUnpaid: 0, // Initial value, will be calculated
      createdDate: new Date().toISOString(),
      qrCodeUrl: `qr-customer-temp-${Date.now()}`
    };

    this.customersCache.push(newCustomer);
    console.log(`💾 Customer added to cache with temp ID: ${newCustomer.id}`);

    // Sync to API in background - but keep customer even if API fails
    this.addCustomerAsync(customer).then(savedCustomer => {
      console.log(`✅ Customer synced to API successfully:`, savedCustomer);
      // Replace temporary customer with real one
      const index = this.customersCache.findIndex(c => c.id === newCustomer.id);
      if (index !== -1) {
        this.customersCache[index] = savedCustomer;
        console.log(`🔄 Replaced temp customer with real customer ID: ${savedCustomer.id}`);
      } else {
        console.warn(`⚠️ Could not find temp customer ${newCustomer.id} in cache to replace`);
      }
    }).catch(error => {
      console.error('❌ Failed to sync customer to API:', error);
      console.warn('🔄 Keeping customer in local cache since API is unavailable');
      
      // Convert temp ID to a more permanent local ID instead of removing
      const index = this.customersCache.findIndex(c => c.id === newCustomer.id);
      if (index !== -1) {
        this.customersCache[index] = {
          ...this.customersCache[index],
          id: `local-${Date.now()}`, // Use local ID instead of temp
          qrCodeUrl: `qr-customer-local-${Date.now()}`
        };
        console.log(`� Converted temp customer to local customer for offline use`);
      }
    });

    return newCustomer;
  }

  updateCustomer(id: string, updates: Partial<Customer>): Customer | undefined {
    const customerIndex = this.customersCache.findIndex(c => c.id === id);
    if (customerIndex === -1) return undefined;

    // Update cache optimistically
    this.customersCache[customerIndex] = { ...this.customersCache[customerIndex], ...updates };
    const updatedCustomer = this.customersCache[customerIndex];

    // Sync to API in background
    const apiUpdates = {
      name: updates.name,
      email: updates.email,
      phone: updates.phone,
      address: updates.address,
      business_name: updates.businessName,
      notes: updates.notes
    };
    
    apiClient.updateCustomer(id, apiUpdates).catch(error => {
      console.error('Failed to sync customer update to API:', error);
      // Could implement rollback logic here
    });

    return updatedCustomer;
  }

  deleteCustomer(id: string): boolean {
    const customerIndex = this.customersCache.findIndex(c => c.id === id);
    if (customerIndex === -1) return false;

    // Remove from cache optimistically
    const deletedCustomer = this.customersCache.splice(customerIndex, 1)[0];

    // Sync to API in background
    apiClient.deleteCustomer(id).catch(error => {
      console.error('Failed to delete customer from API:', error);
      // Restore customer on error
      this.customersCache.push(deletedCustomer);
    });

    return true;
  }

  searchCustomers(query: string): Customer[] {
    const lowerQuery = query.toLowerCase();
    return this.customersCache.filter(customer =>
      customer.name.toLowerCase().includes(lowerQuery) ||
      (customer.email && customer.email.toLowerCase().includes(lowerQuery)) ||
      customer.phone.includes(query) ||
      (customer.businessName && customer.businessName.toLowerCase().includes(lowerQuery))
    );
  }

  // Job methods
  getJobs(): Job[] {
    this.refreshCache();
    return this.jobsCache;
  }

  getJob(id: string): Job | undefined {
    this.refreshCache();
    return this.jobsCache.find(job => job.id === id);
  }

  getJobsByCustomer(customerId: string): Job[] {
    return this.jobsCache.filter(job => job.customerId === customerId);
  }

  addJob(jobData: Omit<Job, 'id' | 'qrCodeUrl' | 'createdDate' | 'customerName'>): Job {
    // Find customer name
    const customer = this.customersCache.find(c => c.id === jobData.customerId);
    const customerName = customer?.name || 'Unknown Customer';

    // Create optimistic job
    const newJob: Job = {
      ...jobData,
      id: `temp-${Date.now()}`,
      customerName,
      createdDate: new Date().toISOString(),
      qrCodeUrl: `qr-job-temp-${Date.now()}`
    };

    this.jobsCache.push(newJob);

    // Sync to API in background
    const mapAppStatusToApiStatus = (appStatus: string): 'pending' | 'in_progress' | 'completed' | 'cancelled' => {
      switch (appStatus) {
        case 'scheduled': return 'pending';
        case 'in-progress': return 'in_progress';
        case 'completed': return 'completed';
        case 'cancelled': return 'cancelled';
        case 'pending': return 'pending';
        default: return 'pending';
      }
    };

    const apiJobData = {
      customer_id: jobData.customerId,
      title: jobData.title,
      description: jobData.description,
      status: mapAppStatusToApiStatus(jobData.status),
      estimated_cost: jobData.estimatedCost,
      actual_cost: jobData.actualCost,
      estimated_hours: jobData.estimatedHours,
      actual_hours: jobData.actualHours,
      due_date: jobData.dueDate || jobData.scheduledDate,
      paid: jobData.paid
    };

    apiClient.createJob(apiJobData).then(savedJob => {
      const index = this.jobsCache.findIndex(j => j.id === newJob.id);
      if (index !== -1) {
        this.jobsCache[index] = this.mapApiJobToAppJob(savedJob);
        console.log(`✅ Job synced to API successfully: ${savedJob.id}`);
      }
    }).catch(error => {
      console.error('❌ Failed to sync job to API:', error);
      console.warn('🔄 Keeping job in local cache since API is unavailable');
      
      // Convert temp ID to local ID instead of removing
      const index = this.jobsCache.findIndex(j => j.id === newJob.id);
      if (index !== -1) {
        this.jobsCache[index] = {
          ...this.jobsCache[index],
          id: `local-job-${Date.now()}`,
          qrCodeUrl: `qr-job-local-${Date.now()}`
        };
        console.log(`💾 Converted temp job to local job for offline use`);
      }
    });

    return newJob;
  }

  updateJob(id: string, updates: Partial<Job>): Job | undefined {
    const jobIndex = this.jobsCache.findIndex(j => j.id === id);
    if (jobIndex === -1) return undefined;

    // Update cache optimistically
    this.jobsCache[jobIndex] = { ...this.jobsCache[jobIndex], ...updates };
    const updatedJob = this.jobsCache[jobIndex];

    // Sync to API in background
    const mapAppStatusToApiStatus = (appStatus: string): 'pending' | 'in_progress' | 'completed' | 'cancelled' => {
      switch (appStatus) {
        case 'scheduled': return 'pending';
        case 'in-progress': return 'in_progress';
        case 'completed': return 'completed';
        case 'cancelled': return 'cancelled';
        case 'pending': return 'pending';
        default: return 'pending';
      }
    };

    const apiUpdates = {
      title: updates.title,
      description: updates.description,
      status: updates.status ? mapAppStatusToApiStatus(updates.status) : undefined,
      estimated_cost: updates.estimatedCost,
      actual_cost: updates.actualCost,
      estimated_hours: updates.estimatedHours,
      actual_hours: updates.actualHours,
      due_date: updates.dueDate || updates.scheduledDate,
      paid: updates.paid
    };

    apiClient.updateJob(id, apiUpdates).catch(error => {
      console.error('Failed to sync job update to API:', error);
    });

    return updatedJob;
  }

  deleteJob(id: string): boolean {
    const jobIndex = this.jobsCache.findIndex(j => j.id === id);
    if (jobIndex === -1) return false;

    // Remove from cache optimistically
    const deletedJob = this.jobsCache.splice(jobIndex, 1)[0];

    // Sync to API in background
    apiClient.deleteJob(id).catch(error => {
      console.error('Failed to delete job from API:', error);
      // Restore job on error
      this.jobsCache.push(deletedJob);
    });

    return true;
  }

  getJobsByDate(date: string): Job[] {
    return this.jobsCache.filter(job => 
      job.dueDate === date || job.scheduledDate === date
    );
  }

  getJobsByDateRange(startDate: string, endDate: string): Job[] {
    return this.jobsCache.filter(job => {
      const jobDate = job.dueDate || job.scheduledDate;
      if (!jobDate) return false;
      return jobDate >= startDate && jobDate <= endDate;
    });
  }

  // Dashboard methods
  getDashboardStats(date?: string): DashboardStats {
    const today = date || new Date().toISOString().split('T')[0];
    const todaysJobs = this.getJobsByDate(today);
    
    const unpaidJobs = this.jobsCache.filter(job => !job.paid);
    const totalUnpaid = unpaidJobs.reduce((total, job) => 
      total + (job.actualCost || job.estimatedCost || job.price || 0), 0);
    
    // Calculate this week's earnings
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekStartStr = weekStart.toISOString().split('T')[0];
    
    const thisWeekJobs = this.jobsCache.filter(job => 
      job.paid && job.completedAt && job.completedAt >= weekStartStr);
    const thisWeekEarnings = thisWeekJobs.reduce((total, job) => 
      total + (job.actualCost || job.estimatedCost || job.price || 0), 0);

    return {
      todaysJobs,
      totalUnpaid,
      unpaidJobsCount: unpaidJobs.length,
      thisWeekEarnings
    };
  }

  // QR Code methods
  async generateCustomerQRCode(customerId: string): Promise<string> {
    const baseUrl = window.location.origin;
    const qrData = `${baseUrl}/customer/${customerId}`;
    return `qr-customer-${customerId}-${qrData}`;
  }

  async generateJobQRCode(jobId: string): Promise<string> {
    const baseUrl = window.location.origin;
    const qrData = `${baseUrl}/job/${jobId}`;
    return `qr-job-${jobId}-${qrData}`;
  }

  // Data management
  exportData(): { customers: Customer[]; jobs: Job[] } {
    return {
      customers: this.customersCache,
      jobs: this.jobsCache
    };
  }

  importData(_data: { customers: Customer[]; jobs: Job[] }): boolean {
    try {
      // This would need proper API implementation for bulk import
      console.warn('Data import should be handled via API endpoints');
      return false;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  }

  clearAllData(): void {
    // Clear local cache
    this.customersCache = [];
    this.jobsCache = [];
    this.lastFetchTime = 0;
    
    // Note: API-based clearing would need separate endpoint
    console.warn('Full data clearing should be handled via API endpoints');
  }
}
