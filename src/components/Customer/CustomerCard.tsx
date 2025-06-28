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
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {customer.name}
          </h3>
          <p className="text-sm text-gray-600 mb-1">{customer.serviceType}</p>
        </div>
        {showQRButton && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQRCodeClick?.();
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <QrCode size={20} />
          </button>
        )}
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center text-gray-600">
          <Phone size={16} className="mr-2 flex-shrink-0" />
          <span className="text-sm">{customer.phone}</span>
        </div>
        <div className="flex items-start text-gray-600">
          <MapPin size={16} className="mr-2 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{customer.address}</span>
        </div>
      </div>

      {customer.totalUnpaid > 0 && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center text-orange-600">
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