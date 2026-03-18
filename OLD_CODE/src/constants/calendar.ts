/**
 * Calendar & Scheduling System - Constants and Configuration
 * Centralized configuration for calendar behavior, colors, and defaults
 */

import type {
  CalendarEventType,
  CalendarViewMode,
  EventPriority,
  TimeSlotDuration,
  CalendarPreferences,
} from '../types/calendar';

/**
 * Event Type Configuration - Maps each event type to display properties
 */
export const CALENDAR_EVENT_TYPE_CONFIG: Record<
  CalendarEventType,
  {
    label: string;
    icon: string;
    color: string;
    category: 'academic' | 'personal' | 'system';
    priority: EventPriority;
    description: string;
  }
> = {
  assignment: {
    label: 'Assignment',
    icon: '📋',
    color: '#3B82F6',
    category: 'academic',
    priority: 'high',
    description: 'Assignment due date',
  },
  deadline: {
    label: 'Deadline',
    icon: '⏰',
    color: '#EF4444',
    category: 'academic',
    priority: 'critical',
    description: 'Project or submission deadline',
  },
  exam: {
    label: 'Exam',
    icon: '📝',
    color: '#F59E0B',
    category: 'academic',
    priority: 'critical',
    description: 'Exam or test',
  },
  class: {
    label: 'Class',
    icon: '👨‍🎓',
    color: '#10B981',
    category: 'academic',
    priority: 'high',
    description: 'Regular class meeting',
  },
  event: {
    label: 'Event',
    icon: '🎉',
    color: '#8B5CF6',
    category: 'personal',
    priority: 'medium',
    description: 'General event',
  },
  holiday: {
    label: 'Holiday',
    icon: '🎄',
    color: '#EC4899',
    category: 'system',
    priority: 'low',
    description: 'School holiday',
  },
  break: {
    label: 'Break',
    icon: '🌴',
    color: '#06B6D4',
    category: 'system',
    priority: 'low',
    description: 'School break or vacation',
  },
  submission: {
    label: 'Submission',
    icon: '📤',
    color: '#6366F1',
    category: 'academic',
    priority: 'high',
    description: 'Assignment submission deadline',
  },
  grade_release: {
    label: 'Grade Released',
    icon: '📊',
    color: '#14B8A6',
    category: 'academic',
    priority: 'medium',
    description: 'Grades released for submission',
  },
  meeting: {
    label: 'Meeting',
    icon: '🤝',
    color: '#F97316',
    category: 'academic',
    priority: 'high',
    description: 'Meeting with teacher or group',
  },
};

/**
 * Event Priority Configuration
 */
export const CALENDAR_PRIORITY_CONFIG: Record<
  EventPriority,
  {
    label: string;
    level: number;
    color: string;
    backgroundColor: string;
    urgency: string;
  }
> = {
  low: {
    label: 'Low',
    level: 1,
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    urgency: 'Can be postponed',
  },
  medium: {
    label: 'Medium',
    level: 2,
    color: '#F59E0B',
    backgroundColor: '#FFFBEB',
    urgency: 'Standard priority',
  },
  high: {
    label: 'High',
    level: 3,
    color: '#EF4444',
    backgroundColor: '#FEE2E2',
    urgency: 'Should not be missed',
  },
  critical: {
    label: 'Critical',
    level: 4,
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
    urgency: 'Must complete on time',
  },
};

/**
 * View Mode Labels and Configurations
 */
export const CALENDAR_VIEW_MODE_CONFIG: Record<
  CalendarViewMode,
  {
    label: string;
    icon: string;
    description: string;
  }
> = {
  month: {
    label: 'Month',
    icon: '📅',
    description: 'View entire month',
  },
  week: {
    label: 'Week',
    icon: '📆',
    description: 'View weekly schedule',
  },
  day: {
    label: 'Day',
    icon: '📍',
    description: 'View single day details',
  },
  agenda: {
    label: 'Agenda',
    icon: '📋',
    description: 'List of upcoming events',
  },
};

/**
 * Time Slot Durations - Common class/meeting lengths
 */
export const CALENDAR_TIME_SLOT_DURATIONS: Record<
  TimeSlotDuration,
  {
    label: string;
    minutes: number;
    hours: number;
  }
> = {
  30: { label: '30 minutes', minutes: 30, hours: 0.5 },
  45: { label: '45 minutes', minutes: 45, hours: 0.75 },
  60: { label: '1 hour', minutes: 60, hours: 1 },
  90: { label: '1.5 hours', minutes: 90, hours: 1.5 },
  120: { label: '2 hours', minutes: 120, hours: 2 },
  180: { label: '3 hours', minutes: 180, hours: 3 },
};

/**
 * Default Calendar Preferences
 */
export const DEFAULT_CALENDAR_PREFERENCES: CalendarPreferences = {
  viewMode: 'month',
  startDayOfWeek: 0, // Sunday
  timeFormat: '12h',
  showWeekends: true,
  showTimeGrid: true,
  defaultEventDuration: 60,
  colorByType: true,
  enableReminders: true,
  defaultReminderTime: 15, // 15 minutes before
  showCourseColors: true,
  compactMode: false,
  highlightToday: true,
  showTwoMonths: false,
  autoCreateNotifications: true,
  allowQuickEventCreation: true,
  groupByType: false,
  timeZone: 'UTC',
};

/**
 * Default Event Reminders - Times to remind user before event
 */
export const CALENDAR_DEFAULT_REMINDERS = {
  exam: [10 * 60, 24 * 60, 7 * 24 * 60], // 10 min, 1 day, 1 week
  deadline: [30 * 60, 3 * 60 * 60, 24 * 60], // 30 min, 3 hours, 1 day
  assignment: [60 * 60, 24 * 60], // 1 hour, 1 day
  class: [10 * 60], // 10 minutes
  meeting: [15 * 60], // 15 minutes
  event: [30 * 60], // 30 minutes
  submission: [60 * 60, 24 * 60], // 1 hour, 1 day
  grade_release: [0], // At time
  holiday: [], // No reminders
  break: [], // No reminders
};

/**
 * Calendar Colors by Event Type (hexadecimal)
 */
export const CALENDAR_CATEGORY_COLORS: Record<string, string> = {
  academic: '#3B82F6',
  personal: '#8B5CF6',
  system: '#64748B',
  assignment: '#3B82F6',
  deadline: '#EF4444',
  exam: '#F59E0B',
  class: '#10B981',
  event: '#8B5CF6',
  holiday: '#EC4899',
  break: '#06B6D4',
  submission: '#6366F1',
  grade_release: '#14B8A6',
  meeting: '#F97316',
};

/**
 * Calendar Time Grid Configuration
 */
export const CALENDAR_TIME_GRID_CONFIG = {
  HOUR_HEIGHT: 60, // Pixels
  MIN_HOUR: 6, // 6 AM
  MAX_HOUR: 22, // 10 PM
  GRID_INTERVAL: 30, // Minutes
  CELL_HEIGHT: 30, // Height per 30-minute slot
};

/**
 * Month/Week/Day Display Names
 */
export const CALENDAR_MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const CALENDAR_DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const CALENDAR_DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Recurrence Frequency Options
 */
export const CALENDAR_RECURRENCE_FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'custom', label: 'Custom' },
];

/**
 * Event Status Labels
 */
export const CALENDAR_EVENT_STATUS: Record<string, string> = {
  scheduled: 'Scheduled',
  confirmed: 'Confirmed',
  tentative: 'Tentative',
  cancelled: 'Cancelled',
  completed: 'Completed',
};

/**
 * Error Codes for Calendar Operations
 */
export const CALENDAR_ERROR_CODES: Record<
  string,
  {
    code: string;
    message: string;
    recoverable: boolean;
    retryable: boolean;
  }
> = {
  FETCH_EVENTS_FAILED: {
    code: 'CAL001',
    message: 'Failed to fetch calendar events',
    recoverable: true,
    retryable: true,
  },
  CREATE_EVENT_FAILED: {
    code: 'CAL002',
    message: 'Failed to create event',
    recoverable: true,
    retryable: true,
  },
  UPDATE_EVENT_FAILED: {
    code: 'CAL003',
    message: 'Failed to update event',
    recoverable: true,
    retryable: true,
  },
  DELETE_EVENT_FAILED: {
    code: 'CAL004',
    message: 'Failed to delete event',
    recoverable: true,
    retryable: true,
  },
  INVALID_EVENT_DATA: {
    code: 'CAL005',
    message: 'Invalid event data provided',
    recoverable: false,
    retryable: false,
  },
  RECURRING_EVENT_CONFLICT: {
    code: 'CAL006',
    message: 'Conflict with recurring event instances',
    recoverable: true,
    retryable: false,
  },
  DATE_PARSE_ERROR: {
    code: 'CAL007',
    message: 'Failed to parse date format',
    recoverable: false,
    retryable: false,
  },
  TIMEZONE_ERROR: {
    code: 'CAL008',
    message: 'Invalid timezone specified',
    recoverable: false,
    retryable: false,
  },
  SYNC_FAILED: {
    code: 'CAL009',
    message: 'Failed to sync calendar with server',
    recoverable: true,
    retryable: true,
  },
  NETWORK_ERROR: {
    code: 'CAL010',
    message: 'Network error during calendar operation',
    recoverable: true,
    retryable: true,
  },
  PERMISSION_DENIED: {
    code: 'CAL011',
    message: 'Permission denied for calendar operation',
    recoverable: false,
    retryable: false,
  },
  EVENT_NOT_FOUND: {
    code: 'CAL012',
    message: 'Event not found',
    recoverable: false,
    retryable: false,
  },
  INVALID_RECURRENCE_RULE: {
    code: 'CAL013',
    message: 'Invalid recurrence rule',
    recoverable: false,
    retryable: false,
  },
  EXPORT_FAILED: {
    code: 'CAL014',
    message: 'Failed to export calendar',
    recoverable: true,
    retryable: true,
  },
  IMPORT_FAILED: {
    code: 'CAL015',
    message: 'Failed to import calendar',
    recoverable: true,
    retryable: true,
  },
};

/**
 * Success Messages for Calendar Operations
 */
export const CALENDAR_SUCCESS_MESSAGES: Record<string, string> = {
  EVENT_CREATED: 'Event created successfully',
  EVENT_UPDATED: 'Event updated successfully',
  EVENT_DELETED: 'Event deleted successfully',
  EVENT_BOOKMARKED: 'Event bookmarked',
  EVENT_UNBOOKMARKED: 'Bookmark removed',
  REMINDER_SET: 'Reminder set',
  REMINDER_REMOVED: 'Reminder removed',
  PREFERENCES_SAVED: 'Calendar preferences saved',
  CALENDAR_EXPORTED: 'Calendar exported successfully',
  CALENDAR_SYNCED: 'Calendar synchronized with server',
  BULK_OPERATION_COMPLETE: 'Bulk operation completed',
};

/**
 * Calendar Timing Configuration
 */
export const CALENDAR_TIMING = {
  SYNC_INTERVAL: 5 * 60 * 1000, // 5 minutes
  CACHE_DURATION: 30 * 60 * 1000, // 30 minutes
  EVENT_RETENTION_DAYS: 365, // Keep 1 year of history
  RECURRENCE_EXPAND_MONTHS: 6, // Expand recurring events 6 months ahead
  PAGINATION_SIZE: 50, // Events per page
  SEARCH_DEBOUNCE_MS: 300, // Search debounce
  DATE_RANGE_LIMIT_DAYS: 365, // Max date range query
  REMINDER_CHECK_INTERVAL: 60 * 1000, // Check reminders every minute
};

/**
 * Feature Flags for Calendar
 */
export const CALENDAR_FEATURE_FLAGS = {
  ENABLE_RECURRING_EVENTS: true,
  ENABLE_EVENT_REMINDERS: true,
  ENABLE_CALENDAR_SHARING: false, // Future feature
  ENABLE_COLLABORATIVE_EDITING: false, // Future feature
  ENABLE_CALENDAR_IMPORT: true,
  ENABLE_CALENDAR_EXPORT: true,
  ENABLE_TIME_BLOCKING: true,
  ENABLE_FOCUS_TIME: true,
  ENABLE_SMART_SUGGESTIONS: false, // Future feature
  ENABLE_AVAILABILITY_VIEW: true,
  ENABLE_QUICK_EVENT_CREATION: true,
  ENABLE_BULK_OPERATIONS: true,
  ENABLE_OFFLINE_MODE: true,
  ENABLE_SYNC_CONFLICTS: true,
  ENABLE_TIMEZONE_SUPPORT: true,
};

/**
 * API Endpoints for Calendar Service
 */
export const CALENDAR_API_CONFIG = {
  BASE_URL: 'https://api.myspm.app/v1/calendar',
  ENDPOINTS: {
    EVENTS: '/events',
    EVENT_BY_ID: '/events/:id',
    EVENTS_RANGE: '/events/range',
    CREATE_EVENT: '/events',
    UPDATE_EVENT: '/events/:id',
    DELETE_EVENT: '/events/:id',
    BULK_OPERATION: '/events/bulk',
    PREFERENCES: '/preferences',
    EXPORT: '/export',
    IMPORT: '/import',
    SYNC: '/sync',
    REMINDERS: '/reminders',
  },
  WEBSOCKET_URL: 'wss://api.myspm.app/v1/calendar',
};

/**
 * Date Format Patterns
 */
export const CALENDAR_DATE_FORMATS = {
  ISO: 'YYYY-MM-DDTHH:mm:ss',
  DATE_ONLY: 'YYYY-MM-DD',
  TIME_ONLY_12H: 'h:mm A',
  TIME_ONLY_24H: 'HH:mm',
  FULL_DATE: 'MMMM D, YYYY',
  FULL_DATETIME_12H: 'MMMM D, YYYY h:mm A',
  FULL_DATETIME_24H: 'MMMM D, YYYY HH:mm',
  MONTH_YEAR: 'MMMM YYYY',
  SHORT_DATE: 'MMM D',
  SHORT_DATETIME: 'MMM D h:mm A',
};

/**
 * Minimum/Maximum Constraints
 */
export const CALENDAR_CONSTRAINTS = {
  MIN_EVENT_DURATION_MINUTES: 15,
  MAX_EVENT_DURATION_MINUTES: 480, // 8 hours
  MAX_EVENTS_PER_DAY: 50,
  MAX_CONCURRENT_EVENTS: 10,
  MAX_RECURRENCE_INSTANCES: 1000,
  MIN_REMINDER_MINUTES: 0,
  MAX_REMINDER_MINUTES: 40320, // 28 days
  MAX_EVENTS_IN_BULK_OPERATION: 100,
};
