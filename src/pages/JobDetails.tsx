import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Job, Customer } from '@/types';
import { DataProviderFactory } from '@/data/providers/DataProviderFactory';
import Breadcrumbs from '@/components/UI/Breadcrumbs';
import StatusBadge from '@/components/UI/StatusBadge';
import QRCodeDisplay from '@/components/QR/QRCodeDisplay';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  QrCode,
  Calendar,
  User,
  Phone,
  MapPin,
  DollarSign,
  FileText,
  CheckCircle,
  AlertTriangle,
  Save,
  X,
  Briefcase
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editForm, setEditForm] = useState({
    serviceType: '',
    scheduledDate: '',
    price: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dataProvider = DataProviderFactory.getInstance();

  const breadcrumbItems = [
    { label: 'Home', href: '/app' },
    { label: 'Jobs', href: '/app/jobs' },
    { label: job?.serviceType || 'Job Details', current: true }
  ];

  const loadJobDetails = useCallback(() => {
    setLoading(true);
    try {
      const jobData = dataProvider.getJob(id!);
      if (jobData) {
        setJob(jobData);
        const customerData = dataProvider.getCustomer(jobData.customerId);
        setCustomer(customerData || null);
        
        // Initialize edit form
        setEditForm({
          serviceType: jobData.serviceType,
          scheduledDate: jobData.scheduledDate,
          price: jobData.price.toString(),
          notes: jobData.notes
        });
      } else {
        navigate('/app/jobs');
      }
    } catch (error) {
      console.error('Failed to load job details:', error);
      navigate('/app/jobs');
    } finally {
      setLoading(false);
    }
  }, [id, navigate, dataProvider]);

  useEffect(() => {
    if (id) {
      loadJobDetails();
    }
  }, [id, loadJobDetails]);

  const handleStatusChange = (newStatus: Job['status']) => {
    if (!job) return;
    
    const updates: Partial<Job> = { status: newStatus };
    if (newStatus === 'completed') {
      updates.completedDate = new Date().toISOString();
    }
    
    const updatedJob = dataProvider.updateJob(job.id, updates);
    if (updatedJob) {
      setJob(updatedJob);
    }
  };

  const handlePaymentStatusChange = (newPaymentStatus: Job['paymentStatus']) => {
    if (!job) return;
    
    const updatedJob = dataProvider.updateJob(job.id, { paymentStatus: newPaymentStatus });
    if (updatedJob) {
      setJob(updatedJob);
    }
  };

  const validateEditForm = () => {
    const newErrors: Record<string, string> = {};

    if (!editForm.serviceType.trim()) {
      newErrors.serviceType = 'Service type is required';
    }

    if (!editForm.scheduledDate) {
      newErrors.scheduledDate = 'Scheduled date is required';
    }

    if (!editForm.price.trim()) {
      newErrors.price = 'Price is required';
    } else {
      const price = parseFloat(editForm.price);
      if (isNaN(price) || price < 0) {
        newErrors.price = 'Please enter a valid price';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveEdit = async () => {
    if (!job || !validateEditForm()) return;

    setIsSubmitting(true);
    try {
      const updates = {
        serviceType: editForm.serviceType.trim(),
        scheduledDate: editForm.scheduledDate,
        price: parseFloat(editForm.price),
        notes: editForm.notes.trim()
      };

      const updatedJob = dataProvider.updateJob(job.id, updates);
      if (updatedJob) {
        setJob(updatedJob);
        setIsEditing(false);
        setErrors({});
      }
    } catch (error) {
      console.error('Failed to update job:', error);
      setErrors({ submit: 'Failed to update job. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!job) return;
    
    const success = dataProvider.deleteJob(job.id);
    if (success) {
      navigate('/app/jobs', {
        state: { message: `Job "${job.serviceType}" has been deleted.` }
      });
    }
  };

  const formatPrice = (value: string) => {
    const cleaned = value.replace(/[^\d.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    return cleaned;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job || !customer) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg p-8 text-center shadow-sm border border-gray-200">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">Job not found</p>
          <button
            onClick={() => navigate('/app/jobs')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Jobs
          </button>
        </div>
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/app/jobs')}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {job.serviceType}
                </h1>
                <p className="text-gray-600">
                  Scheduled for {format(parseISO(job.scheduledDate), 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowQRCode(true)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Show QR Code"
              >
                <QrCode size={20} />
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Edit Job"
              >
                <Edit3 size={20} />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Job"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                if (job.status === 'scheduled') handleStatusChange('in-progress');
                else if (job.status === 'in-progress') handleStatusChange('completed');
              }}
              disabled={job.status === 'completed'}
              className="transition-transform hover:scale-105"
            >
              <StatusBadge status={job.status} />
            </button>
            <button
              onClick={() => handlePaymentStatusChange(job.paymentStatus === 'paid' ? 'unpaid' : 'paid')}
              disabled={job.status !== 'completed'}
              className="transition-transform hover:scale-105"
            >
              <StatusBadge status={job.paymentStatus} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                Job Information
              </h2>

              {isEditing ? (
                <div className="space-y-4">
                  {/* Service Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Type *
                    </label>
                    <input
                      type="text"
                      value={editForm.serviceType}
                      onChange={(e) => setEditForm(prev => ({ ...prev, serviceType: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.serviceType ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.serviceType && (
                      <p className="mt-1 text-sm text-red-600">{errors.serviceType}</p>
                    )}
                  </div>

                  {/* Scheduled Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scheduled Date *
                    </label>
                    <input
                      type="date"
                      value={editForm.scheduledDate}
                      onChange={(e) => setEditForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.scheduledDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.scheduledDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.scheduledDate}</p>
                    )}
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={editForm.price}
                        onChange={(e) => setEditForm(prev => ({ ...prev, price: formatPrice(e.target.value) }))}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.price ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={editForm.notes}
                      onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Add any special instructions or notes..."
                    />
                  </div>

                  {/* Edit Actions */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleSaveEdit}
                      disabled={isSubmitting}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setErrors({});
                        setEditForm({
                          serviceType: job.serviceType,
                          scheduledDate: job.scheduledDate,
                          price: job.price.toString(),
                          notes: job.notes
                        });
                      }}
                      disabled={isSubmitting}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>

                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-600 flex items-center">
                        <X className="h-5 w-5 mr-2" />
                        {errors.submit}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Scheduled Date</p>
                        <p className="font-medium text-gray-900">
                          {format(parseISO(job.scheduledDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="font-medium text-gray-900">${job.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {job.completedDate && (
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Completed Date</p>
                        <p className="font-medium text-gray-900">
                          {format(parseISO(job.completedDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  )}

                  {job.notes && (
                    <div>
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-1">Notes</p>
                          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{job.notes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Customer
              </h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">{customer.name}</p>
                </div>
                
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <a
                    href={`tel:${customer.phone}`}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {customer.phone}
                  </a>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-1" />
                  <p className="text-gray-700 text-sm">{customer.address}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Service Type</p>
                  <p className="font-medium text-gray-900">{customer.serviceType}</p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/app/customers/${customer.id}`)}
                className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
              >
                View Customer Details
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => setShowQRCode(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Show QR Code
                </button>
                
                {job.status !== 'completed' && (
                  <button
                    onClick={() => {
                      if (job.status === 'scheduled') handleStatusChange('in-progress');
                      else if (job.status === 'in-progress') handleStatusChange('completed');
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {job.status === 'scheduled' ? 'Start Job' : 'Complete Job'}
                  </button>
                )}
                
                {job.status === 'completed' && job.paymentStatus === 'unpaid' && (
                  <button
                    onClick={() => handlePaymentStatusChange('paid')}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Mark as Paid
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRCode && (
        <QRCodeDisplay
          type="job"
          id={job.id}
          title={job.serviceType}
          subtitle={`${customer.name} • ${format(parseISO(job.scheduledDate), 'MMM d, yyyy')}`}
          onClose={() => setShowQRCode(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Delete Job</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this job? This action cannot be undone.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Delete Job
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;