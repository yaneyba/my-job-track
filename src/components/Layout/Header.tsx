import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../UI/ThemeToggle';
import { Calendar, Bell, Settings, User, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-dark-800 shadow-sm border-b border-gray-200 dark:border-dark-700 sticky top-0 z-40 transition-colors duration-200">
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
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">MyJobTrack</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Job Tracking</p>
              </div>
            </button>
          </div>

          {/* Page Title - Mobile */}
          <div className="sm:hidden">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{getPageTitle()}</h2>
          </div>

          {/* Page Title - Desktop */}
          <div className="hidden sm:block">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{getPageTitle()}</h2>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* User Info - Desktop */}
            <div className="hidden md:block text-right mr-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
              {user?.businessName && (
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.businessName}</p>
              )}
            </div>

            {/* Theme Toggle */}
            <ThemeToggle size="sm" />

            {/* Notifications */}
            <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors relative">
              <Bell className="h-5 w-5" />
              {/* Notification dot */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Settings */}
            <button 
              onClick={() => navigate('/app/settings')}
              className={`p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors ${
                location.pathname.includes('/settings')
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <Settings className="h-5 w-5" />
            </button>

            {/* Profile */}
            <button 
              onClick={() => navigate('/app/profile')}
              className={`p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors ${
                location.pathname.includes('/profile')
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <User className="h-5 w-5" />
            </button>

            {/* Logout */}
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;