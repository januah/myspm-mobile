/**
 * Notification Types
 * 
 * Comprehensive type definitions for the notification system including:
 * - Notification categories and types
 * - Priority levels and action types
 * - Notification state and preferences
 * - Delivery and subscription management
 * 
 * This module provides 100% TypeScript type safety for all notification operations
 */

/**
 * Notification Categories
 * Broad categorization for notification types
 */
export type NotificationCategory =
  | 'assignment'
  | 'teacher'
  | 'grade'
  | 'message'
  | 'image_upload'
  | 'system'
  | 'announcement'
  | 'deadline'
  | 'achievement';

/**
 * Notification Action Types
 * Specific actions that trigger notifications
 */
export type NotificationActionType =
  | 'assignment_created'
  | 'assignment_updated'
  | 'assignment_due_soon'
  | 'assignment_submitted'
  | 'assignment_graded'
  | 'assignment_feedback'
  | 'teacher_linked'
  | 'teacher_unlinked'
  | 'teacher_message'
  | 'grade_posted'
  | 'message_received'
  | 'image_uploaded'
  | 'image_processing_complete'
  | 'image_processing_failed'
  | 'system_maintenance'
  | 'announcement_posted'
  | 'achievement_unlocked'
  | 'deadline_approaching';

/**
 * Notification Priority Levels
 * Used for sorting and notification urgency
 */
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

/**
 * Notification Status
 * Tracks the state of a notification
 */
export type NotificationStatus =
  | 'unread'
  | 'read'
  | 'archived'
  | 'dismissed'
  | 'snoozed';

/**
 * Notification Delivery Methods
 * How the notification is delivered to the user
 */
export type DeliveryMethod =
  | 'in_app'
  | 'push'
  | 'email'
  | 'sms'
  | 'none';

/**
 * Core Notification Interface
 * Represents a single notification in the system
 */
export interface Notification {
  /** Unique identifier for the notification */
  id: string;

  /** User who receives the notification */
  userId: string;

  /** Category of the notification */
  category: NotificationCategory;

  /** Specific action type */
  actionType: NotificationActionType;

  /** Notification title */
  title: string;

  /** Detailed message content */
  message: string;

  /** Optional short summary for lists */
  summary?: string;

  /** Priority level */
  priority: NotificationPriority;

  /** Current status */
  status: NotificationStatus;

  /** Timestamp when notification was created */
  createdAt: Date;

  /** Timestamp when notification was read (null if unread) */
  readAt?: Date;

  /** Data payload for the notification */
  data: NotificationData;

  /** Entity that triggered the notification */
  source: NotificationSource;

  /** Optional action button configuration */
  actions?: NotificationAction[];

  /** Related entity IDs for context */
  relatedIds: {
    /** Teacher ID if related to a teacher */
    teacherId?: string;

    /** Assignment ID if related to an assignment */
    assignmentId?: string;

    /** Student/receiver ID if from another student */
    fromUserId?: string;

    /** Image ID if related to image upload */
    imageId?: string;

    /** Grade ID if related to grading */
    gradeId?: string;

    /** Message ID if related to messaging */
    messageId?: string;
  };

  /** How the notification was delivered */
  deliveredVia: DeliveryMethod[];

  /** Expiration date for the notification */
  expiresAt?: Date;

  /** Optional snooze until timestamp */
  snoozedUntil?: Date;

  /** Whether this notification has been actioned */
  isActioned: boolean;

  /** Read-only metadata */
  metadata: NotificationMetadata;
}

/**
 * Notification Data Payload
 * Type-safe payload structure for different notification types
 */
export interface NotificationData {
  /** Type-specific data fields */
  [key: string]: unknown;

  /** Assignment details if applicable */
  assignment?: {
    id: string;
    title: string;
    dueDate?: Date;
    subject?: string;
  };

  /** Teacher details if applicable */
  teacher?: {
    id: string;
    name: string;
    role: 'instructor' | 'assistant' | 'tutor';
  };

  /** Grade details if applicable */
  grade?: {
    score: number;
    maxScore: number;
    percentage: number;
    feedback?: string;
  };

  /** Image details if applicable */
  image?: {
    id: string;
    url: string;
    type: string;
  };

  /** Custom action data */
  actionData?: Record<string, unknown>;
}

/**
 * Notification Source
 * Information about what triggered the notification
 */
export interface NotificationSource {
  /** Source type */
  type: 'teacher' | 'assignment' | 'system' | 'peer' | 'grade';

  /** Source entity ID */
  entityId: string;

  /** Display name of the source */
  displayName: string;

  /** Optional icon/avatar URL */
  avatarUrl?: string;

  /** Source timestamp */
  timestamp: Date;
}

/**
 * Notification Action
 * Call-to-action button in a notification
 */
export interface NotificationAction {
  /** Unique action identifier */
  id: string;

  /** Display label for the action button */
  label: string;

  /** Action type for routing/handling */
  actionType: 'navigate' | 'open_assignment' | 'view_grade' | 'reply' | 'custom';

  /** Destination or custom action data */
  payload?: {
    route?: string;
    assignmentId?: string;
    gradeId?: string;
    [key: string]: unknown;
  };

  /** Visual style */
  style?: 'primary' | 'secondary' | 'destructive';

  /** Whether this action requires authentication */
  requiresAuth?: boolean;
}

/**
 * Notification Metadata
 * Read-only computed metadata
 */
export interface NotificationMetadata {
  /** How long ago the notification was created (human readable) */
  timeAgo: string;

  /** Total time spent unread (milliseconds) */
  unreadDuration?: number;

  /** Number of times the notification was snoozed */
  snoozedCount: number;

  /** Whether notification contains important information */
  isImportant: boolean;

  /** Grouped notification ID if part of a group */
  groupedWith?: string;

  /** Notification version for backward compatibility */
  version: number;
}

/**
 * Notification Preference
 * User's notification settings per category/type
 */
export interface NotificationPreference {
  /** Preference ID */
  id: string;

  /** User ID */
  userId: string;

  /** Category or specific action type */
  target: NotificationCategory | NotificationActionType;

  /** Whether notifications are enabled */
  enabled: boolean;

  /** Preferred delivery methods */
  deliveryMethods: DeliveryMethod[];

  /** Time window for quiet hours */
  quietHours?: {
    enabled: boolean;
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
  };

  /** Priority threshold (don't send if below this) */
  minPriority?: NotificationPriority;

  /** Whether to group similar notifications */
  groupSimilar: boolean;

  /** Update timestamp */
  updatedAt: Date;
}

/**
 * Notification Filter Options
 * Used for querying and filtering notifications
 */
export interface NotificationFilter {
  /** Filter by category */
  categories?: NotificationCategory[];

  /** Filter by action types */
  actionTypes?: NotificationActionType[];

  /** Filter by status */
  statuses?: NotificationStatus[];

  /** Filter by priority */
  minPriority?: NotificationPriority;

  /** Filter by date range */
  dateRange?: {
    from: Date;
    to: Date;
  };

  /** Filter by source type */
  sourceTypes?: ('teacher' | 'assignment' | 'system' | 'peer' | 'grade')[];

  /** Search in title and message */
  searchText?: string;

  /** Filter by teacher ID */
  teacherId?: string;

  /** Filter by assignment ID */
  assignmentId?: string;

  /** Exclude archived notifications */
  excludeArchived?: boolean;

  /** Pagination */
  limit?: number;
  offset?: number;
}

/**
 * Notification Summary
 * Aggregated notification statistics
 */
export interface NotificationSummary {
  /** Total unread count */
  unreadCount: number;

  /** Count by category */
  byCategory: Record<NotificationCategory, number>;

  /** Count by priority */
  byPriority: Record<NotificationPriority, number>;

  /** Most recent unread notification */
  mostRecent?: Notification;

  /** Notification count by hour (last 24h) */
  activityChart: Array<{
    hour: number;
    count: number;
  }>;

  /** Whether user has urgent notifications */
  hasUrgent: boolean;

  /** Whether user has notifications due today */
  hasDueToday: boolean;
}

/**
 * Notification State
 * Redux state shape for notifications
 */
export interface NotificationState {
  /** All notifications indexed by ID */
  byId: Record<string, Notification>;

  /** Notification IDs sorted by date (newest first) */
  allIds: string[];

  /** Unread notification IDs */
  unreadIds: string[];

  /** Currently applied filter */
  filter: NotificationFilter;

  /** User preferences */
  preferences: Record<string, NotificationPreference>;

  /** Summary statistics */
  summary: NotificationSummary;

  /** Loading state */
  loading: boolean;

  /** Current error if any */
  error: NotificationError | null;

  /** Last sync timestamp */
  lastSyncedAt?: Date;

  /** WebSocket connection status */
  isConnected: boolean;

  /** Pagination state */
  pagination: {
    hasMore: boolean;
    currentOffset: number;
    limit: number;
  };
}

/**
 * Notification Error
 * Error handling for notification operations
 */
export interface NotificationError {
  /** Error code for identification */
  code: string;

  /** User-friendly error message */
  message: string;

  /** Technical details */
  details?: string;

  /** HTTP status code if applicable */
  statusCode?: number;

  /** Timestamp of error */
  timestamp: Date;

  /** Whether the error is retryable */
  retryable: boolean;
}

/**
 * Notification Subscription
 * WebSocket subscription for real-time notifications
 */
export interface NotificationSubscription {
  /** Subscription ID */
  id: string;

  /** User ID */
  userId: string;

  /** Categories to subscribe to */
  categories: NotificationCategory[];

  /** Whether subscription is active */
  isActive: boolean;

  /** Connected timestamp */
  connectedAt: Date;

  /** Optional expiration time */
  expiresAt?: Date;
}

/**
 * Batch Notification Operation
 * For performing bulk operations on notifications
 */
export interface BatchNotificationOperation {
  /** IDs of notifications to operate on */
  notificationIds: string[];

  /** Operation type */
  operation: 'mark_read' | 'archive' | 'delete' | 'snooze';

  /** Operation-specific data */
  data?: {
    snoozeMinutes?: number;
    [key: string]: unknown;
  };
}

/**
 * Notification Statistics
 * Metrics for notification analytics
 */
export interface NotificationStatistics {
  /** Total notifications created */
  totalCreated: number;

  /** Total notifications read */
  totalRead: number;

  /** Average time to read (ms) */
  avgTimeToRead: number;

  /** Click-through rate */
  clickThroughRate: number;

  /** Archive rate */
  archiveRate: number;

  /** Most common category */
  topCategory: NotificationCategory;

  /** Most common action type */
  topActionType: NotificationActionType;

  /** Period covered by stats */
  period: {
    from: Date;
    to: Date;
  };
}

/**
 * Notification Response
 * API response structure
 */
export interface NotificationResponse {
  /** Notification data */
  notification: Notification;

  /** Operation status */
  status: 'success' | 'error' | 'pending';

  /** Message for the user */
  message?: string;

  /** Timestamp of response */
  timestamp: Date;
}

/**
 * Notifications List Response
 * Paginated list of notifications
 */
export interface NotificationsListResponse {
  /** Array of notifications */
  notifications: Notification[];

  /** Summary statistics */
  summary: NotificationSummary;

  /** Pagination info */
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };

  /** Response timestamp */
  timestamp: Date;
}
