/**
 * useNotifications Hook
 * 
 * Custom React hook for managing notifications with Redux integration
 * Provides easy access to:
 * - Fetching notifications with filtering
 * - Marking notifications as read/unread
 * - Archiving and deleting notifications
 * - Snoozing notifications
 * - Managing preferences
 * - Real-time status
 * 
 * Usage:
 * const { notifications, unreadCount, fetchNotifications, markAsRead } = useNotifications();
 */

import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

import {
  fetchNotifications as fetchNotificationsThunk,
  fetchNotification,
  markAsRead as markAsReadThunk,
  markAsUnread as markAsUnreadThunk,
  archiveNotification as archiveNotificationThunk,
  deleteNotification as deleteNotificationThunk,
  snoozeNotification as snoozeNotificationThunk,
  markAllAsRead as markAllAsReadThunk,
  batchOperation as batchOperationThunk,
  fetchPreferences as fetchPreferencesThunk,
  updatePreference as updatePreferenceThunk,
  resetPreferences as resetPreferencesThunk,
  setFilter,
  clearFilter,
  receiveNewNotification,
  receiveNotificationUpdate,
  setConnectionStatus,
  clearError,
} from '../../store/slices/notificationSlice';

import {
  selectAllNotifications,
  selectUnreadCount,
  selectNotificationSummary,
  selectNotificationPreferences,
  selectNotificationLoading,
  selectNotificationError,
  selectIsConnected,
} from '../../store/slices/notificationSlice';

import { NotificationService } from '../../services/NotificationService';

import type {
  Notification,
  NotificationFilter,
  NotificationPreference,
  NotificationError,
  NotificationSummary,
  BatchNotificationOperation,
} from '../../types/notification';

/**
 * Hook return type
 */
export interface UseNotificationsReturn {
  // Data
  notifications: Notification[];
  unreadCount: number;
  summary: NotificationSummary;
  preferences: Record<string, NotificationPreference>;
  loading: boolean;
  error: NotificationError | null;
  isConnected: boolean;

  // Notification operations
  fetchNotifications: (filter?: NotificationFilter) => Promise<void>;
  fetchNotification: (id: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAsUnread: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  archiveNotification: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  snoozeNotification: (id: string, minutes: number) => Promise<void>;
  batchOperation: (operation: BatchNotificationOperation) => Promise<void>;

  // Filter operations
  setFilterFn: (filter: NotificationFilter) => void;
  clearFilterFn: () => void;

  // Preference operations
  fetchPreferences: () => Promise<void>;
  updatePreference: (preference: NotificationPreference) => Promise<void>;
  resetPreferences: () => Promise<void>;

  // Utility
  clearErrorFn: () => void;
  refreshNotifications: () => Promise<void>;
}

/**
 * useNotifications Hook
 */
export function useNotifications(): UseNotificationsReturn {
  const dispatch = useAppDispatch();

  // Select state
  const notifications = useAppSelector(selectAllNotifications);
  const unreadCount = useAppSelector(selectUnreadCount);
  const summary = useAppSelector(selectNotificationSummary);
  const preferences = useAppSelector(selectNotificationPreferences);
  const loading = useAppSelector(selectNotificationLoading);
  const error = useAppSelector(selectNotificationError);
  const isConnected = useAppSelector(selectIsConnected);

  // Setup WebSocket event listeners
  useEffect(() => {
    const handleNewNotification = (event: Event) => {
      const customEvent = event as CustomEvent<Notification>;
      dispatch(receiveNewNotification(customEvent.detail));
    };

    const handleNotificationUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<Notification>;
      dispatch(receiveNotificationUpdate(customEvent.detail));
    };

    const handleConnectionChange = (event: Event) => {
      const customEvent = event as CustomEvent<boolean>;
      dispatch(setConnectionStatus(customEvent.detail));
    };

    window.addEventListener('notification:new', handleNewNotification);
    window.addEventListener('notification:updated', handleNotificationUpdate);
    window.addEventListener('notification:connected', handleConnectionChange);

    return () => {
      window.removeEventListener('notification:new', handleNewNotification);
      window.removeEventListener('notification:updated', handleNotificationUpdate);
      window.removeEventListener('notification:connected', handleConnectionChange);
    };
  }, [dispatch]);

  /**
   * Fetch notifications with optional filter
   */
  const handleFetchNotifications = useCallback(
    async (filter: NotificationFilter = {}) => {
      try {
        await dispatch(fetchNotificationsThunk(filter)).unwrap();
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    },
    [dispatch]
  );

  /**
   * Fetch single notification
   */
  const handleFetchNotification = useCallback(
    async (id: string) => {
      try {
        await dispatch(fetchNotification(id)).unwrap();
      } catch (err) {
        console.error('Failed to fetch notification:', err);
      }
    },
    [dispatch]
  );

  /**
   * Mark as read
   */
  const handleMarkAsRead = useCallback(
    async (id: string) => {
      try {
        await dispatch(markAsReadThunk(id)).unwrap();
      } catch (err) {
        console.error('Failed to mark notification as read:', err);
      }
    },
    [dispatch]
  );

  /**
   * Mark as unread
   */
  const handleMarkAsUnread = useCallback(
    async (id: string) => {
      try {
        await dispatch(markAsUnreadThunk(id)).unwrap();
      } catch (err) {
        console.error('Failed to mark notification as unread:', err);
      }
    },
    [dispatch]
  );

  /**
   * Mark all as read
   */
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await dispatch(markAllAsReadThunk()).unwrap();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  }, [dispatch]);

  /**
   * Archive notification
   */
  const handleArchiveNotification = useCallback(
    async (id: string) => {
      try {
        await dispatch(archiveNotificationThunk(id)).unwrap();
      } catch (err) {
        console.error('Failed to archive notification:', err);
      }
    },
    [dispatch]
  );

  /**
   * Delete notification
   */
  const handleDeleteNotification = useCallback(
    async (id: string) => {
      try {
        await dispatch(deleteNotificationThunk(id)).unwrap();
      } catch (err) {
        console.error('Failed to delete notification:', err);
      }
    },
    [dispatch]
  );

  /**
   * Snooze notification
   */
  const handleSnoozeNotification = useCallback(
    async (id: string, minutes: number) => {
      try {
        await dispatch(snoozeNotificationThunk({ notificationId: id, minutes })).unwrap();
      } catch (err) {
        console.error('Failed to snooze notification:', err);
      }
    },
    [dispatch]
  );

  /**
   * Batch operation
   */
  const handleBatchOperation = useCallback(
    async (operation: BatchNotificationOperation) => {
      try {
        await dispatch(batchOperationThunk(operation)).unwrap();
      } catch (err) {
        console.error('Batch operation failed:', err);
      }
    },
    [dispatch]
  );

  /**
   * Set filter
   */
  const handleSetFilter = useCallback(
    (filter: NotificationFilter) => {
      dispatch(setFilter(filter));
    },
    [dispatch]
  );

  /**
   * Clear filter
   */
  const handleClearFilter = useCallback(() => {
    dispatch(clearFilter());
  }, [dispatch]);

  /**
   * Fetch preferences
   */
  const handleFetchPreferences = useCallback(async () => {
    try {
      await dispatch(fetchPreferencesThunk()).unwrap();
    } catch (err) {
      console.error('Failed to fetch preferences:', err);
    }
  }, [dispatch]);

  /**
   * Update preference
   */
  const handleUpdatePreference = useCallback(
    async (preference: NotificationPreference) => {
      try {
        await dispatch(updatePreferenceThunk(preference)).unwrap();
      } catch (err) {
        console.error('Failed to update preference:', err);
      }
    },
    [dispatch]
  );

  /**
   * Reset preferences
   */
  const handleResetPreferences = useCallback(async () => {
    try {
      await dispatch(resetPreferencesThunk()).unwrap();
    } catch (err) {
      console.error('Failed to reset preferences:', err);
    }
  }, [dispatch]);

  /**
   * Clear error
   */
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  /**
   * Refresh notifications (convenience method)
   */
  const handleRefreshNotifications = useCallback(async () => {
    await handleFetchNotifications();
  }, [handleFetchNotifications]);

  return {
    // Data
    notifications,
    unreadCount,
    summary,
    preferences,
    loading,
    error,
    isConnected,

    // Notification operations
    fetchNotifications: handleFetchNotifications,
    fetchNotification: handleFetchNotification,
    markAsRead: handleMarkAsRead,
    markAsUnread: handleMarkAsUnread,
    markAllAsRead: handleMarkAllAsRead,
    archiveNotification: handleArchiveNotification,
    deleteNotification: handleDeleteNotification,
    snoozeNotification: handleSnoozeNotification,
    batchOperation: handleBatchOperation,

    // Filter operations
    setFilterFn: handleSetFilter,
    clearFilterFn: handleClearFilter,

    // Preference operations
    fetchPreferences: handleFetchPreferences,
    updatePreference: handleUpdatePreference,
    resetPreferences: handleResetPreferences,

    // Utility
    clearErrorFn: handleClearError,
    refreshNotifications: handleRefreshNotifications,
  };
}
