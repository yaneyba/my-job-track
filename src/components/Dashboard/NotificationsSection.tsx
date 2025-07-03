import React from 'react';
import { Bell, BellOff } from 'lucide-react';
import NotificationAlert, { NotificationItem } from '@/components/UI/NotificationAlert';
import { useLanguage } from '@/contexts/LanguageContext';

interface NotificationsSectionProps {
  notifications: NotificationItem[];
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationsSection: React.FC<NotificationsSectionProps> = ({
  notifications,
  showNotifications,
  setShowNotifications,
  dismissNotification,
  clearAllNotifications
}) => {
  const { t } = useLanguage();

  if (notifications.length === 0 || !showNotifications) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 transition-colors duration-200" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-200">
            {t('dashboard.notifications')}
          </h2>
          <span className="ml-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium px-2 py-1 rounded-full transition-colors duration-200">
            {notifications.length}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowNotifications(false)}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors duration-200"
            title="Hide notifications"
          >
            <BellOff className="h-4 w-4" />
          </button>
          {notifications.length > 1 && (
            <button
              onClick={clearAllNotifications}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
      
      <NotificationAlert
        notifications={notifications}
        onDismiss={dismissNotification}
      />
    </div>
  );
};

export default NotificationsSection;
