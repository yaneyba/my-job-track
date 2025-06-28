import React from 'react';

interface StatusBadgeProps {
  status: 'scheduled' | 'in-progress' | 'completed' | 'paid' | 'unpaid';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'scheduled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'unpaid':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'In Progress';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(
        status
      )} ${className}`}
    >
      {getStatusText(status)}
    </span>
  );
};

export default StatusBadge;