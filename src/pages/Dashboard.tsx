import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardStats } from '@/types';
import { DataProviderFactory } from '@/data/providers/DataProviderFactory';
import QuickActionButton from '@/components/UI/QuickActionButton';
import JobCard from '@/components/Job/JobCard';
import Breadcrumbs from '@/components/UI/Breadcrumbs';
import { Plus, Users, Calendar, DollarSign, QrCode } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dataProvider = DataProviderFactory.getInstance();

  const breadcrumbItems = [
    { label: 'Home', current: true }
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    setLoading(true);
    try {
      const dashboardStats = dataProvider.getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobStatusChange = (jobId: string, status: 'scheduled' | 'in-progress' | 'completed') => {
    const updates: any = { status };
    if (status === 'completed') {
      updates.completedDate = new Date().toISOString();
    }
    dataProvider.updateJob(jobId, updates);
    loadDashboardData();
  };

  const handleJobPaymentStatusChange = (jobId: string, paymentStatus: 'paid' | 'unpaid') => {
    dataProvider.updateJob(jobId, { paymentStatus });
    loadDashboardData();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
          Welcome Back!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-dark-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-700 transition-colors duration-200">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3 transition-colors duration-200" />
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
                {stats?.todaysJobs.length || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Today's Jobs</p>
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
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">This Week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Unpaid Jobs Alert */}
      {stats && stats.unpaidJobsCount > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200 transition-colors duration-200">
                ${stats.totalUnpaid.toFixed(2)} Unpaid
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
      )}

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-200">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <QuickActionButton
            icon={Plus}
            label="Add Customer"
            onClick={() => navigate('/app/customers/new')}
            variant="primary"
          />
          <QuickActionButton
            icon={Calendar}
            label="Schedule Job"
            onClick={() => navigate('/app/jobs/new')}
            variant="secondary"
          />
          <QuickActionButton
            icon={Users}
            label="View Customers"
            onClick={() => navigate('/app/customers')}
            variant="secondary"
          />
          <QuickActionButton
            icon={QrCode}
            label="Scan QR Code"
            onClick={() => navigate('/app/scan')}
            variant="secondary"
          />
        </div>
      </div>

      {/* Today's Jobs */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-200">Today's Jobs</h2>
        {stats && stats.todaysJobs.length > 0 ? (
          <div className="space-y-3">
            {stats.todaysJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onClick={() => navigate(`/app/jobs/${job.id}`)}
                onStatusChange={handleJobStatusChange}
                onPaymentStatusChange={handleJobPaymentStatusChange}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-800 rounded-lg p-8 text-center shadow-sm border border-gray-200 dark:border-dark-700 transition-colors duration-200">
            <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3 transition-colors duration-200" />
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">No jobs scheduled for today</p>
            <button
              onClick={() => navigate('/app/jobs/new')}
              className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
            >
              Schedule a Job
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;