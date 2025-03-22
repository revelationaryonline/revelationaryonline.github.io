import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

// Define the notification interface
export interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  type: 'study' | 'system' | 'reminder';
  link?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const auth = getAuth();

  // Load notifications from localStorage on mount
  useEffect(() => {
    const loadNotifications = () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const savedNotifications = localStorage.getItem(`notifications_${userId}`);
      if (savedNotifications) {
        try {
          const parsedNotifications = JSON.parse(savedNotifications);
          // Convert date strings back to Date objects
          setNotifications(
            parsedNotifications.map((notification: any) => ({
              ...notification,
              date: new Date(notification.date)
            }))
          );
        } catch (error) {
          console.error('Failed to parse notifications:', error);
        }
      }
    };

    loadNotifications();
    // Listen for auth state changes to load user-specific notifications
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        loadNotifications();
      } else {
        setNotifications([]);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (userId && notifications.length > 0) {
      localStorage.setItem(`notifications_${userId}`, JSON.stringify(notifications));
    }
  }, [notifications, auth]);

  // Add a new notification
  const addNotification = (notification: Omit<Notification, 'id' | 'date' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      date: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Delete a notification
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  // Calculate unread count
  const unreadCount = notifications.filter(notification => !notification.read).length;

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
