export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address: string;
  businessName?: string;
  notes?: string;
  serviceType: string;
  totalUnpaid: number;
  createdDate: string;
  qrCode?: string;
  qrCodeUrl: string;
}

export interface Job {
  id: string;
  customerId: string;
  customerName: string;
  title: string;
  description?: string;
  serviceType: string;
  scheduledDate: string;
  dueDate?: string;
  price: number;
  estimatedCost?: number;
  actualCost?: number;
  estimatedHours?: number;
  actualHours?: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'pending' | 'cancelled';
  paymentStatus: 'paid' | 'unpaid';
  paid: boolean;
  notes: string;
  completedDate?: string;
  completedAt?: string;
  createdDate: string;
  qrCode?: string;
  qrCodeUrl: string;
}

export interface DashboardStats {
  todaysJobs: Job[];
  totalUnpaid: number;
  unpaidJobsCount: number;
  thisWeekEarnings: number;
}

// Re-export analytics types
export * from './analytics';