import React from 'react';
import Breadcrumbs from '@/components/UI/Breadcrumbs';
import { format } from 'date-fns';

interface DashboardHeaderProps {
  breadcrumbItems: { label: string; current: boolean }[];
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ breadcrumbItems }) => {

  return (
    <>
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Header */}
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>
    </>
  );
};

export default DashboardHeader;
