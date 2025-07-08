import { WaitlistService, WaitlistSubmission } from '../services/waitlist';
import { notifySlackOnWaitlistSignup } from './slack';
import { handleCors, corsHeaders } from '../utils/cors';

export async function handleWaitlistRequest(request: Request, env: any): Promise<Response> {
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return handleCors(request);
  }
  
  // Only allow POST requests for this endpoint
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ 
      error: 'Method not allowed' 
    }), { 
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }

  try {
    // Parse the request body
    const data = await request.json() as WaitlistSubmission;
    
    // Validate required fields
    if (!data.email) {
      return new Response(JSON.stringify({ 
        error: 'Email is required' 
      }), { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid email format' 
      }), { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Initialize waitlist service
    const waitlistService = new WaitlistService(env.DB);
    
    // Check if email already exists
    const emailExists = await waitlistService.checkEmailExists(data.email);
    if (emailExists) {
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Thank you! This email is already on our waitlist.'
      }), { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    // Add to waitlist
    const result = await waitlistService.addToWaitlist(data, request);
    
    // Send Slack notification (don't fail the request if this fails)
    try {
      const webhookUrl = env.SLACK_WEBHOOK_URL || 'https://hooks.slack.com/services/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';
      await notifySlackOnWaitlistSignup({
        email: result.email,
        businessType: result.businessType,
        source: result.source
      }, webhookUrl);
    } catch (slackError) {
      console.error('Failed to send Slack notification:', slackError);
      // Don't fail the request if Slack notification fails
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Successfully added to waitlist',
      data: {
        id: result.id,
        email: result.email,
        createdAt: result.createdAt
      }
    }), { 
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
    
  } catch (error) {
    console.error('Waitlist request error:', error);
    
    // Handle known errors with specific messages
    if (error instanceof Error) {
      // Email already exists
      if (error.message === 'Email already exists in waitlist') {
        return new Response(JSON.stringify({ 
          success: true,
          message: 'Thank you! This email is already on our waitlist.'
        }), { 
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
      
      // Rate limiting and spam prevention errors
      if (error.message.includes('Rate limit exceeded') ||
          error.message.includes('Too many') ||
          error.message.includes('Disposable email') ||
          error.message.includes('Invalid browser') ||
          error.message.includes('Automated requests') ||
          error.message.includes('Multiple similar')) {
        return new Response(JSON.stringify({ 
          error: error.message,
          success: false
        }), { 
          status: 429, // Too Many Requests
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
    }
    
    // Generic error response
    return new Response(JSON.stringify({ 
      error: 'An error occurred processing your request' 
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
