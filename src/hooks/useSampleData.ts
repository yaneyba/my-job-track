import { useEffect } from 'react';
import { DataProviderFactory } from '../data/DataProviderFactory';

export const useSampleData = () => {
  const dataProvider = DataProviderFactory.getInstance();

  useEffect(() => {
    const customers = dataProvider.getCustomers();
    const jobs = dataProvider.getJobs();

    // Only add sample data if the app is completely empty
    if (customers.length === 0 && jobs.length === 0) {
      // Add sample customers
      const sampleCustomers = [
        {
          name: 'John Smith',
          phone: '555-0123',
          address: '123 Main St, Springfield, IL',
          serviceType: 'Lawn Care',
          totalUnpaid: 0
        },
        {
          name: 'Sarah Johnson',
          phone: '555-0456',
          address: '456 Oak Ave, Springfield, IL',
          serviceType: 'House Cleaning',
          totalUnpaid: 0
        },
        {
          name: 'Mike Wilson',
          phone: '555-0789',
          address: '789 Pine Rd, Springfield, IL',
          serviceType: 'Handyman Services',
          totalUnpaid: 0
        }
      ];

      const createdCustomers = sampleCustomers.map(customer => 
        dataProvider.addCustomer(customer)
      );

      // Add sample jobs
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      const sampleJobs = [
        {
          customerId: createdCustomers[0].id,
          customerName: createdCustomers[0].name,
          serviceType: 'Lawn Mowing',
          scheduledDate: today.toISOString().split('T')[0],
          price: 75.00,
          status: 'completed' as const,
          paymentStatus: 'unpaid' as const,
          notes: 'Regular weekly mowing, trim edges',
          completedDate: today.toISOString()
        },
        {
          customerId: createdCustomers[1].id,
          customerName: createdCustomers[1].name,
          serviceType: 'Deep Clean',
          scheduledDate: tomorrow.toISOString().split('T')[0],
          price: 150.00,
          status: 'scheduled' as const,
          paymentStatus: 'unpaid' as const,
          notes: 'Full house deep clean, including bathrooms and kitchen'
        },
        {
          customerId: createdCustomers[2].id,
          customerName: createdCustomers[2].name,
          serviceType: 'Fence Repair',
          scheduledDate: nextWeek.toISOString().split('T')[0],
          price: 200.00,
          status: 'scheduled' as const,
          paymentStatus: 'unpaid' as const,
          notes: 'Fix broken fence panels in backyard'
        }
      ];

      sampleJobs.forEach(job => dataProvider.addJob(job));
    }
  }, [dataProvider]);
};