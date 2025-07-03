import React from 'react';
import { Calendar, DollarSign } from 'lucide-react';
import { DashboardStats } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface StatsOverviewProps {
  stats: DashboardStats;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-white dark:bg-dark-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-700 transition-colors duration-200">
        <div className="flex items-center">
          <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3 transition-colors duration-200" />
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
              {stats?.todaysJobs.length || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">{t('dashboard.todaysJobs')}</p>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-dark-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-700 transition-colors duration-200">
        <div className="flex items-center">
          <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400 mr-3 transition-colors duration-200" />
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
              ${stats?.thisWeekEarnings.toFixed(0) || '0'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">{t('dashboard.thisWeek')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
