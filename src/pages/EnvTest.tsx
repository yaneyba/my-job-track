import React from 'react';
import { useMVP } from '@/contexts/MVPContext';

const EnvTest: React.FC = () => {
  const { isMVPMode } = useMVP();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Test</h1>
      <div className="space-y-2">
        <p><strong>VITE_MVP_MODE (raw):</strong> {JSON.stringify(import.meta.env.VITE_MVP_MODE)}</p>
        <p><strong>VITE_MVP_MODE === 'true':</strong> {String(import.meta.env.VITE_MVP_MODE === 'true')}</p>
        <p><strong>isMVPMode from context:</strong> {String(isMVPMode)}</p>
        <p><strong>All env vars:</strong></p>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify(import.meta.env, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default EnvTest;
