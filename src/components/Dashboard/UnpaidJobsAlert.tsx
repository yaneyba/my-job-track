import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardStats } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface UnpaidJobsAlertProps {
  stats: DashboardStats;
}

const UnpaidJobsAlert: React.FC<UnpaidJobsAlertProps> = ({ stats }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  if (!stats || stats.unpaidJobsCount === 0) {
    return null;
  }

  return (
    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200 transition-colors duration-200">
            ${stats.totalUnpaid.toFixed(2)} {t('dashboard.unpaid')}
          </h3>
          <p className="text-orange-700 dark:text-orange-300 transition-colors duration-200">
            {stats.unpaidJobsCount} job{stats.unpaidJobsCount !== 1 ? 's' : ''} need payment
          </p>
        </div>
        <button
          onClick={() => navigate('/app/payments')}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white rounded-lg transition-colors duration-200"
        >
          View All
        </button>
      </div>
    </div>
  );
};

export default UnpaidJobsAlert;
