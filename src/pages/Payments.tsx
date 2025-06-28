import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Job } from '@/types';
import { DataProviderFactory } from '@/data/providers/DataProviderFactory';
import JobCard from '@/components/Job/JobCard';
import Breadcrumbs from '@/components/UI/Breadcrumbs';
import Pagination from '@/components/UI/Pagination';
import { usePagination } from '@/hooks/usePagination';
import { DollarSign, AlertCircle } from 'lucide-react';

const Payments: React.FC = () => {
  const [unpaidJobs, setUnpaidJobs] = useState<Job[]>([]);
  const [paidJobs, setPaidJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'unpaid' | 'paid'>('unpaid');
  const navigate = useNavigate();
  const dataProvider = DataProviderFactory.getInstance();

  const breadcrumbItems = [
    { label: 'Home', href: '/app' },
    { label: 'Payments', current: true }
  ];

  // Get current data based on active tab
  const currentData = activeTab === 'unpaid' ? unpaidJobs : paidJobs;

  // Pagination hook
  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    paginatedData,
    goToPage
  } = usePagination({
    data: currentData,
    itemsPerPage: 10 // Show 10 jobs per page
  });

  const loadPaymentData = useCallback(() => {
    setLoading(true);
    try {
      const allJobs = dataProvider.getJobs();
      const unpaid = allJobs.filter(job => job.paymentStatus === 'unpaid' && job.status === 'completed');
      const paid = allJobs.filter(job => job.paymentStatus === 'paid');
      
      setUnpaidJobs(unpaid);
      setPaidJobs(paid);
    } catch (error) {
      console.error('Failed to load payment data:', error);
    } finally {
      setLoading(false);
    }
  }, [dataProvider]);

  useEffect(() => {
    loadPaymentData();
  }, [loadPaymentData]);

  const handleJobPaymentStatusChange = (jobId: string, paymentStatus: 'paid' | 'unpaid') => {
    dataProvider.updateJob(jobId, { paymentStatus });
    loadPaymentData();
  };

  const totalUnpaid = unpaidJobs.reduce((sum, job) => sum + job.price, 0);
  const totalPaid = paidJobs.reduce((sum, job) => sum + job.price, 0);

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

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-200">Payments</h1>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 transition-colors duration-200">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400 mr-2 transition-colors duration-200" />
              <div>
                <p className="text-lg font-bold text-orange-800 dark:text-orange-200 transition-colors duration-200">
                  ${totalUnpaid.toFixed(2)}
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-300 transition-colors duration-200">
                  {unpaidJobs.length} unpaid job{unpaidJobs.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 transition-colors duration-200">
            <div className="flex items-center">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400 mr-2 transition-colors duration-200" />
              <div>
                <p className="text-lg font-bold text-green-800 dark:text-green-200 transition-colors duration-200">
                  ${totalPaid.toFixed(2)}
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 transition-colors duration-200">
                  {paidJobs.length} paid job{paidJobs.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-dark-700 p-1 rounded-lg transition-colors duration-200">
        <button
          onClick={() => setActiveTab('unpaid')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeTab === 'unpaid'
              ? 'bg-white dark:bg-dark-800 text-orange-600 dark:text-orange-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Unpaid ({unpaidJobs.length})
        </button>
        <button
          onClick={() => setActiveTab('paid')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeTab === 'paid'
              ? 'bg-white dark:bg-dark-800 text-green-600 dark:text-green-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Paid ({paidJobs.length})
        </button>
      </div>

      {/* Job List */}
      {currentData.length > 0 ? (
        <>
          <div className="space-y-4 mb-8">
            {paginatedData.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onClick={() => navigate(`/app/jobs/${job.id}`)}
                onPaymentStatusChange={handleJobPaymentStatusChange}
                showQRButton={false}
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
          <DollarSign className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3 transition-colors duration-200" />
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
            {activeTab === 'unpaid' ? 'All jobs are paid up!' : 'No paid jobs yet'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Payments;