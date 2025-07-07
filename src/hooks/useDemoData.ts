import demoData from '@/data/demo.json';

export interface DemoUserTemplate {
  id: string;
  name: string;
  businessName: string;
  phone: string;
  address: string;
  bio: string;
  createdAt: string;
}

export interface DemoCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface DemoJob {
  id: string;
  customerId: string;
  customerName: string;
  serviceType: string;
  description: string;
  scheduledDate: string;
  estimatedDuration: number;
  price: number;
  status: 'scheduled' | 'in-progress' | 'completed';
  paymentStatus: 'paid' | 'unpaid';
  completedDate?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface DemoNotification {
  id: string;
  type: 'reminder' | 'payment' | 'success' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  jobId?: string;
  customerId?: string;
}

export interface DemoActivity {
  id: string;
  type: 'job_completed' | 'job_started' | 'customer_added' | 'job_scheduled' | 'payment_received';
  description: string;
  timestamp: string;
  jobId?: string;
  customerId?: string;
}

export interface DemoStats {
  totalCustomers: number;
  totalJobs: number;
  completedJobs: number;
  unpaidJobs: number;
  thisWeekJobs: number;
  totalRevenue: number;
  pendingRevenue: number;
}

export interface DemoData {
  demoUserTemplate: DemoUserTemplate;
  customers: DemoCustomer[];
  jobs: DemoJob[];
  serviceTypes: string[];
  dashboardStats: DemoStats;
  notifications: DemoNotification[];
  recentActivity: DemoActivity[];
}

/**
 * Hook to access demo data
 */
export const useDemoData = (): DemoData => {
  return demoData as DemoData;
};

/**
 * Get demo user credentials from environment variables
 */
export const getDemoCredentials = () => {
  return {
    email: import.meta.env.VITE_DEMO_EMAIL,
    password: import.meta.env.VITE_DEMO_PASSWORD
  };
};

/**
 * Create demo user object with environment credentials for demo mode
 */
export const createDemoUser = () => {
  const credentials = getDemoCredentials();
  const template = demoData.demoUserTemplate;
  
  return {
    ...template,
    email: credentials.email,
    password: credentials.password
  };
};

/**
 * Get demo data for localStorage (backward compatibility)
 * Note: User data should come from database in API mode
 */
export const getDemoDataForStorage = () => {
  return {
    customers: demoData.customers,
    jobs: demoData.jobs,
    notifications: demoData.notifications,
    stats: demoData.dashboardStats
  };
};

export default demoData;
