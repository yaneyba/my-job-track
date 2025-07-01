import React from 'react';
import { 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  X,
  Bell,
  Users,
  TrendingUp
} from 'lucide-react';

export interface NotificationItem {
  id: string;
  type: 'warning' | 'info' | 'success' | 'urgent';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  timestamp: Date;
  dismissible?: boolean;
  read?: boolean;
}

interface NotificationAlertProps {
  notifications: NotificationItem[];
  onDismiss?: (id: string) => void;
  onNotificationClick?: (id: string) => void;
  className?: string;
}

const NotificationAlert: React.FC<NotificationAlertProps> = ({
  notifications,
  onDismiss,
  onNotificationClick,
  className = ''
}) => {
  if (notifications.length === 0) return null;

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'warning':
        return AlertTriangle;
      case 'urgent':
        return Clock;
      case 'success':
        return CheckCircle;
      case 'info':
      default:
        return Bell;
    }
  };

  const getNotificationStyles = (type: NotificationItem['type']) => {
    switch (type) {
      case 'warning':
        return {
          container: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
          icon: 'text-orange-600 dark:text-orange-400',
          title: 'text-orange-900 dark:text-orange-100',
          message: 'text-orange-800 dark:text-orange-200',
          action: 'bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white'
        };
      case 'urgent':
        return {
          container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
          icon: 'text-red-600 dark:text-red-400',
          title: 'text-red-900 dark:text-red-100',
          message: 'text-red-800 dark:text-red-200',
          action: 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white'
        };
      case 'success':
        return {
          container: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
          icon: 'text-green-600 dark:text-green-400',
          title: 'text-green-900 dark:text-green-100',
          message: 'text-green-800 dark:text-green-200',
          action: 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white'
        };
      case 'info':
      default:
        return {
          container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
          icon: 'text-blue-600 dark:text-blue-400',
          title: 'text-blue-900 dark:text-blue-100',
          message: 'text-blue-800 dark:text-blue-200',
          action: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white'
        };
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    // Mark as read when clicked
    if (onNotificationClick) {
      onNotificationClick(notification.id);
    }
    
    // If there's an action, execute it
    if (notification.action) {
      notification.action.onClick();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {notifications.map((notification) => {
        const Icon = getNotificationIcon(notification.type);
        const styles = getNotificationStyles(notification.type);

        return (
          <div
            key={notification.id}
            className={`border rounded-xl p-4 transition-all duration-200 ${styles.container} ${
              notification.action ? 'cursor-pointer hover:shadow-md' : ''
            } ${notification.read ? 'opacity-75' : ''}`}
            onClick={() => notification.action && handleNotificationClick(notification)}
          >
            <div className="flex items-start">
              <div className={`flex-shrink-0 ${styles.icon} mr-3 mt-0.5`}>
                <Icon className="h-5 w-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold ${styles.title} transition-colors duration-200 ${
                      notification.read ? 'opacity-75' : ''
                    }`}>
                      {notification.title}
                      {!notification.read && (
                        <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                      )}
                    </h4>
                    <p className={`mt-1 text-sm ${styles.message} transition-colors duration-200 leading-relaxed ${
                      notification.read ? 'opacity-75' : ''
                    }`}>
                      {notification.message}
                    </p>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      {formatTimeAgo(notification.timestamp)}
                    </p>
                  </div>
                  
                  {notification.dismissible && onDismiss && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDismiss(notification.id);
                      }}
                      className={`ml-4 ${styles.icon} hover:opacity-70 transition-opacity flex-shrink-0`}
                      aria-label="Dismiss notification"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                {notification.action && (
                  <div className="mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNotificationClick(notification);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${styles.action}`}
                    >
                      {notification.action.label}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationAlert;