import { useState, useEffect, useCallback } from 'react';
import { DataProviderFactory } from '@/data/providers/DataProviderFactory';
import { NotificationItem } from '@/components/UI/NotificationAlert';
import { isToday, isTomorrow, parseISO, addDays, isBefore } from 'date-fns';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const dataProvider = DataProviderFactory.getInstance();

  const generateNotifications = useCallback(() => {
    const newNotifications: NotificationItem[] = [];
    const customers = dataProvider.getCustomers();
    const jobs = dataProvider.getJobs();
    const now = new Date();

    // Check for overdue unpaid jobs
    const overdueUnpaidJobs = jobs.filter(job => 
      job.paymentStatus === 'unpaid' && 
      job.status === 'completed' &&
      isBefore(parseISO(job.scheduledDate), addDays(now, -7))
    );

    if (overdueUnpaidJobs.length > 0) {
      const totalOverdue = overdueUnpaidJobs.reduce((sum, job) => sum + job.price, 0);
      newNotifications.push({
        id: 'overdue-payments',
        type: 'urgent',
        title: 'Overdue Payments',
        message: `You have ${overdueUnpaidJobs.length} overdue payment${overdueUnpaidJobs.length > 1 ? 's' : ''} totaling $${totalOverdue.toFixed(2)}. Follow up with customers to collect payment.`,
        action: {
          label: 'View Payments',
          onClick: () => {
            // Dismiss this notification when action is clicked
            dismissNotification('overdue-payments');
            window.location.href = '/app/payments';
          }
        },
        timestamp: now,
        dismissible: true
      });
    }

    // Check for today's jobs
    const todaysJobs = jobs.filter(job => isToday(parseISO(job.scheduledDate)));
    const scheduledTodayJobs = todaysJobs.filter(job => job.status === 'scheduled');

    if (scheduledTodayJobs.length > 0) {
      newNotifications.push({
        id: 'todays-jobs',
        type: 'info',
        title: `${scheduledTodayJobs.length} Job${scheduledTodayJobs.length > 1 ? 's' : ''} Scheduled Today`,
        message: `You have ${scheduledTodayJobs.length} job${scheduledTodayJobs.length > 1 ? 's' : ''} scheduled for today. Make sure you're prepared and have all necessary equipment.`,
        action: {
          label: 'View Today\'s Jobs',
          onClick: () => {
            // Dismiss this notification when action is clicked
            dismissNotification('todays-jobs');
            window.location.href = '/app/jobs';
          }
        },
        timestamp: now,
        dismissible: true
      });
    }

    // Check for tomorrow's jobs
    const tomorrowsJobs = jobs.filter(job => isTomorrow(parseISO(job.scheduledDate)));
    const scheduledTomorrowJobs = tomorrowsJobs.filter(job => job.status === 'scheduled');

    if (scheduledTomorrowJobs.length > 0) {
      newNotifications.push({
        id: 'tomorrows-jobs',
        type: 'info',
        title: `${scheduledTomorrowJobs.length} Job${scheduledTomorrowJobs.length > 1 ? 's' : ''} Tomorrow`,
        message: `Don't forget about your ${scheduledTomorrowJobs.length} job${scheduledTomorrowJobs.length > 1 ? 's' : ''} scheduled for tomorrow. Plan your route and prepare equipment tonight.`,
        action: {
          label: 'View Schedule',
          onClick: () => {
            // Dismiss this notification when action is clicked
            dismissNotification('tomorrows-jobs');
            window.location.href = '/app/jobs';
          }
        },
        timestamp: now,
        dismissible: true
      });
    }

    // Check for large unpaid amounts
    const unpaidJobs = jobs.filter(job => job.paymentStatus === 'unpaid' && job.status === 'completed');
    const totalUnpaid = unpaidJobs.reduce((sum, job) => sum + job.price, 0);

    if (totalUnpaid > 500) {
      newNotifications.push({
        id: 'large-unpaid',
        type: 'warning',
        title: 'Large Outstanding Balance',
        message: `You have $${totalUnpaid.toFixed(2)} in unpaid invoices across ${unpaidJobs.length} completed job${unpaidJobs.length > 1 ? 's' : ''}. Consider following up with customers.`,
        action: {
          label: 'Manage Payments',
          onClick: () => {
            // Dismiss this notification when action is clicked
            dismissNotification('large-unpaid');
            window.location.href = '/app/payments';
          }
        },
        timestamp: now,
        dismissible: true
      });
    }

    // Check for customers with no recent jobs
    const customersWithoutRecentJobs = customers.filter(customer => {
      const customerJobs = jobs.filter(job => job.customerId === customer.id);
      if (customerJobs.length === 0) return false;
      
      const lastJob = customerJobs
        .sort((a, b) => parseISO(b.scheduledDate).getTime() - parseISO(a.scheduledDate).getTime())[0];
      
      return isBefore(parseISO(lastJob.scheduledDate), addDays(now, -30));
    });

    if (customersWithoutRecentJobs.length > 0) {
      newNotifications.push({
        id: 'inactive-customers',
        type: 'info',
        title: 'Inactive Customers',
        message: `${customersWithoutRecentJobs.length} customer${customersWithoutRecentJobs.length > 1 ? 's' : ''} haven't had service in over 30 days. Consider reaching out to schedule maintenance.`,
        action: {
          label: 'View Customers',
          onClick: () => {
            // Dismiss this notification when action is clicked
            dismissNotification('inactive-customers');
            window.location.href = '/app/customers';
          }
        },
        timestamp: now,
        dismissible: true
      });
    }

    // Success notification for recent completions
    const recentCompletedJobs = jobs.filter(job => 
      job.status === 'completed' && 
      job.completedDate &&
      isToday(parseISO(job.completedDate))
    );

    if (recentCompletedJobs.length > 0) {
      const todaysEarnings = recentCompletedJobs.reduce((sum, job) => sum + job.price, 0);
      newNotifications.push({
        id: 'todays-completions',
        type: 'success',
        title: 'Great Work Today!',
        message: `You've completed ${recentCompletedJobs.length} job${recentCompletedJobs.length > 1 ? 's' : ''} today, earning $${todaysEarnings.toFixed(2)}. Keep up the excellent work!`,
        timestamp: now,
        dismissible: true
      });
    }

    setNotifications(newNotifications);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    
    // Store dismissed notifications in localStorage to prevent them from reappearing
    const dismissed = JSON.parse(localStorage.getItem('dismissed_notifications') || '[]');
    const today = new Date().toDateString();
    dismissed.push({ id, date: today });
    localStorage.setItem('dismissed_notifications', JSON.stringify(dismissed));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    
    // Mark all current notifications as dismissed
    const dismissed = JSON.parse(localStorage.getItem('dismissed_notifications') || '[]');
    const today = new Date().toDateString();
    notifications.forEach(notification => {
      dismissed.push({ id: notification.id, date: today });
    });
    localStorage.setItem('dismissed_notifications', JSON.stringify(dismissed));
  }, [notifications]);

  // Function to mark notification as read/clicked without dismissing
  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  useEffect(() => {
    // Filter out notifications that were dismissed today
    const dismissed = JSON.parse(localStorage.getItem('dismissed_notifications') || '[]');
    const today = new Date().toDateString();
    const todaysDismissed = dismissed
      .filter((item: { date: string }) => item.date === today)
      .map((item: { id: string }) => item.id);

    generateNotifications();
    
    setNotifications(prev => 
      prev.filter(notification => !todaysDismissed.includes(notification.id))
    );
  }, [generateNotifications]);

  return {
    notifications,
    dismissNotification,
    clearAllNotifications,
    markNotificationAsRead,
    refreshNotifications: generateNotifications
  };
};