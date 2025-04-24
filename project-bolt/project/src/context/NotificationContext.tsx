import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import notificationService, { NotificationMessage } from '../services/notification.service';
import { useAuth } from './AuthContext';

interface ExtendedNotificationMessage extends NotificationMessage {
  id?: string;
  read?: boolean;
}

interface NotificationContextType {
  notifications: ExtendedNotificationMessage[];
  unreadCount: number;
  showNotification: (notification: ExtendedNotificationMessage) => void;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<ExtendedNotificationMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Fetch and update notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const fetched = await notificationService.getNotifications();
      setNotifications(fetched);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const unread = await notificationService.getUnreadNotifications();
      setUnreadCount(unread.length);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }, []);

  const showNotification = useCallback((notification: ExtendedNotificationMessage) => {
    setNotifications(prev => [notification, ...prev]);
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      fetchUnreadCount();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, [fetchUnreadCount]);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }, []);

  // Effect: WebSocket and initial data
  useEffect(() => {
    if (!isAuthenticated) {
      notificationService.disconnect();
      return;
    }

    notificationService.connect()
      .then(() => {
        fetchNotifications();
        fetchUnreadCount();
      })
      .catch(error => console.error('Failed to connect to notification service:', error));

    const unsubscribe = notificationService.onMessage(newNotification => {
      showNotification(newNotification);
      fetchUnreadCount();
    });

    return () => {
      unsubscribe();
      notificationService.disconnect();
    };
  }, [isAuthenticated, fetchNotifications, fetchUnreadCount, showNotification]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      showNotification,
      markAsRead,
      markAllAsRead
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
