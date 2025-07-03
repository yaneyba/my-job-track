import React from 'react';
import Breadcrumbs from '@/components/UI/Breadcrumbs';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';

interface DashboardHeaderProps {
  breadcrumbItems: { label: string; current: boolean }[];
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ breadcrumbItems }) => {
  const { t } = useLanguage();

  return (
    <>
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
          {t('dashboard.welcome')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>
    </>
  );
};

export default DashboardHeader;
