/**
 * Notification Constants
 * 
 * Configuration for the notification system including:
 * - Notification type mappings and defaults
 * - Error messages and codes
 * - Success messages
 * - Timing and retry configuration
 * - Feature flags
 * - Category to color mappings
 */

import type {
  NotificationCategory,
  NotificationActionType,
  NotificationPriority,
  DeliveryMethod,
} from '../types/notification';

/**
 * Notification Type Configuration
 * Maps action types to their metadata
 */
export const NOTIFICATION_TYPE_CONFIG: Record<
  NotificationActionType,
  {
    category: NotificationCategory;
    priority: NotificationPriority;
    defaultDelivery: DeliveryMethod[];
    icon: string;
    color: string;
    requiresAction?: boolean;
  }
> = {
  assignment_created: {
    category: 'assignment',
    priority: 'normal',
    defaultDelivery: ['in_app', 'push'],
    icon: '📋',
    color: '#3B82F6',
    requiresAction: true,
  },
  assignment_updated: {
    category: 'assignment',
    priority: 'normal',
    defaultDelivery: ['in_app', 'push'],
    icon: '📝',
    color: '#3B82F6',
    requiresAction: true,
  },
  assignment_due_soon: {
    category: 'deadline',
    priority: 'high',
    defaultDelivery: ['in_app', 'push', 'email'],
    icon: '⏰',
    color: '#F59E0B',
    requiresAction: true,
  },
  assignment_submitted: {
    category: 'assignment',
    priority: 'normal',
    defaultDelivery: ['in_app'],
    icon: '✅',
    color: '#10B981',
  },
  assignment_graded: {
    category: 'grade',
    priority: 'high',
    defaultDelivery: ['in_app', 'push', 'email'],
    icon: '📊',
    color: '#8B5CF6',
    requiresAction: true,
  },
  assignment_feedback: {
    category: 'grade',
    priority: 'high',
    defaultDelivery: ['in_app', 'push', 'email'],
    icon: '💬',
    color: '#8B5CF6',
    requiresAction: true,
  },
  teacher_linked: {
    category: 'teacher',
    priority: 'high',
    defaultDelivery: ['in_app', 'push'],
    icon: '👨‍🏫',
    color: '#EC4899',
  },
  teacher_unlinked: {
    category: 'teacher',
    priority: 'normal',
    defaultDelivery: ['in_app'],
    icon: '🔗',
    color: '#EC4899',
  },
  teacher_message: {
    category: 'message',
    priority: 'high',
    defaultDelivery: ['in_app', 'push', 'email'],
    icon: '💌',
    color: '#06B6D4',
    requiresAction: true,
  },
  grade_posted: {
    category: 'grade',
    priority: 'high',
    defaultDelivery: ['in_app', 'push', 'email'],
    icon: '📈',
    color: '#8B5CF6',
  },
  message_received: {
    category: 'message',
    priority: 'high',
    defaultDelivery: ['in_app', 'push', 'email'],
    icon: '📨',
    color: '#06B6D4',
    requiresAction: true,
  },
  image_uploaded: {
    category: 'image_upload',
    priority: 'normal',
    defaultDelivery: ['in_app'],
    icon: '🖼️',
    color: '#F97316',
  },
  image_processing_complete: {
    category: 'image_upload',
    priority: 'normal',
    defaultDelivery: ['in_app'],
    icon: '✨',
    color: '#F97316',
  },
  image_processing_failed: {
    category: 'image_upload',
    priority: 'high',
    defaultDelivery: ['in_app', 'push'],
    icon: '❌',
    color: '#EF4444',
    requiresAction: true,
  },
  system_maintenance: {
    category: 'system',
    priority: 'high',
    defaultDelivery: ['in_app', 'email'],
    icon: '🔧',
    color: '#6366F1',
  },
  announcement_posted: {
    category: 'announcement',
    priority: 'normal',
    defaultDelivery: ['in_app', 'push'],
    icon: '📢',
    color: '#6366F1',
  },
  achievement_unlocked: {
    category: 'achievement',
    priority: 'normal',
    defaultDelivery: ['in_app', 'push'],
    icon: '🏆',
    color: '#FBBF24',
  },
  deadline_approaching: {
    category: 'deadline',
    priority: 'urgent',
    defaultDelivery: ['in_app', 'push', 'email'],
    icon: '🚨',
    color: '#EF4444',
    requiresAction: true,
  },
};

/**
 * Category to Color Mapping
 * Used for UI styling
 */
export const NOTIFICATION_CATEGORY_COLORS: Record<NotificationCategory, string> = {
  assignment: '#3B82F6',
  teacher: '#EC4899',
  grade: '#8B5CF6',
  message: '#06B6D4',
  image_upload: '#F97316',
  system: '#6366F1',
  announcement: '#6366F1',
  deadline: '#F59E0B',
  achievement: '#FBBF24',
};

/**
 * Priority Level Configuration
 */
export const NOTIFICATION_PRIORITY_CONFIG: Record<
  NotificationPriority,
  {
    level: number;
    sound: boolean;
    vibrate: boolean;
    icon: string;
    badgeCount: boolean;
  }
> = {
  low: {
    level: 1,
    sound: false,
    vibrate: false,
    icon: '💤',
    badgeCount: false,
  },
  normal: {
    level: 2,
    sound: false,
    vibrate: false,
    icon: '📬',
    badgeCount: true,
  },
  high: {
    level: 3,
    sound: true,
    vibrate: true,
    icon: '📌',
    badgeCount: true,
  },
  urgent: {
    level: 4,
    sound: true,
    vibrate: true,
    icon: '🚨',
    badgeCount: true,
  },
};

/**
 * Error Codes and Messages
 */
export const NOTIFICATION_ERROR_CODES = {
  // Network errors
  NETWORK_ERROR: {
    code: 'NOTIFY_001',
    message: 'Unable to connect to notification service. Please check your connection.',
    retryable: true,
  },
  TIMEOUT: {
    code: 'NOTIFY_002',
    message: 'Request timed out. Please try again.',
    retryable: true,
  },

  // Authentication errors
  UNAUTHORIZED: {
    code: 'NOTIFY_003',
    message: 'You are not authorized to access notifications.',
    retryable: false,
  },
  SESSION_EXPIRED: {
    code: 'NOTIFY_004',
    message: 'Your session has expired. Please log in again.',
    retryable: false,
  },

  // Validation errors
  INVALID_FILTER: {
    code: 'NOTIFY_005',
    message: 'Invalid filter parameters provided.',
    retryable: false,
  },
  INVALID_PREFERENCE: {
    code: 'NOTIFY_006',
    message: 'Invalid notification preference.',
    retryable: false,
  },

  // Data errors
  NOTIFICATION_NOT_FOUND: {
    code: 'NOTIFY_007',
    message: 'Notification not found.',
    retryable: false,
  },
  PREFERENCE_NOT_FOUND: {
    code: 'NOTIFY_008',
    message: 'Notification preference not found.',
    retryable: false,
  },

  // Operation errors
  FETCH_FAILED: {
    code: 'NOTIFY_009',
    message: 'Failed to fetch notifications.',
    retryable: true,
  },
  UPDATE_FAILED: {
    code: 'NOTIFY_010',
    message: 'Failed to update notification.',
    retryable: true,
  },
  DELETE_FAILED: {
    code: 'NOTIFY_011',
    message: 'Failed to delete notification.',
    retryable: true,
  },
  BATCH_OPERATION_FAILED: {
    code: 'NOTIFY_012',
    message: 'Batch operation failed partially or entirely.',
    retryable: true,
  },

  // WebSocket errors
  WS_CONNECTION_FAILED: {
    code: 'NOTIFY_013',
    message: 'Unable to establish real-time connection.',
    retryable: true,
  },
  WS_CONNECTION_LOST: {
    code: 'NOTIFY_014',
    message: 'Real-time connection lost.',
    retryable: true,
  },

  // Server errors
  SERVER_ERROR: {
    code: 'NOTIFY_099',
    message: 'Server error occurred. Please try again later.',
    retryable: true,
  },
} as const;

/**
 * Success Messages
 */
export const NOTIFICATION_SUCCESS_MESSAGES = {
  MARKED_AS_READ: 'Notification marked as read',
  MARKED_ALL_AS_READ: 'All notifications marked as read',
  ARCHIVED: 'Notification archived',
  ARCHIVED_MULTIPLE: 'Notifications archived',
  DELETED: 'Notification deleted',
  DELETED_MULTIPLE: 'Notifications deleted',
  SNOOZED: (minutes: number) => `Notification snoozed for ${minutes} minutes`,
  PREFERENCE_UPDATED: 'Notification preference updated',
  PREFERENCES_UPDATED: 'Notification preferences updated',
  SUBSCRIPTION_CREATED: 'Successfully subscribed to notifications',
  SUBSCRIPTION_REMOVED: 'Successfully unsubscribed from notifications',
} as const;

/**
 * Timing Configuration
 */
export const NOTIFICATION_TIMING = {
  // How long to keep notifications (days)
  RETENTION_DAYS: 30,

  // How long to keep archived notifications (days)
  ARCHIVED_RETENTION_DAYS: 90,

  // Debounce delay for real-time updates (ms)
  DEBOUNCE_DELAY_MS: 500,

  // Snooze options (minutes)
  SNOOZE_OPTIONS: [5, 10, 30, 60, 240] as const,

  // Default snooze time (minutes)
  DEFAULT_SNOOZE_MINUTES: 30,

  // Batch operation delay (ms) - to avoid too many requests
  BATCH_DELAY_MS: 100,

  // WebSocket reconnection intervals (ms)
  WS_RECONNECT_DELAYS: [1000, 2000, 5000, 10000, 30000] as const,

  // Max retry attempts
  MAX_RETRY_ATTEMPTS: 3,

  // Retry delay (ms)
  RETRY_DELAY_MS: 1000,

  // Exponential backoff multiplier
  RETRY_BACKOFF_MULTIPLIER: 2,

  // Quiet hours default (24h format)
  QUIET_HOURS_START: '22:00',
  QUIET_HOURS_END: '08:00',

  // Notification time-to-live in app (ms)
  // After this time, notification will be auto-archived
  NOTIFICATION_TTL_MS: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;

/**
 * Pagination Configuration
 */
export const NOTIFICATION_PAGINATION = {
  // Default items per page
  DEFAULT_LIMIT: 20,

  // Max items per page
  MAX_LIMIT: 100,

  // Min items per page
  MIN_LIMIT: 5,

  // Initial offset
  INITIAL_OFFSET: 0,
} as const;

/**
 * Feature Flags
 */
export const NOTIFICATION_FEATURE_FLAGS = {
  // Enable real-time WebSocket notifications
  ENABLE_REAL_TIME: true,

  // Enable email notifications
  ENABLE_EMAIL: true,

  // Enable SMS notifications
  ENABLE_SMS: false,

  // Enable notification grouping
  ENABLE_GROUPING: true,

  // Enable smart notification batching
  ENABLE_SMART_BATCHING: true,

  // Enable quiet hours
  ENABLE_QUIET_HOURS: true,

  // Enable notification scheduling
  ENABLE_SCHEDULING: false,

  // Enable notification rich templates
  ENABLE_RICH_TEMPLATES: true,

  // Enable notification analytics
  ENABLE_ANALYTICS: true,

  // Enable notification actions
  ENABLE_ACTIONS: true,

  // Enable notification swipe actions
  ENABLE_SWIPE_ACTIONS: true,

  // Enable notification sounds
  ENABLE_SOUNDS: true,

  // Enable notification badges
  ENABLE_BADGES: true,

  // Enable notification previews in lock screen
  ENABLE_LOCK_SCREEN_PREVIEW: false,

  // Enable notification deep linking
  ENABLE_DEEP_LINKING: true,
} as const;

/**
 * Notification Default Preferences
 */
export const NOTIFICATION_DEFAULT_PREFERENCES = {
  assignment: {
    enabled: true,
    deliveryMethods: ['in_app', 'push'] as DeliveryMethod[],
    minPriority: 'low' as NotificationPriority,
    groupSimilar: true,
  },
  teacher: {
    enabled: true,
    deliveryMethods: ['in_app', 'push'] as DeliveryMethod[],
    minPriority: 'normal' as NotificationPriority,
    groupSimilar: false,
  },
  grade: {
    enabled: true,
    deliveryMethods: ['in_app', 'push', 'email'] as DeliveryMethod[],
    minPriority: 'normal' as NotificationPriority,
    groupSimilar: false,
  },
  message: {
    enabled: true,
    deliveryMethods: ['in_app', 'push'] as DeliveryMethod[],
    minPriority: 'normal' as NotificationPriority,
    groupSimilar: true,
  },
  image_upload: {
    enabled: true,
    deliveryMethods: ['in_app'] as DeliveryMethod[],
    minPriority: 'low' as NotificationPriority,
    groupSimilar: true,
  },
  system: {
    enabled: true,
    deliveryMethods: ['in_app', 'email'] as DeliveryMethod[],
    minPriority: 'normal' as NotificationPriority,
    groupSimilar: false,
  },
  announcement: {
    enabled: true,
    deliveryMethods: ['in_app', 'push'] as DeliveryMethod[],
    minPriority: 'low' as NotificationPriority,
    groupSimilar: true,
  },
  deadline: {
    enabled: true,
    deliveryMethods: ['in_app', 'push', 'email'] as DeliveryMethod[],
    minPriority: 'normal' as NotificationPriority,
    groupSimilar: false,
  },
  achievement: {
    enabled: true,
    deliveryMethods: ['in_app', 'push'] as DeliveryMethod[],
    minPriority: 'low' as NotificationPriority,
    groupSimilar: true,
  },
} as const;

/**
 * Notification Urgency Rules
 * Rules to determine if a notification is urgent based on context
 */
export const NOTIFICATION_URGENCY_RULES = {
  // Assign urgent priority if due within N hours
  ASSIGNMENT_DUE_URGENT_HOURS: 2,

  // Assign high priority if due within N hours
  ASSIGNMENT_DUE_HIGH_HOURS: 24,

  // Assignment grade is always high priority
  GRADE_IS_HIGH_PRIORITY: true,

  // Teacher message from instructor is urgent
  TEACHER_MESSAGE_URGENT_FOR_INSTRUCTOR: true,

  // System maintenance is high priority
  SYSTEM_MAINTENANCE_HIGH_PRIORITY: true,

  // Deadline approaching threshold (hours)
  DEADLINE_APPROACHING_HOURS: 24,
} as const;

/**
 * Notification Badge Configuration
 */
export const NOTIFICATION_BADGE_CONFIG = {
  // Show badge for unread count
  SHOW_UNREAD_BADGE: true,

  // Max badge number to display (0 = show number, undefined = show only dot)
  MAX_BADGE_NUMBER: 99,

  // Badge color
  BADGE_COLOR: '#EF4444',

  // Badge text color
  BADGE_TEXT_COLOR: '#FFFFFF',

  // Show animated pulsing effect
  PULSE_ANIMATION: true,

  // Pulse animation duration (ms)
  PULSE_DURATION_MS: 2000,
} as const;

/**
 * Socket.IO Events
 * WebSocket event names for real-time notifications
 */
export const NOTIFICATION_SOCKET_EVENTS = {
  // Client events
  CLIENT: {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    SUBSCRIBE: 'notification:subscribe',
    UNSUBSCRIBE: 'notification:unsubscribe',
    MARK_READ: 'notification:mark_read',
    MARK_UNREAD: 'notification:mark_unread',
    ACKNOWLEDGE: 'notification:acknowledge',
  },

  // Server events
  SERVER: {
    NEW_NOTIFICATION: 'notification:new',
    NOTIFICATION_UPDATED: 'notification:updated',
    NOTIFICATION_DELETED: 'notification:deleted',
    PREFERENCES_CHANGED: 'notification:preferences_changed',
    BATCH_UPDATE: 'notification:batch_update',
    SYNC_REQUIRED: 'notification:sync_required',
  },
} as const;

/**
 * Default Notification Empty States
 */
export const NOTIFICATION_EMPTY_STATES = {
  ALL: {
    icon: '📭',
    title: 'No Notifications',
    description: 'You\'re all caught up! Check back later.',
  },
  UNREAD: {
    icon: '✨',
    title: 'All Read',
    description: 'You\'ve read all your notifications.',
  },
  ARCHIVED: {
    icon: '📦',
    title: 'No Archived Notifications',
    description: 'Archive notifications to keep them organized.',
  },
  FILTERED: {
    icon: '🔍',
    title: 'No Notifications Found',
    description: 'Try adjusting your filters.',
  },
} as const;
