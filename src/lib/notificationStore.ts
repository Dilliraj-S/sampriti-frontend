export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  status: 'unread' | 'read';
}

let notifications: Notification[] = [];
let listeners: (() => void)[] = [];

export const notificationStore = {
  getNotifications: () => notifications,

  addNotification: (n: Notification) => {
    notifications = [n, ...notifications];
    listeners.forEach(fn => fn());
  },

  markAsRead: (id: string) => {
    notifications = notifications.map(n =>
      n.id === id ? { ...n, status: 'read' as const } : n
    );
    listeners.forEach(fn => fn());
  },

  markAllAsRead: () => {
    notifications = notifications.map(n => ({ ...n, status: 'read' as const }));
    listeners.forEach(fn => fn());
  },

  dismissNotification: (id: string) => {
    notifications = notifications.filter(n => n.id !== id);
    listeners.forEach(fn => fn());
  },

  dismissAll: () => {
    notifications = [];
    listeners.forEach(fn => fn());
  },

  subscribe: (fn: () => void) => {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter(l => l !== fn);
    };
  },
};
