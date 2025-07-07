import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MVPContextType {
  isMVPMode: boolean;
  setMVPMode: (enabled: boolean) => void;
}

const MVPContext = createContext<MVPContextType | undefined>(undefined);

export const useMVP = () => {
  const context = useContext(MVPContext);
  if (context === undefined) {
    throw new Error('useMVP must be used within a MVPProvider');
  }
  return context;
};

interface MVPProviderProps {
  children: ReactNode;
}

export const MVPProvider: React.FC<MVPProviderProps> = ({ children }) => {
  // Read MVP mode from environment variable
  const envMVPMode = import.meta.env.VITE_MVP_MODE === 'true';
  const [isMVPMode, setIsMVPMode] = useState(envMVPMode);

  const setMVPMode = (enabled: boolean) => {
    setIsMVPMode(enabled);
  };

  return (
    <MVPContext.Provider value={{ isMVPMode, setMVPMode }}>
      {children}
    </MVPContext.Provider>
  );
};

export default MVPProvider;
