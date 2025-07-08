import React, { createContext, useContext, useState, ReactNode } from 'react';
import { env } from '@/utils/env';

interface DemoContextType {
  isDemoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  showWaitlistModal: boolean;
  setShowWaitlistModal: (show: boolean) => void;
  triggerWaitlistCTA: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};

interface DemoProviderProps {
  children: ReactNode;
}

export const DemoProvider: React.FC<DemoProviderProps> = ({ children }) => {
  // Read Demo mode from environment variable
  const [isDemoMode, setIsDemoMode] = useState(env.isDemoMode());
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);

  const setDemoMode = (enabled: boolean) => {
    setIsDemoMode(enabled);
  };

  const triggerWaitlistCTA = () => {
    if (isDemoMode) {
      // Check if user is already waitlisted - if so, don't show modal
      const currentUser = localStorage.getItem('myjobtrack_user');
      if (currentUser) {
        try {
          const user = JSON.parse(currentUser);
          if (user.isWaitlisted === true) {
            // User is already in waitlist mode, don't show modal
            return;
          }
        } catch (error) {
          console.error('Error checking user waitlist status:', error);
        }
      }
      
      // Also check if the email was previously added to waitlist
      const waitlistEmails = localStorage.getItem('jobtrack_waitlist_emails');
      if (waitlistEmails) {
        try {
          const emails = JSON.parse(waitlistEmails);
          if (emails.length > 0) {
            // User has already signed up for waitlist, don't show modal
            return;
          }
        } catch (error) {
          console.error('Error checking waitlist emails:', error);
        }
      }
      
      setShowWaitlistModal(true);
    }
  };

  return (
    <DemoContext.Provider value={{ 
      isDemoMode, 
      setDemoMode,
      showWaitlistModal,
      setShowWaitlistModal,
      triggerWaitlistCTA
    }}>
      {children}
    </DemoContext.Provider>
  );
};

export default DemoProvider;
