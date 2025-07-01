import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '@/components/UI/Breadcrumbs';
import {
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Globe,
  Camera,
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  Briefcase,
  Clock,
  DollarSign,
  Star,
  Award,
  Calendar,
  Users
} from 'lucide-react';

interface BusinessProfile {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  serviceTypes: string[];
  businessHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  pricing: {
    hourlyRate: string;
    minimumCharge: string;
    currency: string;
  };
  bio: string;
  profileImage: string;
}

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Load profile from localStorage or use defaults
  const [profile, setProfile] = useState<BusinessProfile>(() => {
    const saved = localStorage.getItem('myjobtrack_profile');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      businessName: 'Your Service Business',
      ownerName: 'Business Owner',
      email: 'owner@yourbusiness.com',
      phone: '(555) 123-4567',
      address: '123 Business St, City, State 12345',
      website: 'www.yourbusiness.com',
      serviceTypes: ['Lawn Care', 'Landscaping'],
      businessHours: {
        monday: { open: '08:00', close: '17:00', closed: false },
        tuesday: { open: '08:00', close: '17:00', closed: false },
        wednesday: { open: '08:00', close: '17:00', closed: false },
        thursday: { open: '08:00', close: '17:00', closed: false },
        friday: { open: '08:00', close: '17:00', closed: false },
        saturday: { open: '09:00', close: '15:00', closed: false },
        sunday: { open: '10:00', close: '14:00', closed: true }
      },
      pricing: {
        hourlyRate: '75',
        minimumCharge: '50',
        currency: 'USD'
      },
      bio: 'Professional service provider committed to quality work and customer satisfaction.',
      profileImage: ''
    };
  });

  const [editForm, setEditForm] = useState<BusinessProfile>(profile);

  const breadcrumbItems = [
    { label: 'Home', href: '/app' },
    { label: 'Profile', current: true }
  ];

  const serviceTypeOptions = [
    'Lawn Care', 'Landscaping', 'House Cleaning', 'Handyman Services',
    'Pool Maintenance', 'Pest Control', 'HVAC Services', 'Plumbing',
    'Electrical', 'Painting', 'Roofing', 'Tree Services',
    'Snow Removal', 'Pressure Washing', 'Carpet Cleaning', 'Window Cleaning'
  ];

  const dayNames = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!editForm.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!editForm.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required';
    }

    if (!editForm.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!editForm.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!editForm.address.trim()) {
      newErrors.address = 'Business address is required';
    }

    if (editForm.serviceTypes.length === 0) {
      newErrors.serviceTypes = 'Please select at least one service type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage
      localStorage.setItem('myjobtrack_profile', JSON.stringify(editForm));
      setProfile(editForm);
      setIsEditing(false);
      setErrors({});
      setShowSuccess(true);
      
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save profile:', error);
      setErrors({ submit: 'Failed to save profile. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
    setErrors({});
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setEditForm(prev => ({ ...prev, profileImage: imageUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleServiceTypeToggle = (serviceType: string) => {
    setEditForm(prev => ({
      ...prev,
      serviceTypes: prev.serviceTypes.includes(serviceType)
        ? prev.serviceTypes.filter(type => type !== serviceType)
        : [...prev.serviceTypes, serviceType]
    }));
  };

  const handleBusinessHoursChange = (day: keyof typeof profile.businessHours, field: 'open' | 'close' | 'closed', value: string | boolean) => {
    setEditForm(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
      }
    }));
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center justify-between transition-colors duration-200">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 transition-colors duration-200" />
            <p className="text-green-800 dark:text-green-200 font-medium transition-colors duration-200">Profile updated successfully!</p>
          </div>
          <button
            onClick={() => setShowSuccess(false)}
            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 mb-6 transition-colors duration-200">
        <div className="p-4 sm:p-6">
          {/* Mobile Edit Button - Top Right */}
          <div className="flex justify-end mb-4 sm:hidden">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center text-sm"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <div className="relative mb-4 sm:mb-0 self-center sm:self-auto">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-dark-600 shadow-lg transition-colors duration-200"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 flex items-center justify-center shadow-lg">
                    <User className="h-10 w-10 text-white" />
                  </div>
                )}
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-colors duration-200"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="sm:ml-6 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">{profile.businessName}</h1>
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">{profile.ownerName}</p>
                <div className="flex items-center justify-center sm:justify-start mt-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2 transition-colors duration-200">5.0 Rating</span>
                </div>
              </div>
            </div>
            
            {/* Desktop Edit Button */}
            <div className="hidden sm:block">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 transition-colors duration-200">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2 transition-colors duration-200" />
                <div>
                  <p className="text-lg font-bold text-blue-900 dark:text-blue-100 transition-colors duration-200">150+</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 transition-colors duration-200">Customers</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 transition-colors duration-200">
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-green-600 dark:text-green-400 mr-2 transition-colors duration-200" />
                <div>
                  <p className="text-lg font-bold text-green-900 dark:text-green-100 transition-colors duration-200">500+</p>
                  <p className="text-sm text-green-700 dark:text-green-300 transition-colors duration-200">Jobs Done</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 transition-colors duration-200">
              <div className="flex items-center">
                <Award className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2 transition-colors duration-200" />
                <div>
                  <p className="text-lg font-bold text-purple-900 dark:text-purple-100 transition-colors duration-200">3</p>
                  <p className="text-sm text-purple-700 dark:text-purple-300 transition-colors duration-200">Years</p>
                </div>
              </div>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 transition-colors duration-200">
              <div className="flex items-center">
                <Star className="h-6 w-6 text-orange-600 dark:text-orange-400 mr-2 transition-colors duration-200" />
                <div>
                  <p className="text-lg font-bold text-orange-900 dark:text-orange-100 transition-colors duration-200">5.0</p>
                  <p className="text-sm text-orange-700 dark:text-orange-300 transition-colors duration-200">Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business Information */}
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 transition-colors duration-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-200">
                <Building2 className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400 transition-colors duration-200" />
                Business Information
              </h2>

              {isEditing ? (
                <div className="space-y-4">
                  {/* Business Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      value={editForm.businessName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, businessName: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 bg-white dark:bg-dark-700 text-gray-900 dark:text-white ${
                        errors.businessName ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-dark-600'
                      }`}
                    />
                    {errors.businessName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{errors.businessName}</p>
                    )}
                  </div>

                  {/* Owner Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                      Owner Name *
                    </label>
                    <input
                      type="text"
                      value={editForm.ownerName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, ownerName: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 bg-white dark:bg-dark-700 text-gray-900 dark:text-white ${
                        errors.ownerName ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-dark-600'
                      }`}
                    />
                    {errors.ownerName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{errors.ownerName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 bg-white dark:bg-dark-700 text-gray-900 dark:text-white ${
                        errors.email ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-dark-600'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
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
                      Business Address *
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

                  {/* Website */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                      Website
                    </label>
                    <input
                      type="url"
                      value={editForm.website}
                      onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                      placeholder="https://www.yourbusiness.com"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                      Business Description
                    </label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors duration-200 bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                      placeholder="Tell customers about your business..."
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3 transition-colors duration-200" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Email</p>
                      <a href={`mailto:${profile.email}`} className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200">
                        {profile.email}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3 transition-colors duration-200" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Phone</p>
                      <a href={`tel:${profile.phone}`} className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200">
                        {profile.phone}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3 mt-0.5 transition-colors duration-200" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Address</p>
                      <p className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{profile.address}</p>
                    </div>
                  </div>
                  
                  {profile.website && (
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3 transition-colors duration-200" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Website</p>
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200">
                          {profile.website}
                        </a>
                      </div>
                    </div>
                  )}

                  {profile.bio && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 transition-colors duration-200">About</p>
                      <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-dark-700 p-3 rounded-lg transition-colors duration-200">{profile.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Service Types */}
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 transition-colors duration-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-200">
                <Briefcase className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400 transition-colors duration-200" />
                Services Offered
              </h2>

              {isEditing ? (
                <div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {serviceTypeOptions.map((serviceType) => (
                      <label key={serviceType} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editForm.serviceTypes.includes(serviceType)}
                          onChange={() => handleServiceTypeToggle(serviceType)}
                          className="rounded border-gray-300 dark:border-dark-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-dark-700"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">{serviceType}</span>
                      </label>
                    ))}
                  </div>
                  {errors.serviceTypes && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{errors.serviceTypes}</p>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.serviceTypes.map((serviceType) => (
                    <span
                      key={serviceType}
                      className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200"
                    >
                      {serviceType}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 transition-colors duration-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-200">
                <Clock className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400 transition-colors duration-200" />
                Business Hours
              </h2>

              <div className="space-y-3">
                {Object.entries(profile.businessHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center justify-between py-2">
                    <span className="font-medium text-gray-900 dark:text-white w-24 transition-colors duration-200">
                      {dayNames[day as keyof typeof dayNames]}
                    </span>
                    
                    {isEditing ? (
                      <div className="flex items-center space-x-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={!editForm.businessHours[day as keyof typeof editForm.businessHours].closed}
                            onChange={(e) => handleBusinessHoursChange(day as keyof typeof profile.businessHours, 'closed', !e.target.checked)}
                            className="rounded border-gray-300 dark:border-dark-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-dark-700"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">Open</span>
                        </label>
                        
                        {!editForm.businessHours[day as keyof typeof editForm.businessHours].closed && (
                          <>
                            <input
                              type="time"
                              value={editForm.businessHours[day as keyof typeof editForm.businessHours].open}
                              onChange={(e) => handleBusinessHoursChange(day as keyof typeof profile.businessHours, 'open', e.target.value)}
                              className="px-3 py-1 border border-gray-300 dark:border-dark-600 rounded text-sm bg-white dark:bg-dark-700 text-gray-900 dark:text-white transition-colors duration-200"
                            />
                            <span className="text-gray-500 dark:text-gray-400 transition-colors duration-200">to</span>
                            <input
                              type="time"
                              value={editForm.businessHours[day as keyof typeof editForm.businessHours].close}
                              onChange={(e) => handleBusinessHoursChange(day as keyof typeof profile.businessHours, 'close', e.target.value)}
                              className="px-3 py-1 border border-gray-300 dark:border-dark-600 rounded text-sm bg-white dark:bg-dark-700 text-gray-900 dark:text-white transition-colors duration-200"
                            />
                          </>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
                        {hours.closed ? (
                          <span className="text-red-600 dark:text-red-400 transition-colors duration-200">Closed</span>
                        ) : (
                          `${formatTime(hours.open)} - ${formatTime(hours.close)}`
                        )}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 transition-colors duration-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-200">
                <DollarSign className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400 transition-colors duration-200" />
                Pricing
              </h3>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                      Hourly Rate
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500 dark:text-gray-400 transition-colors duration-200">$</span>
                      <input
                        type="number"
                        value={editForm.pricing.hourlyRate}
                        onChange={(e) => setEditForm(prev => ({
                          ...prev,
                          pricing: { ...prev.pricing, hourlyRate: e.target.value }
                        }))}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                        placeholder="75"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                      Minimum Charge
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500 dark:text-gray-400 transition-colors duration-200">$</span>
                      <input
                        type="number"
                        value={editForm.pricing.minimumCharge}
                        onChange={(e) => setEditForm(prev => ({
                          ...prev,
                          pricing: { ...prev.pricing, minimumCharge: e.target.value }
                        }))}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                        placeholder="50"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400 transition-colors duration-200">Hourly Rate:</span>
                    <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-200">${profile.pricing.hourlyRate}/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400 transition-colors duration-200">Minimum:</span>
                    <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-200">${profile.pricing.minimumCharge}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          {!isEditing && (
            <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 transition-colors duration-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-200">Quick Actions</h3>
                
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/app/customers')}
                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    View Customers
                  </button>
                  
                  <button
                    onClick={() => navigate('/app/jobs')}
                    className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    View Jobs
                  </button>
                  
                  <button
                    onClick={() => navigate('/app/settings')}
                    className="w-full bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                  >
                    <User className="h-4 w-4 mr-2" />
                    App Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save/Cancel Actions */}
      {isEditing && (
        <div className="mt-8 bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6 transition-colors duration-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-blue-400 dark:disabled:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving Profile...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save Changes
                </>
              )}
            </button>
            
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 disabled:bg-gray-50 dark:disabled:bg-dark-800 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
            >
              Cancel
            </button>
          </div>

          {errors.submit && (
            <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 transition-colors duration-200">
              <p className="text-red-600 dark:text-red-400 flex items-center transition-colors duration-200">
                <AlertTriangle className="h-5 w-5 mr-2" />
                {errors.submit}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};

export default Profile;