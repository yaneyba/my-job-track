import { Customer, CreateCustomer, UpdateCustomer } from '../types';
import { generateId, getCurrentTimestamp } from '../utils/db';

export class CustomerService {
  constructor(private db: any) {}

  async getAll(userId: string): Promise<Customer[]> {
    try {
      const customers = await this.db
        .prepare(`
          SELECT c.*, 
                 COUNT(j.id) as job_count,
                 COALESCE(SUM(CASE WHEN j.paid = false AND j.actual_cost IS NOT NULL THEN j.actual_cost ELSE 0 END), 0) as unpaid_amount
          FROM customers c
          LEFT JOIN jobs j ON c.id = j.customer_id AND c.user_id = j.user_id
          WHERE c.user_id = ?
          GROUP BY c.id
          ORDER BY c.name ASC
        `)
        .bind(userId)
        .all();

      return customers.results || [];
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw new Error('Failed to fetch customers');
    }
  }

  async getById(customerId: string, userId: string): Promise<Customer | null> {
    try {
      const customer = await this.db
        .prepare(`
          SELECT c.*, 
                 COUNT(j.id) as job_count,
                 COALESCE(SUM(CASE WHEN j.paid = false AND j.actual_cost IS NOT NULL THEN j.actual_cost ELSE 0 END), 0) as unpaid_amount
          FROM customers c
          LEFT JOIN jobs j ON c.id = j.customer_id AND c.user_id = j.user_id
          WHERE c.id = ? AND c.user_id = ?
          GROUP BY c.id
        `)
        .bind(customerId, userId)
        .first();

      return customer || null;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw new Error('Failed to fetch customer');
    }
  }

  async create(customerData: CreateCustomer & { userId: string }): Promise<Customer> {
    try {
      const customerId = generateId();
      const now = getCurrentTimestamp();

      await this.db
        .prepare(`
          INSERT INTO customers (id, user_id, name, email, phone, address, business_name, notes, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
          customerId,
          customerData.userId,
          customerData.name,
          customerData.email || null,
          customerData.phone || null,
          customerData.address || null,
          customerData.business_name || null,
          customerData.notes || null,
          now,
          now
        )
        .run();

      // Return the created customer
      const customer = await this.getById(customerId, customerData.userId);
      if (!customer) {
        throw new Error('Failed to retrieve created customer');
      }

      return customer;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw new Error('Failed to create customer');
    }
  }

  async update(customerId: string, customerData: UpdateCustomer, userId: string): Promise<Customer> {
    try {
      // Check if customer exists and belongs to user
      const existingCustomer = await this.getById(customerId, userId);
      if (!existingCustomer) {
        throw new Error('Customer not found');
      }

      const now = getCurrentTimestamp();
      const updateFields: string[] = [];
      const params: any[] = [];

      // Build dynamic update query
      if (customerData.name !== undefined) {
        updateFields.push('name = ?');
        params.push(customerData.name);
      }
      if (customerData.email !== undefined) {
        updateFields.push('email = ?');
        params.push(customerData.email);
      }
      if (customerData.phone !== undefined) {
        updateFields.push('phone = ?');
        params.push(customerData.phone);
      }
      if (customerData.address !== undefined) {
        updateFields.push('address = ?');
        params.push(customerData.address);
      }
      if (customerData.business_name !== undefined) {
        updateFields.push('business_name = ?');
        params.push(customerData.business_name);
      }
      if (customerData.notes !== undefined) {
        updateFields.push('notes = ?');
        params.push(customerData.notes);
      }

      if (updateFields.length === 0) {
        return existingCustomer; // No updates to apply
      }

      // Always update the updated_at timestamp
      updateFields.push('updated_at = ?');
      params.push(now);

      // Add WHERE clause parameters
      params.push(customerId, userId);

      const query = `
        UPDATE customers 
        SET ${updateFields.join(', ')}
        WHERE id = ? AND user_id = ?
      `;

      await this.db
        .prepare(query)
        .bind(...params)
        .run();

      // Return the updated customer
      const customer = await this.getById(customerId, userId);
      if (!customer) {
        throw new Error('Failed to retrieve updated customer');
      }

      return customer;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw new Error('Failed to update customer');
    }
  }

  async delete(customerId: string, userId: string): Promise<boolean> {
    try {
      // Check if customer exists and belongs to user
      const existingCustomer = await this.getById(customerId, userId);
      if (!existingCustomer) {
        throw new Error('Customer not found');
      }

      // Check if customer has any jobs
      const jobCount = await this.db
        .prepare('SELECT COUNT(*) as count FROM jobs WHERE customer_id = ? AND user_id = ?')
        .bind(customerId, userId)
        .first();

      if (jobCount?.count > 0) {
        throw new Error('Cannot delete customer with existing jobs');
      }

      const result = await this.db
        .prepare('DELETE FROM customers WHERE id = ? AND user_id = ?')
        .bind(customerId, userId)
        .run();

      return result.changes > 0;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw new Error('Failed to delete customer');
    }
  }

  async search(userId: string, query: string): Promise<Customer[]> {
    try {
      const searchTerm = `%${query}%`;
      const customers = await this.db
        .prepare(`
          SELECT c.*, 
                 COUNT(j.id) as job_count,
                 COALESCE(SUM(CASE WHEN j.paid = false AND j.actual_cost IS NOT NULL THEN j.actual_cost ELSE 0 END), 0) as unpaid_amount
          FROM customers c
          LEFT JOIN jobs j ON c.id = j.customer_id AND c.user_id = j.user_id
          WHERE c.user_id = ? AND (
            c.name LIKE ? OR 
            c.email LIKE ? OR 
            c.phone LIKE ? OR
            c.business_name LIKE ?
          )
          GROUP BY c.id
          ORDER BY c.name ASC
        `)
        .bind(userId, searchTerm, searchTerm, searchTerm, searchTerm)
        .all();

      return customers.results || [];
    } catch (error) {
      console.error('Error searching customers:', error);
      throw new Error('Failed to search customers');
    }
  }

  async getCustomerJobs(customerId: string, userId: string): Promise<any[]> {
    try {
      const jobs = await this.db
        .prepare(`
          SELECT * FROM jobs 
          WHERE customer_id = ? AND user_id = ?
          ORDER BY created_at DESC
        `)
        .bind(customerId, userId)
        .all();

      return jobs.results || [];
    } catch (error) {
      console.error('Error fetching customer jobs:', error);
      throw new Error('Failed to fetch customer jobs');
    }
  }

  async getCustomerStats(customerId: string, userId: string): Promise<{
    totalJobs: number;
    completedJobs: number;
    pendingJobs: number;
    totalRevenue: number;
    unpaidAmount: number;
  }> {
    try {
      const stats = await this.db
        .prepare(`
          SELECT 
            COUNT(*) as total_jobs,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_jobs,
            SUM(CASE WHEN status IN ('pending', 'in_progress') THEN 1 ELSE 0 END) as pending_jobs,
            SUM(CASE WHEN paid = true AND actual_cost IS NOT NULL THEN actual_cost ELSE 0 END) as total_revenue,
            SUM(CASE WHEN paid = false AND status = 'completed' AND actual_cost IS NOT NULL THEN actual_cost ELSE 0 END) as unpaid_amount
          FROM jobs 
          WHERE customer_id = ? AND user_id = ?
        `)
        .bind(customerId, userId)
        .first();

      return {
        totalJobs: Number(stats?.total_jobs || 0),
        completedJobs: Number(stats?.completed_jobs || 0),
        pendingJobs: Number(stats?.pending_jobs || 0),
        totalRevenue: Number(stats?.total_revenue || 0),
        unpaidAmount: Number(stats?.unpaid_amount || 0)
      };
    } catch (error) {
      console.error('Error fetching customer stats:', error);
      throw new Error('Failed to fetch customer stats');
    }
  }
}
