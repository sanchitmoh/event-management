import React, { useEffect, useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { NotificationMessage } from '../services/notification.service';

const NotificationToast: React.FC = () => {
  const { notifications } = useNotifications();
  const [activeNotifications, setActiveNotifications] = useState<(NotificationMessage & { id: string })[]>([]);
  
  // Listen for new notifications
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0];
      
      // Create a unique ID for this notification instance
      const notificationWithId = {
        ...latestNotification,
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      };
      
      setActiveNotifications(prev => [notificationWithId, ...prev]);
      
      // Auto remove after 5 seconds
      setTimeout(() => {
        setActiveNotifications(current => 
          current.filter(n => n.id !== notificationWithId.id)
        );
      }, 5000);
    }
  }, [notifications]);
  
  const removeNotification = (id: string) => {
    setActiveNotifications(current => current.filter(n => n.id !== id));
  };
  
  const getBackgroundColor = (severity: string) => {
    switch (severity) {
      case 'SUCCESS':
        return 'bg-green-500';
      case 'ERROR':
        return 'bg-red-500';
      case 'WARNING':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2">
      {activeNotifications.map(notification => (
        <div 
          key={notification.id}
          className={`max-w-md rounded-lg shadow-lg ${getBackgroundColor(notification.severity)} text-white p-4 transform transition-all duration-300 hover:scale-105`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="font-bold">{notification.type}</p>
              <p>{notification.message}</p>
            </div>
            <button 
              onClick={() => removeNotification(notification.id)}
              className="ml-4 text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast; 