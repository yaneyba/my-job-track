import React from 'react';
import { Customer } from '@/types';
import { Phone, MapPin, DollarSign, QrCode } from 'lucide-react';
import StatusBadge from '@/components/UI/StatusBadge';

interface CustomerCardProps {
  customer: Customer;
  onClick?: () => void;
  onQRCodeClick?: () => void;
  showQRButton?: boolean;
}

const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  onClick,
  onQRCodeClick,
  showQRButton = true,
}) => {
  return (
    <div
      className="bg-white dark:bg-dark-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-700 hover:shadow-md dark:hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 transition-colors duration-200">
            {customer.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 transition-colors duration-200">{customer.serviceType}</p>
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
          <Phone size={16} className="mr-2 flex-shrink-0" />
          <span className="text-sm">{customer.phone}</span>
        </div>
        <div className="flex items-start text-gray-600 dark:text-gray-400 transition-colors duration-200">
          <MapPin size={16} className="mr-2 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{customer.address}</span>
        </div>
      </div>

      {customer.totalUnpaid > 0 && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-dark-700 transition-colors duration-200">
          <div className="flex items-center text-orange-600 dark:text-orange-400 transition-colors duration-200">
            <DollarSign size={16} className="mr-1" />
            <span className="text-sm font-medium">
              ${customer.totalUnpaid.toFixed(2)} unpaid
            </span>
          </div>
          <StatusBadge status="unpaid" />
        </div>
      )}
    </div>
  );
};

export default CustomerCard;