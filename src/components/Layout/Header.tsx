import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Bell, Settings, User } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/app' || path === '/app/dashboard') return 'Dashboard';
    if (path === '/app/customers') return 'Customers';
    if (path === '/app/jobs') return 'Jobs';
    if (path === '/app/payments') return 'Payments';
    if (path === '/app/scan') return 'Scan QR Code';
    if (path === '/app/settings') return 'Settings';
    if (path === '/app/profile') return 'Profile';
    if (path.includes('/customers/')) return 'Customer Details';
    if (path.includes('/jobs/')) return 'Job Details';
    if (path.includes('/new')) return 'Add New';
    return 'MyJobTrack';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <button
              onClick={() => navigate('/app')}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">MyJobTrack</h1>
                <p className="text-xs text-gray-500 -mt-1">Job Tracking</p>
              </div>
            </button>
          </div>

          {/* Page Title - Mobile */}
          <div className="sm:hidden">
            <h2 className="text-lg font-semibold text-gray-900">{getPageTitle()}</h2>
          </div>

          {/* Page Title - Desktop */}
          <div className="hidden sm:block">
            <h2 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h2>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="h-5 w-5" />
              {/* Notification dot */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Settings */}
            <button 
              onClick={() => navigate('/app/settings')}
              className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                location.pathname.includes('/settings')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Settings className="h-5 w-5" />
            </button>

            {/* Profile */}
            <button 
              onClick={() => navigate('/app/profile')}
              className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                location.pathname.includes('/profile')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;