export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
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
  serviceType: string;
  scheduledDate: string;
  price: number;
  status: 'scheduled' | 'in-progress' | 'completed';
  paymentStatus: 'paid' | 'unpaid';
  notes: string;
  completedDate?: string;
  qrCode?: string;
  qrCodeUrl: string;
}

export interface DashboardStats {
  todaysJobs: Job[];
  totalUnpaid: number;
  unpaidJobsCount: number;
  thisWeekEarnings: number;
}