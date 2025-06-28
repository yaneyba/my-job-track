import React from 'react';
import { Job } from '@/types';
import { Calendar, DollarSign, User, QrCode, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import StatusBadge from '@/components/UI/StatusBadge';

interface JobCardProps {
  job: Job;
  onClick?: () => void;
  onQRCodeClick?: () => void;
  onStatusChange?: (jobId: string, status: Job['status']) => void;
  onPaymentStatusChange?: (jobId: string, paymentStatus: Job['paymentStatus']) => void;
  showQRButton?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  onClick,
  onQRCodeClick,
  onStatusChange,
  onPaymentStatusChange,
  showQRButton = true,
}) => {
  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (job.status === 'scheduled') {
      onStatusChange?.(job.id, 'in-progress');
    } else if (job.status === 'in-progress') {
      onStatusChange?.(job.id, 'completed');
    }
  };

  const handlePaymentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPaymentStatusChange?.(job.id, job.paymentStatus === 'unpaid' ? 'paid' : 'unpaid');
  };

  return (
    <div
      className="bg-white dark:bg-dark-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-700 hover:shadow-md dark:hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 transition-colors duration-200">
            {job.serviceType}
          </h3>
          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1 transition-colors duration-200">
            <User size={16} className="mr-2" />
            <span className="text-sm">{job.customerName}</span>
          </div>
        </div>
        {showQRButton && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQRCodeClick?.();
            }}
            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
          >
            <QrCode size={20} />
          </button>
        )}
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center text-gray-600 dark:text-gray-400 transition-colors duration-200">
          <Calendar size={16} className="mr-2" />
          <span className="text-sm">
            {format(parseISO(job.scheduledDate), 'MMM d, yyyy')}
          </span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-400 transition-colors duration-200">
          <DollarSign size={16} className="mr-2" />
          <span className="text-sm font-medium">${job.price.toFixed(2)}</span>
        </div>
        {job.completedDate && (
          <div className="flex items-center text-gray-600 dark:text-gray-400 transition-colors duration-200">
            <Clock size={16} className="mr-2" />
            <span className="text-sm">
              Completed {format(parseISO(job.completedDate), 'MMM d, yyyy')}
            </span>
          </div>
        )}
      </div>

      {job.notes && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 p-2 bg-gray-50 dark:bg-dark-700 rounded transition-colors duration-200">
          {job.notes}
        </p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-dark-700 transition-colors duration-200">
        <div className="flex space-x-2">
          <button
            onClick={handleStatusClick}
            disabled={job.status === 'completed'}
          >
            <StatusBadge status={job.status} />
          </button>
          <button
            onClick={handlePaymentClick}
            disabled={job.status !== 'completed'}
          >
            <StatusBadge status={job.paymentStatus} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;