import apiClient, { ApiResponse } from '../lib/api';

export interface WaitlistSubmission {
  email: string;
  businessType?: string;
  source?: string;
}

export interface WaitlistResponse extends ApiResponse {
  data?: {
    id: string;
    email: string;
    createdAt: string;
  };
}

/**
 * Waitlist service using the existing ApiClient pattern
 */
export const waitlistService = {
  /**
   * Add a user to the waitlist
   * @param data Waitlist submission data
   * @returns Promise with waitlist submission response
   */
  addToWaitlist: async (data: WaitlistSubmission): Promise<WaitlistResponse> => {
    try {
      return await apiClient.addToWaitlist(data);
    } catch (error: any) {
      console.error('Waitlist API error:', error);
      return {
        success: false,
        message: 'Failed to join waitlist. Please try again later.',
        error: error.message
      };
    }
  }
};
