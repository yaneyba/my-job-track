import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Job } from '@/types';
import { DataProviderFactory } from '@/data/providers/DataProviderFactory';
import JobCard from '@/components/Job/JobCard';
import QuickActionButton from '@/components/UI/QuickActionButton';
import QRCodeDisplay from '@/components/QR/QRCodeDisplay';
import Breadcrumbs from '@/components/UI/Breadcrumbs';
import Pagination from '@/components/UI/Pagination';
import { usePagination } from '@/hooks/usePagination';
import { Plus, Calendar, CheckCircle, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQRJob, setSelectedQRJob] = useState<Job | null>(null);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'in-progress' | 'completed'>('all');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const dataProvider = DataProviderFactory.getInstance();

  const breadcrumbItems = [
    { label: 'Home', href: '/app' },
    { label: 'Jobs', current: true }
  ];

  // Filter jobs based on selected filter
  const filteredJobs = filter === 'all' ? jobs : jobs.filter(job => job.status === filter);

  // Pagination hook
  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    paginatedData,
    goToPage
  } = usePagination({
    data: filteredJobs,
    itemsPerPage: 10 // Show 10 jobs per page
  });

  const loadJobs = useCallback(() => {
    setLoading(true);
    try {
      const jobData = dataProvider.getJobs();
      // Sort jobs by scheduled date (most recent first)
      const sortedJobs = jobData.sort((a, b) => 
        parseISO(b.scheduledDate).getTime() - parseISO(a.scheduledDate).getTime()
      );
      setJobs(sortedJobs);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  }, [dataProvider]);

  useEffect(() => {
    loadJobs();
    
    // Check for success message from navigation state
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message after showing it
      window.history.replaceState({}, document.title);
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    }
  }, [location.state, loadJobs]);

  const handleJobStatusChange = (jobId: string, status: 'scheduled' | 'in-progress' | 'completed') => {
    const updates: Partial<Job> = { status };
    if (status === 'completed') {
      updates.completedDate = new Date().toISOString();
    }
    dataProvider.updateJob(jobId, updates);
    loadJobs();
  };

  const handleJobPaymentStatusChange = (jobId: string, paymentStatus: 'paid' | 'unpaid') => {
    dataProvider.updateJob(jobId, { paymentStatus });
    loadJobs();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 transition-colors duration-200"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center justify-between transition-colors duration-200">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 transition-colors duration-200" />
            <p className="text-green-800 dark:text-green-200 font-medium transition-colors duration-200">{successMessage}</p>
          </div>
          <button
            onClick={() => setSuccessMessage('')}
            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Jobs</h1>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
            {jobs.length} job{jobs.length !== 1 ? 's' : ''} total
            {filter !== 'all' && (
              <span className="text-blue-600 dark:text-blue-400 ml-1 transition-colors duration-200">
                • {filteredJobs.length} {filter.replace('-', ' ')}
              </span>
            )}
          </p>
        </div>
        <QuickActionButton
          icon={Plus}
          label="Schedule Job"
          onClick={() => navigate('/app/jobs/new')}
          size="sm"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-dark-700 p-1 rounded-lg transition-colors duration-200">
        {[
          { key: 'all', label: 'All Jobs' },
          { key: 'scheduled', label: 'Scheduled' },
          { key: 'in-progress', label: 'In Progress' },
          { key: 'completed', label: 'Completed' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as typeof filter)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200 ${
              filter === key
                ? 'bg-white dark:bg-dark-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Job List */}
      {filteredJobs.length > 0 ? (
        <>
          <div className="space-y-4 mb-8">
            {paginatedData.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onClick={() => navigate(`/app/jobs/${job.id}`)}
                onQRCodeClick={() => setSelectedQRJob(job)}
                onStatusChange={handleJobStatusChange}
                onPaymentStatusChange={handleJobPaymentStatusChange}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={goToPage}
            className="mt-8"
          />
        </>
      ) : (
        <div className="bg-white dark:bg-dark-800 rounded-lg p-8 text-center shadow-sm border border-gray-200 dark:border-dark-700 transition-colors duration-200">
          <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3 transition-colors duration-200" />
          <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-200">
            {filter === 'all' ? 'No jobs scheduled yet' : `No ${filter} jobs`}
          </p>
          {filter === 'all' && (
            <QuickActionButton
              icon={Plus}
              label="Schedule Your First Job"
              onClick={() => navigate('/app/jobs/new')}
              variant="primary"
            />
          )}
        </div>
      )}

      {/* QR Code Modal */}
      {selectedQRJob && (
        <QRCodeDisplay
          type="job"
          id={selectedQRJob.id}
          title={selectedQRJob.serviceType}
          subtitle={`${selectedQRJob.customerName} • ${format(parseISO(selectedQRJob.scheduledDate), 'MMM d, yyyy')}`}
          onClose={() => setSelectedQRJob(null)}
        />
      )}
    </div>
  );
};

export default Jobs;