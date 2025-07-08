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
