import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Customer, Job } from '@/types';
import { DataProviderFactory } from '@/data/providers/DataProviderFactory';
import { useDemo } from '@/contexts/DemoContext';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import Breadcrumbs from '@/components/UI/Breadcrumbs';
import JobCard from '@/components/Job/JobCard';
import QRCodeDisplay from '@/components/QR/QRCodeDisplay';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  QrCode,
  User,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  AlertTriangle,
  Save,
  X,
  Plus,
  CheckCircle,
  Clock,
  TrendingUp,
  Info
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const CustomerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { trackPageView, trackFeatureInteraction } = useAnalytics();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerJobs, setCustomerJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    address: '',
    serviceType: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dataProvider = DataProviderFactory.getInstance();
  const { isDemoMode } = useDemo();

  const serviceTypes = [
    'Lawn Care',
    'House Cleaning',
    'Handyman Services',
    'Landscaping',
    'Pool Maintenance',
    'Pest Control',
    'HVAC Services',
    'Plumbing',
    'Electrical',
    'Painting',
    'Roofing',
    'Tree Services',
    'Snow Removal',
    'Pressure Washing',
    'Other'
  ];

  const breadcrumbItems = [
    { label: 'Home', href: '/app' },
    { label: 'Customers', href: '/app/customers' },
    { label: customer?.name || 'Customer Details', current: true }
  ];

  const loadCustomerDetails = useCallback(() => {
    setLoading(true);
    try {
      const customerData = dataProvider.getCustomer(id!);
      if (customerData) {
        setCustomer(customerData);
        // Track page view
        trackPageView();
        const jobs = dataProvider.getJobsByCustomer(id!);
        // Sort jobs by scheduled date (most recent first)
        const sortedJobs = jobs.sort((a, b) => 
          parseISO(b.scheduledDate).getTime() - parseISO(a.scheduledDate).getTime()
        );
        setCustomerJobs(sortedJobs);
        
        // Initialize edit form
        setEditForm({
          name: customerData.name,
          phone: customerData.phone,
          address: customerData.address,
          serviceType: customerData.serviceType
        });
      } else {
        navigate('/app/customers');
      }
    } catch (error) {
      console.error('Failed to load customer details:', error);
      navigate('/app/customers');
    } finally {
      setLoading(false);
    }
  }, [id, navigate, dataProvider]);

  useEffect(() => {
    if (id) {
      loadCustomerDetails();
    }
  }, [id, loadCustomerDetails]);

  const validateEditForm = () => {
    const newErrors: Record<string, string> = {};

    if (!editForm.name.trim()) {
      newErrors.name = 'Customer name is required';
    }

    if (!editForm.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-().+.]+$/.test(editForm.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!editForm.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!editForm.serviceType.trim()) {
      newErrors.serviceType = 'Service type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveEdit = async () => {
    if (!customer || !validateEditForm()) return;

    setIsSubmitting(true);
    try {
      const updates = {
        name: editForm.name.trim(),
        phone: editForm.phone.trim(),
        address: editForm.address.trim(),
        serviceType: editForm.serviceType.trim()
      };

      const updatedCustomer = dataProvider.updateCustomer(customer.id, updates);
      if (updatedCustomer) {
        setCustomer(updatedCustomer);
        setIsEditing(false);
        setErrors({});
        trackFeatureInteraction('customer_management', 'customer_updated', { customerId: updatedCustomer.id });
      }
    } catch (error) {
      console.error('Failed to update customer:', error);
      setErrors({ submit: 'Failed to update customer. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!customer) return;
    
    const success = dataProvider.deleteCustomer(customer.id);
    if (success) {
      navigate('/app/customers', {
        state: { message: `Customer "${customer.name}" has been deleted.` }
      });
      trackFeatureInteraction('customer_management', 'customer_deleted', { customerId: customer.id });
    }
  };

  const handleJobStatusChange = (jobId: string, status: Job['status']) => {
    const updates: Partial<Job> = { status };
    if (status === 'completed') {
      updates.completedDate = new Date().toISOString();
    }
    dataProvider.updateJob(jobId, updates);
    loadCustomerDetails(); // Reload to update totals
  };

  const handleJobPaymentStatusChange = (jobId: string, paymentStatus: Job['paymentStatus']) => {
    dataProvider.updateJob(jobId, { paymentStatus });
    loadCustomerDetails(); // Reload to update totals
  };

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    
    if (digits.length >= 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    } else if (digits.length >= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length >= 3) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    }
    return digits;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setEditForm(prev => ({ ...prev, phone: formatted }));
  };

  // Calculate customer statistics
  const completedJobs = customerJobs.filter(job => job.status === 'completed');
  const unpaidJobs = customerJobs.filter(job => job.paymentStatus === 'unpaid');
  const totalEarned = completedJobs.filter(job => job.paymentStatus === 'paid').reduce((sum, job) => sum + job.price, 0);
  const totalUnpaid = unpaidJobs.reduce((sum, job) => sum + job.price, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 transition-colors duration-200"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-dark-800 rounded-lg p-8 text-center shadow-sm border border-gray-200 dark:border-dark-700 transition-colors duration-200">
          <AlertTriangle className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3 transition-colors duration-200" />
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">Customer not found</p>
          <button
            onClick={() => navigate('/app/customers')}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
          >
            Back to Customers
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
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 mb-6 transition-colors duration-200">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/app/customers')}
                className="mr-4 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 transition-colors duration-200">
                  {customer.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">{customer.serviceType}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowQRCode(true)}
                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                title="Show QR Code"
              >
                <QrCode size={20} />
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors duration-200"
                title="Edit Customer"
              >
                <Edit3 size={20} />
              </button>
              {/* Only show delete button for user-created customers */}
              {customer.id.startsWith('customer-') && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                  title="Delete Customer"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Customer Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 transition-colors duration-200">
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2 transition-colors duration-200" />
                <div>
                  <p className="text-lg font-bold text-blue-900 dark:text-blue-100 transition-colors duration-200">{customerJobs.length}</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 transition-colors duration-200">Total Jobs</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 transition-colors duration-200">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mr-2 transition-colors duration-200" />
                <div>
                  <p className="text-lg font-bold text-green-900 dark:text-green-100 transition-colors duration-200">{completedJobs.length}</p>
                  <p className="text-sm text-green-700 dark:text-green-300 transition-colors duration-200">Completed</p>
                </div>
              </div>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 transition-colors duration-200">
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400 mr-2 transition-colors duration-200" />
                <div>
                  <p className="text-lg font-bold text-orange-900 dark:text-orange-100 transition-colors duration-200">${totalUnpaid.toFixed(0)}</p>
                  <p className="text-sm text-orange-700 dark:text-orange-300 transition-colors duration-200">Unpaid</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 transition-colors duration-200">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2 transition-colors duration-200" />
                <div>
                  <p className="text-lg font-bold text-purple-900 dark:text-purple-100 transition-colors duration-200">${totalEarned.toFixed(0)}</p>
                  <p className="text-sm text-purple-700 dark:text-purple-300 transition-colors duration-200">Earned</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 transition-colors duration-200">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-200">
                <User className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400 transition-colors duration-200" />
                Customer Information
              </h2>

              {isEditing ? (
                <div className="space-y-4">
                  {/* Customer Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 bg-white dark:bg-dark-700 text-gray-900 dark:text-white ${
                        errors.name ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-dark-600'
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{errors.name}</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 bg-white dark:bg-dark-700 text-gray-900 dark:text-white ${
                        errors.phone ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-dark-600'
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{errors.phone}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                      Service Address *
                    </label>
                    <textarea
                      value={editForm.address}
                      onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors duration-200 bg-white dark:bg-dark-700 text-gray-900 dark:text-white ${
                        errors.address ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-dark-600'
                      }`}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{errors.address}</p>
                    )}
                  </div>

                  {/* Service Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                      Primary Service Type *
                    </label>
                    <select
                      value={editForm.serviceType}
                      onChange={(e) => setEditForm(prev => ({ ...prev, serviceType: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 bg-white dark:bg-dark-700 text-gray-900 dark:text-white ${
                        errors.serviceType ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-dark-600'
                      }`}
                    >
                      <option value="">Select a service type</option>
                      {serviceTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.serviceType && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{errors.serviceType}</p>
                    )}
                  </div>

                  {/* Edit Actions */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleSaveEdit}
                      disabled={isSubmitting}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-blue-400 dark:disabled:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
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
                          name: customer.name,
                          phone: customer.phone,
                          address: customer.address,
                          serviceType: customer.serviceType
                        });
                      }}
                      disabled={isSubmitting}
                      className="flex-1 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>

                  {errors.submit && (
                    <div className={`border rounded-lg p-4 transition-colors duration-200 ${
                      isDemoMode 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    }`}>
                      <p className={`flex items-center transition-colors duration-200 ${
                        isDemoMode 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {isDemoMode ? (
                          <Info className="h-5 w-5 mr-2" />
                        ) : (
                          <X className="h-5 w-5 mr-2" />
                        )}
                        {errors.submit}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3 transition-colors duration-200" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Phone Number</p>
                      <a
                        href={`tel:${customer.phone}`}
                        className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                      >
                        {customer.phone}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3 mt-0.5 transition-colors duration-200" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Service Address</p>
                      <p className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{customer.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3 transition-colors duration-200" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Primary Service Type</p>
                      <p className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{customer.serviceType}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3 transition-colors duration-200" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Customer Since</p>
                      <p className="font-medium text-gray-900 dark:text-white transition-colors duration-200">
                        {format(parseISO(customer.createdDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Job History */}
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 transition-colors duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-0 flex items-center transition-colors duration-200">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400 transition-colors duration-200" />
                  Job History ({customerJobs.length})
                </h2>
                <button
                  onClick={() => navigate('/app/jobs/new')}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Job
                </button>
              </div>

              {customerJobs.length > 0 ? (
                <div className="space-y-4">
                  {customerJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onClick={() => navigate(`/app/jobs/${job.id}`)}
                      onStatusChange={handleJobStatusChange}
                      onPaymentStatusChange={handleJobPaymentStatusChange}
                      showQRButton={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3 transition-colors duration-200" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-200">No jobs scheduled yet</p>
                  <button
                    onClick={() => navigate('/app/jobs/new')}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center mx-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule First Job
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 transition-colors duration-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">Quick Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => setShowQRCode(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Show QR Code
                </button>
                
                <button
                  onClick={() => navigate('/app/jobs/new')}
                  className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Job
                </button>
                
                <a
                  href={`tel:${customer.phone}`}
                  className="w-full bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Customer
                </a>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          {totalUnpaid > 0 && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center transition-colors duration-200">
                <DollarSign className="h-5 w-5 mr-2" />
                Outstanding Balance
              </h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-orange-700 dark:text-orange-300 transition-colors duration-200">Total Unpaid:</span>
                  <span className="font-bold text-orange-900 dark:text-orange-100 transition-colors duration-200">${totalUnpaid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700 dark:text-orange-300 transition-colors duration-200">Unpaid Jobs:</span>
                  <span className="font-medium text-orange-900 dark:text-orange-100 transition-colors duration-200">{unpaidJobs.length}</span>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/app/payments')}
                className="w-full mt-4 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
              >
                View Payment Details
              </button>
            </div>
          )}

          {/* Customer Stats */}
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 transition-colors duration-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">Customer Stats</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 transition-colors duration-200">Total Jobs:</span>
                  <span className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{customerJobs.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 transition-colors duration-200">Completed:</span>
                  <span className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{completedJobs.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 transition-colors duration-200">Total Earned:</span>
                  <span className="font-medium text-gray-900 dark:text-white transition-colors duration-200">${totalEarned.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 transition-colors duration-200">Average Job:</span>
                  <span className="font-medium text-gray-900 dark:text-white transition-colors duration-200">
                    ${completedJobs.length > 0 ? (totalEarned / completedJobs.length).toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRCode && (
        <QRCodeDisplay
          type="customer"
          id={customer.id}
          title={customer.name}
          subtitle={`${customer.serviceType} • ${customer.phone}`}
          onClose={() => setShowQRCode(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center p-4 z-50 transition-colors duration-200">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 max-w-md w-full shadow-2xl border border-gray-200 dark:border-dark-700 transition-colors duration-200">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 mr-3 transition-colors duration-200" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-200">Delete Customer</h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-200">
              Are you sure you want to delete <strong>{customer.name}</strong>? 
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-200">
              This will also delete all associated jobs ({customerJobs.length} jobs). This action cannot be undone.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
              >
                Delete Customer
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-medium transition-colors duration-200"
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

export default CustomerDetails;