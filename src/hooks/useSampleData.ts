import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getDemoCredentials, createDemoUser } from '@/hooks/useDemoData';
import { env } from '@/utils/env';

export const useSampleData = () => {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Debug: Check environment variables
    console.log('Environment check:', {
      VITE_DEMO_MODE: env.isDemoMode(),
      VITE_DEMO_EMAIL: env.demoEmail(),
      VITE_DEMO_PASSWORD: env.demoPassword()
    });
    
    // Only create demo account if demo mode is explicitly enabled
    if (env.isDemoMode()) {
      // Create demo account for testing purposes
      const createDemoAccount = () => {
        try {
          const credentials = getDemoCredentials();
          console.log('Demo credentials from env:', credentials);
          
          // Clear existing users to prevent conflicts
          localStorage.removeItem('myjobtrack_users');
          
          // Debug: Check what was cleared
          console.log('Cleared existing users from localStorage');
          
          const demoUser = {
            ...createDemoUser(),
            password: credentials.password
          };
          
          console.log('Creating fresh demo user:', { 
            email: demoUser.email, 
            password: demoUser.password,
            id: demoUser.id 
          });
          
          // Store the demo user
          localStorage.setItem('myjobtrack_users', JSON.stringify([demoUser]));
          
          // Debug: Verify what was stored
          const storedUsers = JSON.parse(localStorage.getItem('myjobtrack_users') || '[]');
          console.log('Stored users in localStorage:', storedUsers.map((u: any) => ({ email: u.email, id: u.id })));
          
          console.log('Demo account created for demo mode');
        } catch (error) {
          console.error('Failed to create demo account:', error);
        }
      };

      createDemoAccount();
    } else {
      console.log('Demo mode disabled - no demo account created');
    }

    // Note: Sample data creation is disabled to prevent data isolation issues
    // The app now uses the API directly with proper user isolation
    console.log('Sample data disabled - using API with user isolation');
  }, [isAuthenticated, user]);
};