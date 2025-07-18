import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataProviderFactory } from '@/data/providers/DataProviderFactory';
import { useDemo } from '@/contexts/DemoContext';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import { Customer } from '@/types';
import { ArrowLeft, Calendar, User, Briefcase, DollarSign, FileText, Save, X, Plus, Info } from 'lucide-react';
import { format } from 'date-fns';
import Breadcrumbs from '@/components/UI/Breadcrumbs';

const AddJob: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    serviceType: '',
    scheduledDate: '',
    price: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dataProvider = DataProviderFactory.getInstance();
  const { isDemoMode } = useDemo();
  const { trackPageView, trackFeatureInteraction } = useAnalytics();

  const commonServices = [
    'Lawn Mowing',
    'Hedge Trimming',
    'Leaf Removal',
    'Garden Maintenance',
    'House Cleaning',
    'Deep Clean',
    'Window Cleaning',
    'Carpet Cleaning',
    'Plumbing Repair',
    'Electrical Work',
    'Painting',
    'Handyman Services',
    'Pool Cleaning',
    'Pool Maintenance',
    'Pest Control',
    'HVAC Service',
    'Pressure Washing',
    'Gutter Cleaning',
    'Snow Removal',
    'Tree Trimming',
    'Other'
  ];

  const breadcrumbItems = [
    { label: 'Home', href: '/app' },
    { label: 'Jobs', href: '/app/jobs' },
    { label: 'Schedule Job', current: true }
  ];

  const loadCustomers = useCallback(() => {
    try {
      const customerData = dataProvider.getCustomers();
      setCustomers(customerData);
    } catch (error) {
      console.error('Failed to load customers:', error);
    }
  }, [dataProvider]);

  useEffect(() => {
    // Track page view
    trackPageView();
    
    loadCustomers();
    // Set default date to today
    setFormData(prev => ({
      ...prev,
      scheduledDate: format(new Date(), 'yyyy-MM-dd')
    }));
  }, [loadCustomers, trackPageView]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerId) {
      newErrors.customerId = 'Please select a customer';
    }

    if (!formData.serviceType.trim()) {
      newErrors.serviceType = 'Service type is required';
    }

    if (!formData.scheduledDate) {
      newErrors.scheduledDate = 'Scheduled date is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price < 0) {
        newErrors.price = 'Please enter a valid price';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const job = dataProvider.addJob({
        customerId: formData.customerId,
        title: formData.serviceType.trim(),
        serviceType: formData.serviceType.trim(),
        scheduledDate: formData.scheduledDate,
        price: parseFloat(formData.price),
        status: 'scheduled',
        paymentStatus: 'unpaid',
        paid: false,
        notes: formData.notes.trim()
      });

      // Track successful job creation
      trackFeatureInteraction('job_management', 'job_created', {
        service_type: formData.serviceType.trim(),
        price: parseFloat(formData.price),
        has_notes: !!formData.notes.trim(),
        customer_id: formData.customerId
      });

      // Navigate to jobs list with success message
      navigate('/app/jobs', { 
        state: { 
          message: `Job "${job.serviceType}" scheduled successfully for ${format(new Date(job.scheduledDate), 'MMM d, yyyy')}!`,
          newJobId: job.id 
        }
      });
    } catch (error) {
      console.error('Failed to schedule job:', error);
      setErrors({ submit: 'Failed to schedule job. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    setFormData(prev => ({
      ...prev,
      customerId,
      customerName: customer?.name || '',
      serviceType: customer?.serviceType || prev.serviceType
    }));
    // Clear customer error
    if (errors.customerId) {
      setErrors(prev => ({ ...prev, customerId: '' }));
    }
  };

  const formatPrice = (value: string) => {
    // Remove all non-digits and decimal points
    const cleaned = value.replace(/[^\d.]/g, '');
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    return cleaned;
  };

  const handlePriceChange = (value: string) => {
    const formatted = formatPrice(value);
    handleInputChange('price', formatted);
  };

  // Get minimum date (today)
  const minDate = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-200">
      {/* Page Header */}
      <div className="bg-white dark:bg-dark-800 shadow-sm border-b border-gray-200 dark:border-dark-700 mb-6 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/app/jobs')}
                className="mr-4 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Schedule Job</h1>
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">Create a new service appointment</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/app/jobs')}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 pb-8">
        {/* Demo Mode Indicator */}
        {isDemoMode && (
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 transition-colors duration-200">
            <div className="flex items-center">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <p className="text-blue-800 dark:text-blue-200 font-medium">
                Demo Mode: Changes are saved locally and won't sync to a server.
              </p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Selection */}
          <div>
            <label htmlFor="customer" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
              Customer *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <select
                id="customer"
                value={formData.customerId}
                onChange={(e) => handleCustomerChange(e.target.value)}
                className={`
                  block w-full pl-12 pr-4 py-4 text-lg border rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-colors duration-200 bg-white dark:bg-dark-700 text-gray-900 dark:text-white appearance-none
                  ${errors.customerId ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-dark-600 hover:border-gray-400 dark:hover:border-dark-500'}
                `}
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.serviceType}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.customerId && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center transition-colors duration-200">
                <X className="h-4 w-4 mr-1" />
                {errors.customerId}
              </p>
            )}
            
            {/* Add Customer Button */}
            {customers.length === 0 ? (
              <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors duration-200">
                <p className="text-blue-800 dark:text-blue-200 mb-3 transition-colors duration-200">No customers found. Add your first customer to get started.</p>
                <button
                  type="button"
                  onClick={() => navigate('/app/customers/new')}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/app/customers/new')}
                className="mt-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add New Customer
              </button>
            )}
          </div>

          {/* Service Type */}
          <div>
            <label htmlFor="serviceType" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
              Service Type *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <select
                id="serviceType"
                value={formData.serviceType}
                onChange={(e) => handleInputChange('serviceType', e.target.value)}
                className={`
                  block w-full pl-12 pr-4 py-4 text-lg border rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-colors duration-200 bg-white dark:bg-dark-700 text-gray-900 dark:text-white appearance-none
                  ${errors.serviceType ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-dark-600 hover:border-gray-400 dark:hover:border-dark-500'}
                `}
              >
                <option value="">Select service type</option>
                {commonServices.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.serviceType && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center transition-colors duration-200">
                <X className="h-4 w-4 mr-1" />
                {errors.serviceType}
              </p>
            )}
            
            {/* Custom Service Type Input */}
            {formData.serviceType === 'Other' && (
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Enter custom service type"
                  value={formData.serviceType === 'Other' ? '' : formData.serviceType}
                  onChange={(e) => handleInputChange('serviceType', e.target.value)}
                  className="block w-full px-4 py-3 text-lg border border-gray-300 dark:border-dark-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white transition-colors duration-200"
                />
              </div>
            )}
          </div>

          {/* Scheduled Date */}
          <div>
            <label htmlFor="scheduledDate" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
              Scheduled Date *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="date"
                id="scheduledDate"
                value={formData.scheduledDate}
                min={minDate}
                onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                className={`
                  block w-full pl-12 pr-4 py-4 text-lg border rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-colors duration-200 bg-white dark:bg-dark-700 text-gray-900 dark:text-white
                  ${errors.scheduledDate ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-dark-600 hover:border-gray-400 dark:hover:border-dark-500'}
                `}
              />
            </div>
            {errors.scheduledDate && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center transition-colors duration-200">
                <X className="h-4 w-4 mr-1" />
                {errors.scheduledDate}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
              Service Price *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                id="price"
                value={formData.price}
                onChange={(e) => handlePriceChange(e.target.value)}
                placeholder="0.00"
                className={`
                  block w-full pl-12 pr-4 py-4 text-lg border rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-colors duration-200 bg-white dark:bg-dark-700 text-gray-900 dark:text-white
                  ${errors.price ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-dark-600 hover:border-gray-400 dark:hover:border-dark-500'}
                `}
              />
            </div>
            {errors.price && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center transition-colors duration-200">
                <X className="h-4 w-4 mr-1" />
                {errors.price}
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
              Service Notes
              <span className="text-gray-500 dark:text-gray-400 font-normal ml-1">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Add any special instructions, areas to focus on, or customer preferences..."
                rows={4}
                className="
                  block w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-dark-600 rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-colors duration-200 bg-white dark:bg-dark-700 text-gray-900 dark:text-white resize-none hover:border-gray-400 dark:hover:border-dark-500
                "
              />
            </div>
          </div>

          {/* Submit Error/Info */}
          {errors.submit && (
            <div className={`border rounded-xl p-4 transition-colors duration-200 ${
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-blue-400 dark:disabled:bg-blue-600
                text-white py-4 px-6 rounded-xl text-lg font-semibold
                transition-colors duration-200 shadow-lg hover:shadow-xl
                flex items-center justify-center
                disabled:cursor-not-allowed
              "
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Scheduling Job...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Schedule Job
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/app/jobs')}
              disabled={isSubmitting}
              className="
                flex-1 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 disabled:bg-gray-50 dark:disabled:bg-dark-800
                text-gray-700 dark:text-gray-300 py-4 px-6 rounded-xl text-lg font-semibold
                transition-colors duration-200 border border-gray-300 dark:border-dark-600
                disabled:cursor-not-allowed
              "
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2 transition-colors duration-200">📅 Scheduling Tips</h3>
          <ul className="text-green-800 dark:text-green-200 space-y-1 text-sm transition-colors duration-200">
            <li>• Jobs are automatically set to "Scheduled" status</li>
            <li>• You can mark jobs as complete when finished</li>
            <li>• Payment status starts as "Unpaid" until marked otherwise</li>
            <li>• Use notes to remember special customer requests</li>
            <li>• Generate QR codes after scheduling for easy on-site access</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddJob;