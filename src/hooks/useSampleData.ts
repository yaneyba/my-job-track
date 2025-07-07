import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getDemoCredentials, createDemoUser } from '@/hooks/useDemoData';

export const useSampleData = () => {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Create demo account first, regardless of authentication status
    const createDemoAccount = () => {
      const storedUsers = localStorage.getItem('myjobtrack_users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      const credentials = getDemoCredentials();
      const demoUserExists = users.find((u: { email: string }) => u.email === credentials.email);
      
      if (!demoUserExists) {
        const demoUser = {
          ...createDemoUser(),
          password: credentials.password
        };
        users.push(demoUser);
        localStorage.setItem('myjobtrack_users', JSON.stringify(users));
        console.log('Demo account created successfully');
      }
    };

    // Always ensure demo account exists
    createDemoAccount();

    // Note: Sample data creation is disabled to prevent data isolation issues
    // The app now uses the API directly with proper user isolation
    console.log('Sample data disabled - using API with user isolation');
  }, [isAuthenticated, user]);
};