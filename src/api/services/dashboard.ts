// Dashboard service for aggregating stats and data
import { Job, DashboardStats } from '../types';
import { executeQuery, getFirstRow } from '../utils/db';

export class DashboardService {
  constructor(private db: any) {} // D1Database type available at runtime

  async getDashboardStats(userId: string): Promise<DashboardStats> {
    // Get basic stats
    const statsQuery = `
      SELECT 
        COUNT(DISTINCT c.id) as total_customers,
        COUNT(j.id) as total_jobs,
        SUM(CASE WHEN j.status = 'completed' THEN 1 ELSE 0 END) as completed_jobs,
        SUM(CASE WHEN j.status IN ('pending', 'in_progress') THEN 1 ELSE 0 END) as pending_jobs,
        SUM(CASE WHEN j.paid = true AND j.actual_cost IS NOT NULL THEN j.actual_cost ELSE 0 END) as total_revenue,
        SUM(CASE WHEN j.status = 'completed' AND j.paid = false AND j.actual_cost IS NOT NULL THEN j.actual_cost ELSE 0 END) as total_unpaid,
        SUM(CASE WHEN j.status = 'completed' AND j.paid = false THEN 1 ELSE 0 END) as unpaid_jobs_count
      FROM customers c
      LEFT JOIN jobs j ON c.id = j.customer_id AND c.user_id = j.user_id
      WHERE c.user_id = ?
    `;

    const basicStats = await getFirstRow(this.db, statsQuery, [userId]);

    // Get this week's earnings
    const weekStart = this.getWeekStart();
    const weekEarningsQuery = `
      SELECT SUM(CASE WHEN j.paid = true AND j.actual_cost IS NOT NULL THEN j.actual_cost ELSE 0 END) as week_earnings
      FROM jobs j
      WHERE j.user_id = ? AND j.completed_at >= ?
    `;

    const weekEarnings = await getFirstRow(this.db, weekEarningsQuery, [userId, weekStart]);

    // Get this month's earnings
    const monthStart = this.getMonthStart();
    const monthEarningsQuery = `
      SELECT SUM(CASE WHEN j.paid = true AND j.actual_cost IS NOT NULL THEN j.actual_cost ELSE 0 END) as month_earnings
      FROM jobs j
      WHERE j.user_id = ? AND j.completed_at >= ?
    `;

    const monthEarnings = await getFirstRow(this.db, monthEarningsQuery, [userId, monthStart]);

    // Get today's jobs
    const todaysJobs = await this.getTodaysJobs(userId);

    // Get recent jobs (last 10)
    const recentJobs = await this.getRecentJobs(userId, 10);

    // Get upcoming jobs (next 7 days)
    const upcomingJobs = await this.getUpcomingJobs(userId, 7);

    return {
      totalCustomers: Number(basicStats?.total_customers || 0),
      totalJobs: Number(basicStats?.total_jobs || 0),
      completedJobs: Number(basicStats?.completed_jobs || 0),
      pendingJobs: Number(basicStats?.pending_jobs || 0),
      totalRevenue: Number(basicStats?.total_revenue || 0),
      thisWeekEarnings: Number(weekEarnings?.week_earnings || 0),
      thisMonthEarnings: Number(monthEarnings?.month_earnings || 0),
      unpaidJobsCount: Number(basicStats?.unpaid_jobs_count || 0),
      totalUnpaid: Number(basicStats?.total_unpaid || 0),
      todaysJobs,
      recentJobs,
      upcomingJobs
    };
  }

  async getTodaysJobs(userId: string): Promise<Job[]> {
    const today = new Date().toISOString().split('T')[0];
    
    const query = `
      SELECT j.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone
      FROM jobs j
      LEFT JOIN customers c ON j.customer_id = c.id
      WHERE j.user_id = ? AND DATE(j.due_date) = ?
      ORDER BY j.due_date ASC
      LIMIT 10
    `;

    const result = await executeQuery(this.db, query, [userId, today]);
    
    return result.results.map((row: any) => this.mapRowToJob(row));
  }

  async getRecentJobs(userId: string, limit = 10): Promise<Job[]> {
    const query = `
      SELECT j.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone
      FROM jobs j
      LEFT JOIN customers c ON j.customer_id = c.id
      WHERE j.user_id = ?
      ORDER BY j.updated_at DESC
      LIMIT ?
    `;

    const result = await executeQuery(this.db, query, [userId, limit]);
    
    return result.results.map((row: any) => this.mapRowToJob(row));
  }

  async getUpcomingJobs(userId: string, days = 7): Promise<Job[]> {
    const today = new Date().toISOString().split('T')[0];
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    const futureDateStr = futureDate.toISOString().split('T')[0];
    
    const query = `
      SELECT j.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone
      FROM jobs j
      LEFT JOIN customers c ON j.customer_id = c.id
      WHERE j.user_id = ? 
        AND j.status IN ('pending', 'in_progress')
        AND j.due_date >= ? 
        AND j.due_date <= ?
      ORDER BY j.due_date ASC
      LIMIT 20
    `;

    const result = await executeQuery(this.db, query, [userId, today, futureDateStr]);
    
    return result.results.map((row: any) => this.mapRowToJob(row));
  }

  async getJobsByDateRange(userId: string, startDate: string, endDate: string): Promise<Job[]> {
    const query = `
      SELECT j.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone
      FROM jobs j
      LEFT JOIN customers c ON j.customer_id = c.id
      WHERE j.user_id = ? 
        AND j.due_date >= ? 
        AND j.due_date <= ?
      ORDER BY j.due_date ASC
    `;

    const result = await executeQuery(this.db, query, [userId, startDate, endDate]);
    
    return result.results.map((row: any) => this.mapRowToJob(row));
  }

  async getRevenueByMonth(userId: string, year: number): Promise<{ month: number; revenue: number }[]> {
    const query = `
      SELECT 
        strftime('%m', j.completed_at) as month,
        SUM(CASE WHEN j.paid = true AND j.actual_cost IS NOT NULL THEN j.actual_cost ELSE 0 END) as revenue
      FROM jobs j
      WHERE j.user_id = ? 
        AND strftime('%Y', j.completed_at) = ?
        AND j.status = 'completed'
      GROUP BY strftime('%m', j.completed_at)
      ORDER BY month
    `;

    const result = await executeQuery(this.db, query, [userId, year.toString()]);
    
    return result.results.map((row: any) => ({
      month: Number(row.month),
      revenue: Number(row.revenue || 0)
    }));
  }

  private getWeekStart(): string {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday as start of week
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - daysToSubtract);
    weekStart.setHours(0, 0, 0, 0);
    return weekStart.toISOString();
  }

  private getMonthStart(): string {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    return monthStart.toISOString();
  }

  private mapRowToJob(row: any): Job {
    return {
      id: row.id,
      user_id: row.user_id,
      customer_id: row.customer_id,
      title: row.title,
      description: row.description,
      status: row.status,
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
