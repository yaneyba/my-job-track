import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import JobCard from '@/components/Job/JobCard';
import { DashboardStats } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface TodaysJobsSectionProps {
  stats: DashboardStats;
  onJobStatusChange: (jobId: string, status: 'scheduled' | 'in-progress' | 'completed') => void;
  onJobPaymentStatusChange: (jobId: string, paymentStatus: 'paid' | 'unpaid') => void;
}

const TodaysJobsSection: React.FC<TodaysJobsSectionProps> = ({ 
  stats, 
  onJobStatusChange,
  onJobPaymentStatusChange 
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-200">
        {t('dashboard.todaysJobs')}
      </h2>
      {stats && stats.todaysJobs.length > 0 ? (
        <div className="space-y-3">
          {stats.todaysJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onClick={() => navigate(`/app/jobs/${job.id}`)}
              onStatusChange={onJobStatusChange}
              onPaymentStatusChange={onJobPaymentStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-800 rounded-lg p-8 text-center shadow-sm border border-gray-200 dark:border-dark-700 transition-colors duration-200">
          <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3 transition-colors duration-200" />
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">{t('dashboard.noJobsToday')}</p>
          <button
            onClick={() => navigate('/app/jobs/new')}
            className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
          >
            {t('dashboard.scheduleAJob')}
          </button>
        </div>
      )}
    </div>
  );
};

export default TodaysJobsSection;
