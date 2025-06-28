import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Job } from '../types';
import { DataProviderFactory } from '../data/DataProviderFactory';
import JobCard from '../components/Job/JobCard';
import QuickActionButton from '../components/UI/QuickActionButton';
import QRCodeDisplay from '../components/QR/QRCodeDisplay';
import Breadcrumbs from '../components/UI/Breadcrumbs';
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
  }, [location.state]);

  const loadJobs = () => {
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
  };

  const handleJobStatusChange = (jobId: string, status: 'scheduled' | 'in-progress' | 'completed') => {
    const updates: any = { status };
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

  const filteredJobs = filter === 'all' ? jobs : jobs.filter(job => job.status === filter);

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

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
          <button
            onClick={() => setSuccessMessage('')}
            className="text-green-600 hover:text-green-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-600">
            {jobs.length} job{jobs.length !== 1 ? 's' : ''} total
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
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'all', label: 'All Jobs' },
          { key: 'scheduled', label: 'Scheduled' },
          { key: 'in-progress', label: 'In Progress' },
          { key: 'completed', label: 'Completed' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as typeof filter)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              filter === key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Job List */}
      {filteredJobs.length > 0 ? (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
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
      ) : (
        <div className="bg-white rounded-lg p-8 text-center shadow-sm border border-gray-200">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">
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