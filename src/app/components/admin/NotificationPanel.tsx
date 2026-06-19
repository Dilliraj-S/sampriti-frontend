"use client";

import {
  Bell,
  Check,
  CheckCheck,
  X,
  Clock,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { notificationStore, Notification } from "@/lib/notificationStore";
import "./NotificationPanel.css";

export function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>(notificationStore.getNotifications());
  const [isLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = notificationStore.subscribe(() => {
      setNotifications([...notificationStore.getNotifications()]);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const handleMarkAsRead = (id: string) => {
    setIsMarking(true);
    notificationStore.markAsRead(id);
    setIsMarking(false);
  };

  const handleMarkAllAsRead = () => {
    setIsMarking(true);
    notificationStore.markAllAsRead();
    setIsMarking(false);
  };

  const handleClearAll = () => {
    setIsMarking(true);
    notificationStore.dismissAll();
    setIsMarking(false);
  };

  const handleDismiss = (id: string) => {
    notificationStore.dismissNotification(id);
  };

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case "success":
        return "✓";
      case "warning":
        return "⚠";
      case "error":
        return "✕";
      default:
        return "ℹ";
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "critical":
        return "#ef4444";
      case "high":
        return "#f59e0b";
      case "medium":
        return "#3b82f6";
      default:
        return "#6b7280";
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div ref={panelRef} className="notification-panel">
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="notification-bell"
        title={`${unreadCount} unread notifications`}
      >
        <Bell size={18} className="notification-icon" />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="notification-dropdown">
          {/* Header */}
          <div className="notification-header">
            <h3>Notifications</h3>
            <div className="notification-header-actions">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={isMarking}
                  className="mark-all-btn"
                  title="Mark all as read"
                >
                  <CheckCheck size={14} />
                  Mark read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  disabled={isMarking}
                  className="clear-all-btn"
                  title="Clear all notifications"
                >
                  <X size={14} />
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="notification-list">
            {isLoading ? (
              <div className="notification-empty">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <Bell size={24} className="empty-icon" />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`notification-item ${
                    notif.status === "unread" ? "unread" : ""
                  }`}
                >
                  {/* Left Icon */}
                  <div
                    className="notification-type-icon"
                    style={{
                      background: getPriorityColor(notif.priority),
                    }}
                  >
                    {getNotificationIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div className="notification-content">
                    {notif.title && (
                      <div className="notification-title">{notif.title}</div>
                    )}
                    <div className="notification-message">{notif.message}</div>
                    <div className="notification-time">
                      <Clock size={12} />
                      {formatTime(notif.created_at)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="notification-actions">
                    {notif.status === "unread" && (
                      <button
                        onClick={() => handleMarkAsRead(notif.id)}
                        disabled={isMarking}
                        className="action-btn read-btn"
                        title="Mark as read"
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDismiss(notif.id)}
                      className="action-btn dismiss-btn"
                      title="Dismiss"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="notification-footer">
              {unreadCount > 0 ? `${unreadCount} unread` : "All notifications read"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
