import { D1Database } from '@cloudflare/workers-types';
import { v4 as uuidv4 } from 'uuid';
import { 
  validateEmailAdvanced, 
  isSuspiciousUserAgent, 
  RATE_LIMITS 
} from '../utils/spam-prevention';

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
    
    // Enhanced spam prevention checks
    await this.performSpamChecks(email, ipAddress, userAgent);
    
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

  /**
   * Comprehensive spam prevention checks
   * @param email Email address to validate
   * @param ipAddress IP address to check
   * @param userAgent User agent string
   * @throws Error if spam detection triggers
   */
  private async performSpamChecks(email: string, ipAddress: string, userAgent: string): Promise<void> {
    try {
      // 1. Check IP-based rate limiting (max 3 submissions per hour from same IP)
      await this.checkIpRateLimit(ipAddress);
      
      // 2. Check for disposable/temporary email domains
      this.validateEmailDomain(email);
      
      // 3. Check user agent for suspicious patterns
      this.validateUserAgent(userAgent);
      
      // 4. Check for suspicious submission patterns
      await this.checkSubmissionPatterns(email, ipAddress);
    } catch (error) {
      // Log blocked attempt for monitoring
      if (error instanceof Error) {
        await this.logBlockedAttempt(ipAddress, email, userAgent, error.message);
      }
      throw error;
    }
  }

  /**
   * Check IP-based rate limiting
   * @param ipAddress IP address to check
   * @throws Error if rate limit exceeded
   */
  private async checkIpRateLimit(ipAddress: string): Promise<void> {
    if (ipAddress === 'unknown') return; // Skip rate limiting for unknown IPs
    
    try {
      const oneHourAgo = new Date(Date.now() - RATE_LIMITS.ONE_HOUR).toISOString();
      const oneDayAgo = new Date(Date.now() - RATE_LIMITS.ONE_DAY).toISOString();
      
      // Check hourly limit
      const hourlyResult = await this.db
        .prepare(`
          SELECT COUNT(*) as count 
          FROM waitlist 
          WHERE ipAddress = ? AND createdAt > ?
        `)
        .bind(ipAddress, oneHourAgo)
        .first() as { count: number } | null;
      
      const hourlyCount = hourlyResult?.count || 0;
      
      if (hourlyCount >= RATE_LIMITS.SUBMISSIONS_PER_HOUR) {
        throw new Error('Rate limit exceeded. Too many submissions from this IP address. Please try again later.');
      }
      
      // Check daily limit
      const dailyResult = await this.db
        .prepare(`
          SELECT COUNT(*) as count 
          FROM waitlist 
          WHERE ipAddress = ? AND createdAt > ?
        `)
        .bind(ipAddress, oneDayAgo)
        .first() as { count: number } | null;
      
      const dailyCount = dailyResult?.count || 0;
      
      if (dailyCount >= RATE_LIMITS.SUBMISSIONS_PER_DAY) {
        throw new Error('Daily submission limit exceeded from this IP address. Please try again tomorrow.');
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('limit exceeded')) {
        throw error;
      }
      console.error('Error checking IP rate limit:', error);
      // Don't block on database errors
    }
  }

  /**
   * Validate email domain against known disposable email providers
   * @param email Email address to validate
   * @throws Error if disposable email detected
   */
  private validateEmailDomain(email: string): void {
    const validation = validateEmailAdvanced(email);
    
    if (!validation.isValid) {
      throw new Error('Invalid email format. Please enter a valid email address.');
    }
    
    if (validation.isDisposable) {
      throw new Error('Disposable email addresses are not allowed. Please use a permanent email address.');
    }
    
    if (validation.isSuspicious) {
      throw new Error('Email address appears suspicious. Please use a different email address.');
    }
  }

  /**
   * Validate user agent for suspicious patterns
   * @param userAgent User agent string
   * @throws Error if suspicious user agent detected
   */
  private validateUserAgent(userAgent: string): void {
    if (userAgent === 'unknown' || userAgent.length < 10) {
      throw new Error('Invalid browser detected. Please enable JavaScript and try again.');
    }
    
    if (isSuspiciousUserAgent(userAgent)) {
      throw new Error('Automated requests are not allowed. Please use a regular web browser.');
    }
  }

  /**
   * Check for suspicious submission patterns
   * @param email Email address
   * @param ipAddress IP address
   * @throws Error if suspicious patterns detected
   */
  private async checkSubmissionPatterns(email: string, ipAddress: string): Promise<void> {
    try {
      // Check for multiple emails from same IP (max 5 different emails per IP per day)
      const oneDayAgo = new Date(Date.now() - RATE_LIMITS.ONE_DAY).toISOString();
      const result = await this.db
        .prepare(`
          SELECT COUNT(DISTINCT email) as unique_emails 
          FROM waitlist 
          WHERE ipAddress = ? AND createdAt > ?
        `)
        .bind(ipAddress, oneDayAgo)
        .first() as { unique_emails: number } | null;
      
      const uniqueEmails = result?.unique_emails || 0;
      
      if (uniqueEmails >= RATE_LIMITS.UNIQUE_EMAILS_PER_IP_PER_DAY) {
        throw new Error('Too many different email addresses submitted from this location. Please try again tomorrow.');
      }
      
      // Check for similar email patterns (same local part with different domains)
      const localPart = email.split('@')[0];
      if (localPart.length >= 3) {
        const similarEmails = await this.db
          .prepare(`
            SELECT COUNT(*) as count 
            FROM waitlist 
            WHERE email LIKE ? AND createdAt > ?
          `)
          .bind(`${localPart}@%`, oneDayAgo)
          .first() as { count: number } | null;
        
        if ((similarEmails?.count || 0) >= RATE_LIMITS.SIMILAR_EMAILS_PER_DAY) {
          throw new Error('Multiple similar email addresses detected. Please use a different email address.');
        }
      }
    } catch (error) {
      if (error instanceof Error && (
        error.message.includes('Too many different') ||
        error.message.includes('Multiple similar')
      )) {
        throw error;
      }
      console.error('Error checking submission patterns:', error);
      // Don't block on database errors
    }
  }

  /**
   * Log blocked attempt for monitoring and analytics
   * @param ipAddress IP address of blocked attempt
   * @param email Email address of blocked attempt
   * @param userAgent User agent of blocked attempt
   * @param blockReason Reason for blocking
   */
  private async logBlockedAttempt(
    ipAddress: string, 
    email: string, 
    userAgent: string, 
    blockReason: string
  ): Promise<void> {
    try {
      const id = uuidv4();
      await this.db.prepare(`
        INSERT INTO waitlist_blocked_attempts 
        (id, ipAddress, email, userAgent, blockReason, attemptedAt)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        id, 
        ipAddress, 
        email, 
        userAgent, 
        blockReason, 
        new Date().toISOString()
      ).run();
    } catch (error) {
      console.error('Error logging blocked attempt:', error);
      // Don't throw - logging failures shouldn't block the main flow
    }
  }
}
