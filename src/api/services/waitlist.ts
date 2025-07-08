import { D1Database } from '@cloudflare/workers-types';
import { v4 as uuidv4 } from 'uuid';

export interface WaitlistEntry {
  id: string;
  email: string;
  businessType?: string;
  source?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface WaitlistSubmission {
  email: string;
  businessType?: string;
  source?: string;
}

/**
 * Service for handling waitlist operations
 */
export class WaitlistService {
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  /**
   * Add a new entry to the waitlist
   * @param submission Waitlist submission data
   * @param request Request object for extracting IP and user agent
   * @returns The created waitlist entry
   */
  async addToWaitlist(
    submission: WaitlistSubmission,
    request: Request
  ): Promise<WaitlistEntry> {
    const { email, businessType, source } = submission;
    
    // Extract IP address from request
    const ipAddress = request.headers.get('CF-Connecting-IP') || 
                       request.headers.get('X-Forwarded-For') ||
                       'unknown';
                       
    // Extract user agent from request
    const userAgent = request.headers.get('User-Agent') || 'unknown';
    
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    
    const entry: WaitlistEntry = {
      id,
      email,
      businessType,
      source,
      ipAddress,
      userAgent,
      createdAt
    };

    try {
      await this.db.prepare(
        `INSERT INTO waitlist (id, email, businessType, source, ipAddress, userAgent, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(id, email, businessType || null, source || null, ipAddress, userAgent, createdAt)
      .run();
      
      return entry;
    } catch (error) {
      // Check if error is due to duplicate email
      if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
        throw new Error('Email already exists in waitlist');
      }
      
      console.error('Error adding to waitlist:', error);
      throw new Error('Failed to add to waitlist');
    }
  }

  /**
   * Check if an email is already on the waitlist
   * @param email Email to check
   * @returns Boolean indicating if email exists
   */
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const result = await this.db
        .prepare('SELECT email FROM waitlist WHERE email = ?')
        .bind(email)
        .first();
      
      return result !== null;
    } catch (error) {
      console.error('Error checking if email exists:', error);
      return false;
    }
  }
}
