import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Job } from '../types';
import { DataProviderFactory } from '../data/providers/DataProviderFactory';
import JobCard from '../components/Job/JobCard';
import Breadcrumbs from '../components/UI/Breadcrumbs';
import Pagination from '../components/UI/Pagination';
import { usePagination } from '../hooks/usePagination';
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

  useEffect(() => {
    loadPaymentData();
  }, []);

  const loadPaymentData = () => {
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
  };

  const handleJobPaymentStatusChange = (jobId: string, paymentStatus: 'paid' | 'unpaid') => {
    dataProvider.updateJob(jobId, { paymentStatus });
    loadPaymentData();
  };

  const totalUnpaid = unpaidJobs.reduce((sum, job) => sum + job.price, 0);
  const totalPaid = paidJobs.reduce((sum, job) => sum + job.price, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payments</h1>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-orange-600 mr-2" />
              <div>
                <p className="text-lg font-bold text-orange-800">
                  ${totalUnpaid.toFixed(2)}
                </p>
                <p className="text-sm text-orange-700">
                  {unpaidJobs.length} unpaid job{unpaidJobs.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <DollarSign className="h-6 w-6 text-green-600 mr-2" />
              <div>
                <p className="text-lg font-bold text-green-800">
                  ${totalPaid.toFixed(2)}
                </p>
                <p className="text-sm text-green-700">
                  {paidJobs.length} paid job{paidJobs.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('unpaid')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'unpaid'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Unpaid ({unpaidJobs.length})
        </button>
        <button
          onClick={() => setActiveTab('paid')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'paid'
              ? 'bg-white text-green-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
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
        <div className="bg-white rounded-lg p-8 text-center shadow-sm border border-gray-200">
          <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">
            {activeTab === 'unpaid' ? 'All jobs are paid up!' : 'No paid jobs yet'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Payments;