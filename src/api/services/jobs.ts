// Job service for managing job data
import { Job, JobStatus, CreateJobRequest, UpdateJobRequest } from '../types';
import { executeQuery, getFirstRow } from '../utils/db';

export class JobService {
  constructor(private db: any) {} // D1Database type available at runtime

  async createJob(userId: string, jobData: CreateJobRequest): Promise<Job> {
    const jobId = crypto.randomUUID();
    const now = new Date().toISOString();

    const query = `
      INSERT INTO jobs (
        id, user_id, customer_id, title, description, status, 
        estimated_cost, actual_cost, estimated_hours, actual_hours,
        due_date, paid, completed_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      jobId,
      userId,
      jobData.customer_id,
      jobData.title,
      jobData.description || null,
      jobData.status || 'pending',
      jobData.estimated_cost || null,
      jobData.actual_cost || null,
      jobData.estimated_hours || null,
      jobData.actual_hours || null,
      jobData.due_date || null,
      false, // paid - explicitly set to false for new jobs
      null,  // completed_at - null for new jobs
      now,
      now
    ];

    await executeQuery(this.db, query, params);

    // Return the created job
    const createdJob = await this.getJobById(userId, jobId);
    if (!createdJob) {
      throw new Error('Failed to create job');
    }

    return createdJob;
  }

  async getJobById(userId: string, jobId: string): Promise<Job | null> {
    const query = `
      SELECT j.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone
      FROM jobs j
      LEFT JOIN customers c ON j.customer_id = c.id
      WHERE j.id = ? AND j.user_id = ?
    `;

    const result = await getFirstRow(this.db, query, [jobId, userId]);
    
    if (!result) {
      return null;
    }

    return this.mapRowToJob(result);
  }

  async getJobsByUserId(userId: string, limit = 50, offset = 0): Promise<Job[]> {
    const query = `
      SELECT j.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone
      FROM jobs j
      LEFT JOIN customers c ON j.customer_id = c.id
      WHERE j.user_id = ?
      ORDER BY j.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const result = await executeQuery(this.db, query, [userId, limit, offset]);
    
    return result.results.map((row: any) => this.mapRowToJob(row));
  }

  async getJobsByCustomerId(userId: string, customerId: string): Promise<Job[]> {
    const query = `
      SELECT j.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone
      FROM jobs j
      LEFT JOIN customers c ON j.customer_id = c.id
      WHERE j.user_id = ? AND j.customer_id = ?
      ORDER BY j.created_at DESC
    `;

    const result = await executeQuery(this.db, query, [userId, customerId]);
    
    return result.results.map((row: any) => this.mapRowToJob(row));
  }

  async getJobsByStatus(userId: string, status: JobStatus): Promise<Job[]> {
    const query = `
      SELECT j.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone
      FROM jobs j
      LEFT JOIN customers c ON j.customer_id = c.id
      WHERE j.user_id = ? AND j.status = ?
      ORDER BY j.created_at DESC
    `;

    const result = await executeQuery(this.db, query, [userId, status]);
    
    return result.results.map((row: any) => this.mapRowToJob(row));
  }

  async getTodaysJobs(userId: string): Promise<Job[]> {
    const today = new Date().toISOString().split('T')[0];
    
    const query = `
      SELECT j.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone
      FROM jobs j
      LEFT JOIN customers c ON j.customer_id = c.id
      WHERE j.user_id = ? AND DATE(j.due_date) = ?
      ORDER BY j.due_date ASC
    `;

    const result = await executeQuery(this.db, query, [userId, today]);
    
    return result.results.map((row: any) => this.mapRowToJob(row));
  }

  async getUnpaidJobs(userId: string): Promise<Job[]> {
    const query = `
      SELECT j.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone
      FROM jobs j
      LEFT JOIN customers c ON j.customer_id = c.id
      WHERE j.user_id = ? AND j.status = 'completed' AND j.paid = false
      ORDER BY j.completed_at ASC
    `;

    const result = await executeQuery(this.db, query, [userId]);
    
    return result.results.map((row: any) => this.mapRowToJob(row));
  }

  async updateJob(userId: string, jobId: string, updates: UpdateJobRequest): Promise<Job> {
    const existingJob = await this.getJobById(userId, jobId);
    if (!existingJob) {
      throw new Error('Job not found');
    }

    const updateFields: string[] = [];
    const params: any[] = [];

    // Build dynamic update query
    if (updates.title !== undefined) {
      updateFields.push('title = ?');
      params.push(updates.title);
    }
    if (updates.description !== undefined) {
      updateFields.push('description = ?');
      params.push(updates.description);
    }
    if (updates.status !== undefined) {
      updateFields.push('status = ?');
      params.push(updates.status);
      
      // Set completion date if marking as completed
      if (updates.status === 'completed') {
        updateFields.push('completed_at = ?');
        params.push(new Date().toISOString());
      }
    }
    if (updates.estimated_cost !== undefined) {
      updateFields.push('estimated_cost = ?');
      params.push(updates.estimated_cost);
    }
    if (updates.actual_cost !== undefined) {
      updateFields.push('actual_cost = ?');
      params.push(updates.actual_cost);
    }
    if (updates.estimated_hours !== undefined) {
      updateFields.push('estimated_hours = ?');
      params.push(updates.estimated_hours);
    }
    if (updates.actual_hours !== undefined) {
      updateFields.push('actual_hours = ?');
      params.push(updates.actual_hours);
    }
    if (updates.due_date !== undefined) {
      updateFields.push('due_date = ?');
      params.push(updates.due_date);
    }
    if (updates.paid !== undefined) {
      updateFields.push('paid = ?');
      params.push(updates.paid);
    }

    if (updateFields.length === 0) {
      return existingJob; // No updates to apply
    }

    // Always update the updated_at timestamp
    updateFields.push('updated_at = ?');
    params.push(new Date().toISOString());

    // Add WHERE clause parameters
    params.push(jobId, userId);

    const query = `
      UPDATE jobs 
      SET ${updateFields.join(', ')}
      WHERE id = ? AND user_id = ?
    `;

    await executeQuery(this.db, query, params);

    // Return the updated job
    const updatedJob = await this.getJobById(userId, jobId);
    if (!updatedJob) {
      throw new Error('Failed to update job');
    }

    return updatedJob;
  }

  async deleteJob(userId: string, jobId: string): Promise<boolean> {
    const query = 'DELETE FROM jobs WHERE id = ? AND user_id = ?';
    const result = await executeQuery(this.db, query, [jobId, userId]);
    
    return result.changes > 0;
  }

  async getJobStats(userId: string): Promise<{
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
    total_revenue: number;
    unpaid_amount: number;
  }> {
    const query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN paid = true AND actual_cost IS NOT NULL THEN actual_cost ELSE 0 END) as total_revenue,
        SUM(CASE WHEN paid = false AND status = 'completed' AND actual_cost IS NOT NULL THEN actual_cost ELSE 0 END) as unpaid_amount
      FROM jobs 
      WHERE user_id = ?
    `;

    const result = await getFirstRow(this.db, query, [userId]);
    
    return {
      total: Number(result?.total || 0),
      pending: Number(result?.pending || 0),
      in_progress: Number(result?.in_progress || 0),
      completed: Number(result?.completed || 0),
      total_revenue: Number(result?.total_revenue || 0),
      unpaid_amount: Number(result?.unpaid_amount || 0)
    };
  }

  private mapRowToJob(row: any): Job {
    return {
      id: row.id,
      user_id: row.user_id,
      customer_id: row.customer_id,
      title: row.title,
      description: row.description,
      status: row.status as JobStatus,
      estimated_cost: row.estimated_cost ? Number(row.estimated_cost) : undefined,
      actual_cost: row.actual_cost ? Number(row.actual_cost) : undefined,
      estimated_hours: row.estimated_hours ? Number(row.estimated_hours) : undefined,
      actual_hours: row.actual_hours ? Number(row.actual_hours) : undefined,
      due_date: row.due_date,
      paid: Boolean(row.paid),
      completed_at: row.completed_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
      customer: row.customer_name ? {
        id: row.customer_id,
        name: row.customer_name,
        email: row.customer_email,
        phone: row.customer_phone
      } : undefined
    };
  }
}
