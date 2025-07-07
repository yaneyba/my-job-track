import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getDemoCredentials, createDemoUser } from '@/hooks/useDemoData';

export const useSampleData = () => {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Ensure demo user exists in localStorage for fallback authentication
    const ensureDemoUserExists = () => {
      const storedUsers = localStorage.getItem('myjobtrack_users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      const credentials = getDemoCredentials();
      const demoUserExists = users.find((u: { email: string }) => u.email === credentials.email);
      
      if (!demoUserExists && credentials.email && credentials.password) {
        const demoUser = createDemoUser();
        users.push(demoUser);
        localStorage.setItem('myjobtrack_users', JSON.stringify(users));
        console.log('Demo account created in localStorage for fallback authentication');
      }
    };

    // Always ensure demo account exists for fallback
    ensureDemoUserExists();

    // Note: In API mode, demo user comes from database
    // In demo mode, demo user comes from DemoDataProvider authentication
    // localStorage is only a fallback for compatibility
    const credentials = getDemoCredentials();
    if (credentials.email && credentials.password) {
      console.log('Demo credentials available from environment variables');
      console.log('Demo authentication will use DemoDataProvider in demo mode, database in API mode');
    }
  }, [isAuthenticated, user]);
};