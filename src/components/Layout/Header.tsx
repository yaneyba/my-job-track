import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotifications } from '@/hooks/useNotifications';
import ThemeToggle from '@/components/UI/ThemeToggle';
import LanguageToggle from '@/components/UI/LanguageToggle';
import ShareButton from '@/components/UI/ShareButton';
import Logo from '@/components/UI/Logo';
import NotificationAlert from '@/components/UI/NotificationAlert';
import { Bell, User, LogOut, X } from 'lucide-react';

const Header: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { notifications, dismissNotification, clearAllNotifications, markNotificationAsRead } = useNotifications();

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/app' || path === '/app/dashboard') return t('nav.home');
    if (path === '/app/customers') return t('nav.customers');
    if (path === '/app/jobs') return t('nav.jobs');
    if (path === '/app/payments') return t('nav.payments');
    if (path === '/app/scan') return t('nav.scan');
    if (path === '/app/settings') return t('nav.settings');
    if (path === '/app/profile') return t('nav.profile');
    if (path.includes('/customers/')) return t('nav.customers');
    if (path.includes('/jobs/')) return t('nav.jobs');
    if (path.includes('/new')) return t('dashboard.addCustomer');
    return 'MyJobTrack';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotificationAction = () => {
    setShowNotifications(false);
  };

  const handleDismissNotification = (id: string) => {
    dismissNotification(id);
  };

  const handleClearAllNotifications = () => {
    clearAllNotifications();
    setShowNotifications(false);
  };

  const handleNotificationClick = (id: string) => {
    markNotificationAsRead(id);
  };

  return (
    <>
      <header className="bg-white dark:bg-dark-800 shadow-sm border-b border-gray-200 dark:border-dark-700 sticky top-0 z-40 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Logo 
                size="md"
                variant="horizontal"
                theme="colored"
                showTagline={true}
                tagline="Job Tracking"
                clickable={true}
                onClick={() => navigate('/app')}
                className="hidden sm:flex"
              />
              <Logo 
                size="sm"
                variant="icon-only"
                theme="colored"
                clickable={true}
                onClick={() => navigate('/app')}
                className="sm:hidden"
              />
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

              {/* Language Toggle */}
              <LanguageToggle size="sm" />

              {/* Share App - Same as Landing */}
              <ShareButton size="sm" />

              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {/* Notification badge - only show for unread notifications */}
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown - Desktop */}
                {showNotifications && (
                  <div className="hidden sm:block absolute right-0 mt-2 w-96 bg-white dark:bg-dark-800 rounded-xl shadow-2xl border border-gray-200 dark:border-dark-700 z-50 max-h-96 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-700">
                      <div className="flex items-center">
                        <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                        {notifications.length > 0 && (
                          <span className="ml-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium px-2 py-1 rounded-full">
                            {notifications.length}
                          </span>
                        )}
                        {unreadCount > 0 && (
                          <span className="ml-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs font-medium px-2 py-1 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {notifications.length > 1 && (
                          <button
                            onClick={handleClearAllNotifications}
                            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                          >
                            Clear All
                          </button>
                        )}
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Notifications Content */}
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        <div className="p-4">
                          <NotificationAlert
                            notifications={notifications.map(notification => ({
                              ...notification,
                              action: notification.action ? {
                                ...notification.action,
                                onClick: () => {
                                  notification.action?.onClick();
                                  handleNotificationAction();
                                }
                              } : undefined
                            }))}
                            onDismiss={handleDismissNotification}
                            onNotificationClick={handleNotificationClick}
                          />
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-500 dark:text-gray-400 font-medium">No notifications</p>
                          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">You're all caught up!</p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div className="border-t border-gray-200 dark:border-dark-700 p-3">
                        <button
                          onClick={() => {
                            navigate('/app');
                            setShowNotifications(false);
                          }}
                          className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                        >
                          View Dashboard
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

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

      {/* Mobile Notification Panel - Positioned from top */}
      {showNotifications && (
        <div className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start pt-20">
          <div className="w-full mx-4 bg-white dark:bg-dark-800 rounded-2xl max-h-[calc(100vh-120px)] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-700 flex-shrink-0">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                {notifications.length > 0 && (
                  <span className="ml-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium px-2 py-1 rounded-full">
                    {notifications.length}
                  </span>
                )}
                {unreadCount > 0 && (
                  <span className="ml-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs font-medium px-2 py-1 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {notifications.length > 1 && (
                  <button
                    onClick={handleClearAllNotifications}
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors px-2 py-1"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Notifications Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="p-4">
                  <NotificationAlert
                    notifications={notifications.map(notification => ({
                      ...notification,
                      action: notification.action ? {
                        ...notification.action,
                        onClick: () => {
                          notification.action?.onClick();
                          handleNotificationAction();
                        }
                      } : undefined
                    }))}
                    onDismiss={handleDismissNotification}
                    onNotificationClick={handleNotificationClick}
                  />
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No notifications</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">You're all caught up!</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-gray-200 dark:border-dark-700 p-4 flex-shrink-0">
                <button
                  onClick={() => {
                    navigate('/app');
                    setShowNotifications(false);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  View Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;