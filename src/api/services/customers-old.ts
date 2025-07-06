import { Customer, CreateCustomer, UpdateCustomer } from '../types';
import { generateId, getCurrentTimestamp, buildUpdateClause } from '../utils/db';

export class CustomerService {
  constructor(private db: any) {}

  async getAll(userId: string): Promise<Customer[]> {
    try {
      const customers = await this.db
        .prepare(`
          SELECT c.*, 
                 COUNT(j.id) as jobCount,
                 COALESCE(SUM(CASE WHEN j.paymentStatus = 'unpaid' THEN j.totalAmount ELSE 0 END), 0) as unpaidAmount
          FROM customers c
          LEFT JOIN jobs j ON c.id = j.customerId
          WHERE c.userId = ?
          GROUP BY c.id
          ORDER BY c.name ASC
        `)
        .bind(userId)
        .all();

      return customers.results || [];
    } catch (error) {
      console.error('Get customers error:', error);
      throw new Error('Failed to fetch customers');
    }
  }

  async getById(id: string, userId: string): Promise<Customer | null> {
    try {
      const customer = await this.db
        .prepare(`
          SELECT c.*,
                 COUNT(j.id) as jobCount,
                 COALESCE(SUM(CASE WHEN j.paymentStatus = 'unpaid' THEN j.totalAmount ELSE 0 END), 0) as unpaidAmount
          FROM customers c
          LEFT JOIN jobs j ON c.id = j.customerId
          WHERE c.id = ? AND c.userId = ?
          GROUP BY c.id
        `)
        .bind(id, userId)
        .first();

      return customer || null;
    } catch (error) {
      console.error('Get customer error:', error);
      throw new Error('Failed to fetch customer');
    }
  }

  async create(customerData: CreateCustomer & { userId: string }): Promise<Customer> {
    try {
      const id = generateId();
      const now = getCurrentTimestamp();

      const customer = {
        id,
        userId: customerData.userId,
        name: customerData.name,
        email: customerData.email || null,
        phone: customerData.phone || null,
        address: customerData.address || null,
        businessName: customerData.businessName || null,
        notes: customerData.notes || null,
        createdAt: now,
        updatedAt: now
      };

      await this.db
        .prepare(`
          INSERT INTO customers (id, userId, name, email, phone, address, businessName, notes, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
          customer.id,
          customer.userId,
          customer.name,
          customer.email,
          customer.phone,
          customer.address,
          customer.businessName,
          customer.notes,
          customer.createdAt,
          customer.updatedAt
        )
        .run();

      // Return the created customer (without userId for frontend)
      const { userId: _, ...customerWithoutUserId } = customer;
      return customerWithoutUserId;
    } catch (error) {
      console.error('Create customer error:', error);
      throw new Error('Failed to create customer');
    }
  }

  async update(id: string, customerData: UpdateCustomer, userId: string): Promise<Customer> {
    try {
      // First verify the customer belongs to the user
      const existingCustomer = await this.getById(id, userId);
      if (!existingCustomer) {
        throw new Error('Customer not found');
      }

      const updateData = {
        ...customerData,
        updatedAt: getCurrentTimestamp()
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData];
        }
      });

      if (Object.keys(updateData).length === 1) { // Only updatedAt
        return existingCustomer;
      }

      const { set, values } = buildUpdateClause(updateData);

      await this.db
        .prepare(`UPDATE customers SET ${set} WHERE id = ? AND userId = ?`)
        .bind(...values, id, userId)
        .run();

      // Return updated customer
      return await this.getById(id, userId) as Customer;
    } catch (error) {
      console.error('Update customer error:', error);
      throw new Error('Failed to update customer');
    }
  }

  async delete(id: string, userId: string): Promise<boolean> {
    try {
      // Check if customer has any jobs
      const jobCount = await this.db
        .prepare('SELECT COUNT(*) as count FROM jobs WHERE customerId = ?')
        .bind(id)
        .first();

      if (jobCount && jobCount.count > 0) {
        throw new Error('Cannot delete customer with existing jobs');
      }

      const result = await this.db
        .prepare('DELETE FROM customers WHERE id = ? AND userId = ?')
        .bind(id, userId)
        .run();

      return result.changes > 0;
    } catch (error) {
      console.error('Delete customer error:', error);
      throw new Error('Failed to delete customer');
    }
  }

  async search(query: string, userId: string): Promise<Customer[]> {
    try {
      const searchPattern = `%${query}%`;
      const customers = await this.db
        .prepare(`
          SELECT c.*,
                 COUNT(j.id) as jobCount,
                 COALESCE(SUM(CASE WHEN j.paymentStatus = 'unpaid' THEN j.totalAmount ELSE 0 END), 0) as unpaidAmount
          FROM customers c
          LEFT JOIN jobs j ON c.id = j.customerId
          WHERE c.userId = ? AND (
            c.name LIKE ? OR 
            c.email LIKE ? OR 
            c.phone LIKE ? OR 
            c.businessName LIKE ?
          )
          GROUP BY c.id
          ORDER BY c.name ASC
        `)
        .bind(userId, searchPattern, searchPattern, searchPattern, searchPattern)
        .all();

      return customers.results || [];
    } catch (error) {
      console.error('Search customers error:', error);
      throw new Error('Failed to search customers');
    }
  }

  async getCustomersWithJobs(userId: string): Promise<Customer[]> {
    try {
      const customers = await this.db
        .prepare(`
          SELECT c.*,
                 json_group_array(
                   json_object(
                     'id', j.id,
                     'title', j.title,
                     'status', j.status,
                     'scheduledDate', j.scheduledDate,
                     'totalAmount', j.totalAmount,
                     'paymentStatus', j.paymentStatus
                   )
                 ) as jobs
          FROM customers c
          LEFT JOIN jobs j ON c.id = j.customerId
          WHERE c.userId = ?
          GROUP BY c.id
          ORDER BY c.name ASC
        `)
        .bind(userId)
        .all();

      return (customers.results || []).map((customer: any) => ({
        ...customer,
        jobs: customer.jobs ? JSON.parse(customer.jobs).filter((j: any) => j.id !== null) : []
      }));
    } catch (error) {
      console.error('Get customers with jobs error:', error);
      throw new Error('Failed to fetch customers with jobs');
    }
  }
}
