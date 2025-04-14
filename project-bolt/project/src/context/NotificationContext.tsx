import React, { createContext, useContext, useEffect, useState } from 'react';
import notificationService, { NotificationMessage } from '../services/notification.service';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: NotificationMessage[];
  unreadCount: number;
  showNotification: (notification: NotificationMessage) => void;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  
  // Connect to WebSocket when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      notificationService.connect()
        .catch(error => console.error('Failed to connect to notification service:', error));
      
      // Fetch initial notifications
      fetchNotifications();
      
      // Subscribe to new notifications
      const unsubscribe = notificationService.onMessage(newNotification => {
        showNotification(newNotification);
        fetchUnreadCount();
      });
      
      return () => {
        unsubscribe();
        notificationService.disconnect();
      };
    }
  }, [isAuthenticated]);
  
  const fetchNotifications = async () => {
    try {
      const notifications = await notificationService.getNotifications();
      setNotifications(notifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };
  
  const fetchUnreadCount = async () => {
    try {
      const unreadNotifications = await notificationService.getUnreadNotifications();
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };
  
  const showNotification = (notification: NotificationMessage) => {
    setNotifications(prev => [notification, ...prev]);
  };
  
  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.data === notificationId ? { ...notif, read: true } : notif
        )
      );
      await fetchUnreadCount();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };
  
  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };
  
  const value = {
    notifications,
    unreadCount,
    showNotification,
    markAsRead,
    markAllAsRead
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 