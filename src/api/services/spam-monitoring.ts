/**
 * Admin endpoints for monitoring spam prevention
 * These should be protected with admin authentication in production
 */

import { D1Database } from '@cloudflare/workers-types';
import { corsHeaders } from '../utils/cors';

export interface SpamStats {
  totalBlockedAttempts: number;
  blockReasons: Array<{
    reason: string;
    count: number;
  }>;
  topBlockedIPs: Array<{
    ipAddress: string;
    count: number;
    lastAttempt: string;
  }>;
  recentAttempts: Array<{
    id: string;
    ipAddress: string;
    email: string;
    blockReason: string;
    attemptedAt: string;
  }>;
}

/**
 * Get comprehensive spam prevention statistics
 * @param db Database connection
 * @returns Spam prevention statistics
 */
export async function getSpamStats(db: D1Database): Promise<SpamStats> {
  try {
    // Get total blocked attempts
    const totalResult = await db
      .prepare('SELECT COUNT(*) as total FROM waitlist_blocked_attempts')
      .first() as { total: number } | null;
    
    const totalBlockedAttempts = totalResult?.total || 0;
    
    // Get block reasons breakdown
    const reasonsResult = await db
      .prepare(`
        SELECT blockReason as reason, COUNT(*) as count 
        FROM waitlist_blocked_attempts 
        GROUP BY blockReason 
        ORDER BY count DESC
      `)
      .all();
    
    const blockReasons = reasonsResult.results as Array<{ reason: string; count: number }>;
    
    // Get top blocked IPs
    const ipsResult = await db
      .prepare(`
        SELECT 
          ipAddress, 
          COUNT(*) as count,
          MAX(attemptedAt) as lastAttempt
        FROM waitlist_blocked_attempts 
        GROUP BY ipAddress 
        ORDER BY count DESC 
        LIMIT 10
      `)
      .all();
    
    const topBlockedIPs = ipsResult.results as Array<{
      ipAddress: string;
      count: number;
      lastAttempt: string;
    }>;
    
    // Get recent attempts (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const recentResult = await db
      .prepare(`
        SELECT id, ipAddress, email, blockReason, attemptedAt
        FROM waitlist_blocked_attempts 
        WHERE attemptedAt > ?
        ORDER BY attemptedAt DESC 
        LIMIT 50
      `)
      .bind(oneDayAgo)
      .all();
    
    const recentAttempts = recentResult.results as Array<{
      id: string;
      ipAddress: string;
      email: string;
      blockReason: string;
      attemptedAt: string;
    }>;
    
    return {
      totalBlockedAttempts,
      blockReasons,
      topBlockedIPs,
      recentAttempts
    };
  } catch (error) {
    console.error('Error getting spam stats:', error);
    return {
      totalBlockedAttempts: 0,
      blockReasons: [],
      topBlockedIPs: [],
      recentAttempts: []
    };
  }
}

/**
 * Handle admin spam monitoring requests
 * @param request HTTP request
 * @param db Database connection
 * @returns HTTP response with spam statistics
 */
export async function handleSpamMonitoringRequest(
  request: Request, 
  db: D1Database
): Promise<Response> {
  // In production, add proper admin authentication here
  // const isAdmin = await verifyAdminToken(request);
  // if (!isAdmin) {
  //   return new Response('Unauthorized', { status: 401 });
  // }
  
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders
    });
  }
  
  try {
    const stats = await getSpamStats(db);
    
    return new Response(JSON.stringify({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('Error handling spam monitoring request:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
