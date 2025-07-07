import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useDemo } from './DemoContext';
import { DataProviderFactory } from '@/data/providers/DataProviderFactory';

interface User {
  id: string;
  email: string;
  name: string;
  businessName?: string;
  createdAt: string;
}

interface StoredUser extends User {
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string, businessName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isDemoMode } = useDemo();
  const useAPIProvider = import.meta.env.VITE_USE_API_PROVIDER === 'true';

  // Initialize demo account and check for existing session on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // SECURITY FIX: Removed auto-login for demo user to prevent security bypass
        // Demo users must now properly authenticate through login flow
        
        // Fallback to localStorage-based auth (original behavior)
        // First, ensure demo account exists
        const storedUsers = localStorage.getItem('myjobtrack_users');
        const users: StoredUser[] = storedUsers ? JSON.parse(storedUsers) : [];
        
        const demoEmail = import.meta.env.VITE_DEMO_EMAIL;
        const demoPassword = import.meta.env.VITE_DEMO_PASSWORD;
        
        const demoUserExists = users.find((u: StoredUser) => u.email === demoEmail);
        if (!demoUserExists) {
          const demoUser = {
            id: 'demo-user-id',
            email: demoEmail,
            password: demoPassword,
            name: 'Demo User',
            businessName: 'Demo Service Company',
            createdAt: new Date().toISOString()
          };
          users.push(demoUser);
          localStorage.setItem('myjobtrack_users', JSON.stringify(users));
          console.log('Demo account initialized');
        }

        // Then check for existing session
        const storedUser = localStorage.getItem('myjobtrack_user');
        const sessionToken = localStorage.getItem('myjobtrack_session');
        
        if (storedUser && sessionToken) {
          const userData = JSON.parse(storedUser);
          // Verify session is still valid (simple check - in production you'd verify with server)
          const sessionData = JSON.parse(sessionToken);
          const now = new Date().getTime();
          
          // Session expires after 30 days
          if (now - sessionData.timestamp < 30 * 24 * 60 * 60 * 1000) {
            // Enable demo mode if this is the demo user
            const demoEmail = import.meta.env.VITE_DEMO_EMAIL;
            if (userData.email === demoEmail) {
              console.log('🎭 Demo user session restored, enabling demo data provider');
              DataProviderFactory.enableDemoMode();
            } else {
              console.log('🔧 Regular user session restored, using API data provider');
              DataProviderFactory.disableDemoMode();
            }
            setUser(userData);
          } else {
            // Session expired, clear storage
            localStorage.removeItem('myjobtrack_user');
            localStorage.removeItem('myjobtrack_session');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear corrupted data
        localStorage.removeItem('myjobtrack_user');
        localStorage.removeItem('myjobtrack_session');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [isDemoMode, useAPIProvider]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if we should use API provider or demo mode
      const shouldUseAPI = useAPIProvider;
      
      if (!shouldUseAPI) {
        // Demo mode: try authenticating with DemoDataProvider
        const dataProvider = DataProviderFactory.getInstance();
        if (dataProvider.authenticateUser) {
          console.log('🎭 Attempting demo mode authentication');
          const result = await dataProvider.authenticateUser(email, password);
          
          if (result.success) {
            console.log('🎭 Demo authentication successful');
            DataProviderFactory.enableDemoMode();
            
            // Store session for demo user
            const sessionData = {
              timestamp: new Date().getTime(),
              userId: result.user.id
            };
            
            localStorage.setItem('myjobtrack_user', JSON.stringify(result.user));
            localStorage.setItem('myjobtrack_session', JSON.stringify(sessionData));
            
            setUser(result.user);
            return { success: true };
          } else {
            return { success: false, error: result.error || 'Demo authentication failed' };
          }
        }
      }
      
      // Fallback to localStorage-based auth (original behavior)
      // Get stored users
      const storedUsers = localStorage.getItem('myjobtrack_users');
      const users: StoredUser[] = storedUsers ? JSON.parse(storedUsers) : [];
      
      console.log('Available users:', users.map((u: StoredUser) => ({ email: u.email, id: u.id })));
      console.log('Attempting login with:', email);
      
      // Find user by email (case insensitive)
      const foundUser = users.find((u: StoredUser) => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        console.log('User not found for email:', email);
        return { success: false, error: 'No account found with this email address.' };
      }
      
      console.log('Found user:', { email: foundUser.email, id: foundUser.id });
      
      // Check password (in production, this would be hashed)
      if (foundUser.password !== password) {
        console.log('Password mismatch for user:', foundUser.email);
        return { success: false, error: 'Incorrect password. Please try again.' };
      }
      
      // Create user session
      const userData: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        businessName: foundUser.businessName,
        createdAt: foundUser.createdAt
      };
      
      // Enable demo mode if this is the demo user
      const demoEmail = import.meta.env.VITE_DEMO_EMAIL;
      if (userData.email === demoEmail) {
        console.log('🎭 Demo user detected, enabling demo data provider');
        DataProviderFactory.enableDemoMode();
      } else {
        console.log('🔧 Regular user, using API data provider');
        DataProviderFactory.disableDemoMode();
      }
      
      // Store session
      const sessionData = {
        timestamp: new Date().getTime(),
        userId: userData.id
      };
      
      localStorage.setItem('myjobtrack_user', JSON.stringify(userData));
      localStorage.setItem('myjobtrack_session', JSON.stringify(sessionData));
      
      setUser(userData);
      console.log('Login successful for user:', userData.email);
      return { success: true };
      
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An error occurred during login. Please try again.' };
    }
  };

  const signup = async (email: string, password: string, name: string, businessName?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get existing users
      const storedUsers = localStorage.getItem('myjobtrack_users');
      const users: StoredUser[] = storedUsers ? JSON.parse(storedUsers) : [];
      
      // Check if email already exists
      const existingUser = users.find((u: StoredUser) => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        return { success: false, error: 'An account with this email already exists.' };
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        email: email.toLowerCase(),
        password, // In production, this would be hashed
        name,
        businessName,
        createdAt: new Date().toISOString()
      };
      
      // Save to storage
      users.push(newUser);
      localStorage.setItem('myjobtrack_users', JSON.stringify(users));
      
      // Auto-login after signup
      const userData: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        businessName: newUser.businessName,
        createdAt: newUser.createdAt
      };
      
      const sessionData = {
        timestamp: new Date().getTime(),
        userId: userData.id
      };
      
      localStorage.setItem('myjobtrack_user', JSON.stringify(userData));
      localStorage.setItem('myjobtrack_session', JSON.stringify(sessionData));
      
      setUser(userData);
      return { success: true };
      
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'An error occurred during signup. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('myjobtrack_user');
    localStorage.removeItem('myjobtrack_session');
    setUser(null);
    
    // Reset data provider to API mode on logout
    console.log('🚪 User logged out, resetting to API data provider');
    DataProviderFactory.disableDemoMode();
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('myjobtrack_user', JSON.stringify(updatedUser));
    
    // Also update in users list
    try {
      const storedUsers = localStorage.getItem('myjobtrack_users');
      if (storedUsers) {
        const users: StoredUser[] = JSON.parse(storedUsers);
        const userIndex = users.findIndex((u: StoredUser) => u.id === user.id);
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...updates };
          localStorage.setItem('myjobtrack_users', JSON.stringify(users));
        }
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};