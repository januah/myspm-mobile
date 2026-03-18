/**
 * Notification Redux Slice
 * 
 * Manages all notification state including:
 * - Notification list and lookup
 * - Unread state
 * - Preferences
 * - Summary statistics
 * - Async operations (fetch, update, delete, etc.)
 * - Real-time WebSocket events
 * 
 * Uses Redux Toolkit for modern state management with immer
 */

import { createSlice, createAsyncThunk, createEntityAdapter, type PayloadAction } from '@reduxjs/toolkit';

import type {
  Notification,
  NotificationFilter,
  NotificationPreference,
  NotificationState,
  NotificationSummary,
  NotificationsListResponse,
  BatchNotificationOperation,
} from '../../types/notification';

import { NotificationService } from '../../services/NotificationService';

/**
 * Entity adapter for normalized state
 */
const notificationAdapter = createEntityAdapter<Notification>({
  selectId: (notification) => notification.id,
  sortComparer: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
});

/**
 * Async Thunks
 */

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (filter: NotificationFilter) => {
    return NotificationService.fetchNotifications(filter);
  }
);

export const fetchNotification = createAsyncThunk(
  'notifications/fetchNotification',
  async (notificationId: string) => {
    return NotificationService.fetchNotification(notificationId);
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId: string) => {
    return NotificationService.markAsRead(notificationId);
  }
);

export const markAsUnread = createAsyncThunk(
  'notifications/markAsUnread',
  async (notificationId: string) => {
    return NotificationService.markAsUnread(notificationId);
  }
);

export const archiveNotification = createAsyncThunk(
  'notifications/archiveNotification',
  async (notificationId: string) => {
    return NotificationService.archiveNotification(notificationId);
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId: string) => {
    await NotificationService.deleteNotification(notificationId);
    return notificationId;
  }
);

export const snoozeNotification = createAsyncThunk(
  'notifications/snoozeNotification',
  async ({ notificationId, minutes }: { notificationId: string; minutes: number }) => {
    return NotificationService.snoozeNotification(notificationId, minutes);
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async () => {
    return NotificationService.markAllAsRead();
  }
);

export const batchOperation = createAsyncThunk(
  'notifications/batchOperation',
  async (operation: BatchNotificationOperation) => {
    return NotificationService.batchOperation(operation);
  }
);

export const fetchPreferences = createAsyncThunk(
  'notifications/fetchPreferences',
  async () => {
    return NotificationService.getPreferences();
  }
);

export const updatePreference = createAsyncThunk(
  'notifications/updatePreference',
  async (preference: NotificationPreference) => {
    return NotificationService.updatePreference(preference);
  }
);

export const resetPreferences = createAsyncThunk(
  'notifications/resetPreferences',
  async () => {
    return NotificationService.resetPreferences();
  }
);

/**
 * Initial state
 */
const initialState: NotificationState = {
  byId: {},
  allIds: [],
  unreadIds: [],
  filter: {},
  preferences: {},
  summary: {
    unreadCount: 0,
    byCategory: {
      assignment: 0,
      teacher: 0,
      grade: 0,
      message: 0,
      image_upload: 0,
      system: 0,
      announcement: 0,
      deadline: 0,
      achievement: 0,
    },
    byPriority: {
      low: 0,
      normal: 0,
      high: 0,
      urgent: 0,
    },
    activityChart: [],
    hasUrgent: false,
    hasDueToday: false,
  },
  loading: false,
  error: null,
  lastSyncedAt: undefined,
  isConnected: false,
  pagination: {
    hasMore: true,
    currentOffset: 0,
    limit: 20,
  },
};

/**
 * Notification Slice
 */
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    /**
     * Set filter
     */
    setFilter: (state, action: PayloadAction<NotificationFilter>) => {
      state.filter = action.payload;
    },

    /**
     * Clear filter
     */
    clearFilter: (state) => {
      state.filter = {};
    },

    /**
     * Update pagination
     */
    updatePagination: (
      state,
      action: PayloadAction<{ hasMore: boolean; currentOffset: number; limit: number }>
    ) => {
      state.pagination = action.payload;
    },

    /**
     * Handle WebSocket new notification
     */
    receiveNewNotification: (state, action: PayloadAction<Notification>) => {
      const notification = action.payload;
      state.byId[notification.id] = notification;
      state.allIds.unshift(notification.id);

      if (notification.status === 'unread') {
        state.unreadIds.push(notification.id);
      }

      // Update summary
      state.summary.unreadCount = state.unreadIds.length;
      state.summary.byCategory[notification.category]++;

      if (notification.priority === 'urgent') {
        state.summary.hasUrgent = true;
      }
    },

    /**
     * Handle WebSocket notification updated
     */
    receiveNotificationUpdate: (state, action: PayloadAction<Notification>) => {
      const notification = action.payload;
      const id = notification.id;

      // Update in byId
      state.byId[id] = notification;

      // Update unread list
      if (notification.status === 'unread') {
        if (!state.unreadIds.includes(id)) {
          state.unreadIds.push(id);
        }
      } else {
        state.unreadIds = state.unreadIds.filter((uid) => uid !== id);
      }

      // Update summary
      state.summary.unreadCount = state.unreadIds.length;
    },

    /**
     * Handle WebSocket sync required
     */
    setSyncRequired: (state) => {
      state.error = {
        code: 'SYNC_REQUIRED',
        message: 'Sync required with server',
        timestamp: new Date(),
        retryable: true,
      };
    },

    /**
     * Set connection status
     */
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },

    /**
     * Clear error
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Reset state
     */
    resetNotificationState: () => initialState,
  },

  extraReducers: (builder) => {
    // Fetch notifications
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchNotifications.fulfilled,
        (state, action: PayloadAction<NotificationsListResponse>) => {
          const { notifications, summary, pagination } = action.payload;

          // Clear previous state
          state.byId = {};
          state.allIds = [];
          state.unreadIds = [];

          // Add new notifications
          notifications.forEach((notification) => {
            state.byId[notification.id] = notification;
            state.allIds.push(notification.id);

            if (notification.status === 'unread') {
              state.unreadIds.push(notification.id);
            }
          });

          state.summary = summary;
          state.pagination = {
            hasMore: pagination.hasMore,
            currentOffset: pagination.offset,
            limit: pagination.limit,
          };
          state.loading = false;
          state.lastSyncedAt = new Date();
        }
      )
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = {
          code: 'FETCH_FAILED',
          message: action.error.message || 'Failed to fetch notifications',
          timestamp: new Date(),
          retryable: true,
        };
      });

    // Fetch single notification
    builder
      .addCase(fetchNotification.fulfilled, (state, action: PayloadAction<Notification>) => {
        const notification = action.payload;
        state.byId[notification.id] = notification;

        if (!state.allIds.includes(notification.id)) {
          state.allIds.unshift(notification.id);
        }
      })
      .addCase(fetchNotification.rejected, (state, action) => {
        state.error = {
          code: 'FETCH_FAILED',
          message: action.error.message || 'Failed to fetch notification',
          timestamp: new Date(),
          retryable: true,
        };
      });

    // Mark as read
    builder
      .addCase(markAsRead.fulfilled, (state, action: PayloadAction<Notification>) => {
        const notification = action.payload;
        state.byId[notification.id] = notification;
        state.unreadIds = state.unreadIds.filter((id) => id !== notification.id);
        state.summary.unreadCount = state.unreadIds.length;
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.error = {
          code: 'UPDATE_FAILED',
          message: action.error.message || 'Failed to mark notification as read',
          timestamp: new Date(),
          retryable: true,
        };
      });

    // Mark as unread
    builder
      .addCase(markAsUnread.fulfilled, (state, action: PayloadAction<Notification>) => {
        const notification = action.payload;
        state.byId[notification.id] = notification;

        if (!state.unreadIds.includes(notification.id)) {
          state.unreadIds.push(notification.id);
        }

        state.summary.unreadCount = state.unreadIds.length;
      })
      .addCase(markAsUnread.rejected, (state, action) => {
        state.error = {
          code: 'UPDATE_FAILED',
          message: action.error.message || 'Failed to mark notification as unread',
          timestamp: new Date(),
          retryable: true,
        };
      });

    // Archive notification
    builder
      .addCase(archiveNotification.fulfilled, (state, action: PayloadAction<Notification>) => {
        const notification = action.payload;
        state.byId[notification.id] = notification;
      })
      .addCase(archiveNotification.rejected, (state, action) => {
        state.error = {
          code: 'UPDATE_FAILED',
          message: action.error.message || 'Failed to archive notification',
          timestamp: new Date(),
          retryable: true,
        };
      });

    // Delete notification
    builder
      .addCase(deleteNotification.fulfilled, (state, action: PayloadAction<string>) => {
        const notificationId = action.payload;
        delete state.byId[notificationId];
        state.allIds = state.allIds.filter((id) => id !== notificationId);
        state.unreadIds = state.unreadIds.filter((id) => id !== notificationId);
        state.summary.unreadCount = state.unreadIds.length;
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.error = {
          code: 'DELETE_FAILED',
          message: action.error.message || 'Failed to delete notification',
          timestamp: new Date(),
          retryable: true,
        };
      });

    // Snooze notification
    builder
      .addCase(
        snoozeNotification.fulfilled,
        (state, action: PayloadAction<Notification>) => {
          const notification = action.payload;
          state.byId[notification.id] = notification;
        }
      )
      .addCase(snoozeNotification.rejected, (state, action) => {
        state.error = {
          code: 'UPDATE_FAILED',
          message: action.error.message || 'Failed to snooze notification',
          timestamp: new Date(),
          retryable: true,
        };
      });

    // Mark all as read
    builder
      .addCase(markAllAsRead.fulfilled, (state, action: PayloadAction<NotificationSummary>) => {
        state.unreadIds = [];
        state.summary = action.payload;

        // Update all notifications to read
        state.allIds.forEach((id) => {
          if (state.byId[id]) {
            state.byId[id].status = 'read';
          }
        });
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.error = {
          code: 'UPDATE_FAILED',
          message: action.error.message || 'Failed to mark all as read',
          timestamp: new Date(),
          retryable: true,
        };
      });

    // Batch operation
    builder
      .addCase(
        batchOperation.fulfilled,
        (state, action: PayloadAction<NotificationSummary>) => {
          state.summary = action.payload;
        }
      )
      .addCase(batchOperation.rejected, (state, action) => {
        state.error = {
          code: 'BATCH_OPERATION_FAILED',
          message: action.error.message || 'Batch operation failed',
          timestamp: new Date(),
          retryable: true,
        };
      });

    // Fetch preferences
    builder
      .addCase(
        fetchPreferences.fulfilled,
        (state, action: PayloadAction<NotificationPreference[]>) => {
          const preferences = action.payload;
          state.preferences = {};
          preferences.forEach((pref) => {
            state.preferences[pref.target] = pref;
          });
        }
      )
      .addCase(fetchPreferences.rejected, (state, action) => {
        state.error = {
          code: 'FETCH_FAILED',
          message: action.error.message || 'Failed to fetch preferences',
          timestamp: new Date(),
          retryable: true,
        };
      });

    // Update preference
    builder
      .addCase(
        updatePreference.fulfilled,
        (state, action: PayloadAction<NotificationPreference>) => {
          const preference = action.payload;
          state.preferences[preference.target] = preference;
        }
      )
      .addCase(updatePreference.rejected, (state, action) => {
        state.error = {
          code: 'UPDATE_FAILED',
          message: action.error.message || 'Failed to update preference',
          timestamp: new Date(),
          retryable: true,
        };
      });

    // Reset preferences
    builder
      .addCase(
        resetPreferences.fulfilled,
        (state, action: PayloadAction<NotificationPreference[]>) => {
          const preferences = action.payload;
          state.preferences = {};
          preferences.forEach((pref) => {
            state.preferences[pref.target] = pref;
          });
        }
      )
      .addCase(resetPreferences.rejected, (state, action) => {
        state.error = {
          code: 'UPDATE_FAILED',
          message: action.error.message || 'Failed to reset preferences',
          timestamp: new Date(),
          retryable: true,
        };
      });
  },
});

export const {
  setFilter,
  clearFilter,
  updatePagination,
  receiveNewNotification,
  receiveNotificationUpdate,
  setSyncRequired,
  setConnectionStatus,
  clearError,
  resetNotificationState,
} = notificationSlice.actions;

export default notificationSlice.reducer;

/**
 * Selectors
 */

export const selectAllNotifications = (state: { notifications: NotificationState }) =>
  state.notifications.allIds.map((id) => state.notifications.byId[id]);

export const selectUnreadCount = (state: { notifications: NotificationState }) =>
  state.notifications.unreadIds.length;

export const selectNotificationById = (id: string) => (state: { notifications: NotificationState }) =>
  state.notifications.byId[id];

export const selectUnreadNotifications = (state: { notifications: NotificationState }) =>
  state.notifications.unreadIds.map((id) => state.notifications.byId[id]);

export const selectNotificationSummary = (state: { notifications: NotificationState }) =>
  state.notifications.summary;

export const selectNotificationPreferences = (state: { notifications: NotificationState }) =>
  state.notifications.preferences;

export const selectNotificationLoading = (state: { notifications: NotificationState }) =>
  state.notifications.loading;

export const selectNotificationError = (state: { notifications: NotificationState }) =>
  state.notifications.error;

export const selectIsConnected = (state: { notifications: NotificationState }) =>
  state.notifications.isConnected;

export const selectPagination = (state: { notifications: NotificationState }) =>
  state.notifications.pagination;
