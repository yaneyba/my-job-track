import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getDemoCredentials } from '@/hooks/useDemoData';

export const useSampleData = () => {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // In API mode, demo data comes from the database
    // This hook is maintained for backward compatibility but does not create localStorage data
    const credentials = getDemoCredentials();
    
    if (credentials.email && credentials.password) {
      console.log('Demo credentials available from environment variables');
      console.log('Demo user should be accessed from database, not localStorage');
    }

    // Note: Sample data creation is disabled to prevent data isolation issues
    // The app now uses the API directly with proper user isolation
    console.log('Sample data disabled - using API with user isolation');
  }, [isAuthenticated, user]);
};