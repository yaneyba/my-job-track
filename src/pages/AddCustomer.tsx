import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataProviderFactory } from '@/data/providers/DataProviderFactory';
import { ArrowLeft, User, Phone, MapPin, Briefcase, Save, X } from 'lucide-react';
import Breadcrumbs from '@/components/UI/Breadcrumbs';

const AddCustomer: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    serviceType: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dataProvider = DataProviderFactory.getInstance();

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
    { label: 'Add Customer', current: true }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Customer name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-().+.]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.serviceType.trim()) {
      newErrors.serviceType = 'Service type is required';
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
      const customer = dataProvider.addCustomer({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        serviceType: formData.serviceType.trim(),
        totalUnpaid: 0
      });

      // Navigate to customer detail or back to customers list
      navigate('/app/customers', { 
        state: { 
          message: `Customer "${customer.name}" added successfully!`,
          newCustomerId: customer.id 
        }
      });
    } catch (error) {
      console.error('Failed to add customer:', error);
      setErrors({ submit: 'Failed to add customer. Please try again.' });
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

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
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
    handleInputChange('phone', formatted);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-200">
      {/* Page Header */}
      <div className="bg-white dark:bg-dark-800 shadow-sm border-b border-gray-200 dark:border-dark-700 mb-6 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/app/customers')}
                className="mr-4 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Add Customer</h1>
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">Create a new customer profile</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/app/customers')}
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
              Customer Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter customer's full name"
                className={`
                  block w-full pl-12 pr-4 py-4 text-lg border rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-colors duration-200 bg-white dark:bg-dark-700 text-gray-900 dark:text-white
                  ${errors.name ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-dark-600 hover:border-gray-400 dark:hover:border-dark-500'}
                `}
              />
            </div>
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center transition-colors duration-200">
                <X className="h-4 w-4 mr-1" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
              Phone Number *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="(555) 123-4567"
                className={`
                  block w-full pl-12 pr-4 py-4 text-lg border rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-colors duration-200 bg-white dark:bg-dark-700 text-gray-900 dark:text-white
                  ${errors.phone ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-dark-600 hover:border-gray-400 dark:hover:border-dark-500'}
                `}
              />
            </div>
            {errors.phone && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center transition-colors duration-200">
                <X className="h-4 w-4 mr-1" />
                {errors.phone}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
              Service Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Main Street, City, State, ZIP"
                rows={3}
                className={`
                  block w-full pl-12 pr-4 py-4 text-lg border rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-colors duration-200 bg-white dark:bg-dark-700 text-gray-900 dark:text-white resize-none
                  ${errors.address ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-dark-600 hover:border-gray-400 dark:hover:border-dark-500'}
                `}
              />
            </div>
            {errors.address && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center transition-colors duration-200">
                <X className="h-4 w-4 mr-1" />
                {errors.address}
              </p>
            )}
          </div>

          {/* Service Type */}
          <div>
            <label htmlFor="serviceType" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
              Primary Service Type *
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
                <option value="">Select a service type</option>
                {serviceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
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
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 transition-colors duration-200">
              <p className="text-red-600 dark:text-red-400 flex items-center transition-colors duration-200">
                <X className="h-5 w-5 mr-2" />
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
                  Adding Customer...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Add Customer
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/app/customers')}
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
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2 transition-colors duration-200">💡 Pro Tips</h3>
          <ul className="text-blue-800 dark:text-blue-200 space-y-1 text-sm transition-colors duration-200">
            <li>• Use the customer's preferred name for easy recognition</li>
            <li>• Include apartment/unit numbers in the address</li>
            <li>• Choose the most common service you provide for this customer</li>
            <li>• You can always edit this information later</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;