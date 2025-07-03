import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardStats, Job } from '@/types';
import { DataProviderFactory } from '@/data/providers/DataProviderFactory';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotifications } from '@/hooks/useNotifications';
import {
  DashboardHeader,
  NotificationsSection,
  StatsOverview,
  UnpaidJobsAlert,
  QuickActionsPanel,
  TodaysJobsSection
} from '@/components/Dashboard';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(true);
  const navigate = useNavigate();
  const dataProvider = DataProviderFactory.getInstance();
  const { notifications, dismissNotification, clearAllNotifications } = useNotifications();
  const { t } = useLanguage();

  const breadcrumbItems = [
    { label: t('nav.home'), current: true }
  ];

  const loadDashboardData = useCallback(() => {
    setLoading(true);
    try {
      const dashboardStats = dataProvider.getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [dataProvider]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleJobStatusChange = (jobId: string, status: 'scheduled' | 'in-progress' | 'completed') => {
    const updates: Partial<Job> = { status };
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
      <DashboardHeader breadcrumbItems={breadcrumbItems} />
      
      <NotificationsSection 
        notifications={notifications}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        dismissNotification={dismissNotification}
        clearAllNotifications={clearAllNotifications}
      />
      
      {stats && <StatsOverview stats={stats} />}
      
      {stats && <UnpaidJobsAlert stats={stats} />}
      
      <QuickActionsPanel />
      
      {stats && (
        <TodaysJobsSection 
          stats={stats}
          onJobStatusChange={handleJobStatusChange}
          onJobPaymentStatusChange={handleJobPaymentStatusChange}
        />
      )}
    </div>
  );
};

export default Dashboard;