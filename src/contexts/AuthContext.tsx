import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  businessName?: string;
  createdAt: string;
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

  // Check for existing session on app load
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('myjobtrack_user');
        const sessionToken = localStorage.getItem('myjobtrack_session');
        
        if (storedUser && sessionToken) {
          const userData = JSON.parse(storedUser);
          // Verify session is still valid (simple check - in production you'd verify with server)
          const sessionData = JSON.parse(sessionToken);
          const now = new Date().getTime();
          
          // Session expires after 30 days
          if (now - sessionData.timestamp < 30 * 24 * 60 * 60 * 1000) {
            setUser(userData);
          } else {
            // Session expired, clear storage
            localStorage.removeItem('myjobtrack_user');
            localStorage.removeItem('myjobtrack_session');
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        // Clear corrupted data
        localStorage.removeItem('myjobtrack_user');
        localStorage.removeItem('myjobtrack_session');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get stored users
      const storedUsers = localStorage.getItem('myjobtrack_users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      // Find user by email
      const foundUser = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        return { success: false, error: 'No account found with this email address.' };
      }
      
      // Check password (in production, this would be hashed)
      if (foundUser.password !== password) {
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
      
      // Store session
      const sessionData = {
        timestamp: new Date().getTime(),
        userId: userData.id
      };
      
      localStorage.setItem('myjobtrack_user', JSON.stringify(userData));
      localStorage.setItem('myjobtrack_session', JSON.stringify(sessionData));
      
      setUser(userData);
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
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      // Check if email already exists
      const existingUser = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
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
        const users = JSON.parse(storedUsers);
        const userIndex = users.findIndex((u: any) => u.id === user.id);
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