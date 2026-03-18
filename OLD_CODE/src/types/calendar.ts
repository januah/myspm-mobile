/**
 * Calendar & Scheduling System - Type Definitions
 * Comprehensive type system for calendar events, scheduling, and date management
 * Supports multiple event types, recurring events, and advanced filtering
 */

/**
 * Calendar Event Types - Categories of events displayed on the calendar
 */
export type CalendarEventType =
  | 'assignment' // Assignment due dates
  | 'deadline' // Project/submission deadlines
  | 'exam' // Exams and tests
  | 'class' // Regular class meetings
  | 'event' // General events
  | 'holiday' // School holidays
  | 'break' // School breaks/vacation
  | 'submission' // Assignment submissions
  | 'grade_release' // When grades are released
  | 'meeting'; // Meetings with teachers

/**
 * Calendar View Modes - Different ways to visualize calendar
 */
export type CalendarViewMode =
  | 'month' // Month overview
  | 'week' // Week view with daily columns
  | 'day' // Single day detail view
  | 'agenda'; // List view of upcoming events

/**
 * Recurrence Patterns - For recurring events
 */
export type RecurrencePattern =
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'yearly'
  | 'custom';

/**
 * Recurrence End Type - How recurring events terminate
 */
export type RecurrenceEndType =
  | 'never' // Recurring indefinitely
  | 'count' // After N occurrences
  | 'date'; // Until specific date

/**
 * Time Slot Duration - Standard class/meeting duration
 */
export type TimeSlotDuration =
  | 30 // 30 minutes
  | 45 // 45 minutes
  | 60 // 1 hour
  | 90 // 1.5 hours
  | 120 // 2 hours
  | 180; // 3 hours

/**
 * Event Priority Level
 */
export type EventPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

/**
 * Calendar Event Status
 */
export type CalendarEventStatus =
  | 'scheduled'
  | 'confirmed'
  | 'tentative'
  | 'cancelled'
  | 'completed';

/**
 * Recurrence Rule Configuration
 */
export interface RecurrenceRule {
  pattern: RecurrencePattern;
  interval: number; // Every N days/weeks/months
  endType: RecurrenceEndType;
  endDate?: string; // ISO 8601 date (YYYY-MM-DD)
  endCount?: number; // Number of occurrences
  daysOfWeek?: number[]; // 0-6, Sunday-Saturday (for weekly/biweekly)
  dayOfMonth?: number; // 1-31 (for monthly)
  exceptions?: string[]; // Dates to exclude (ISO 8601)
}

/**
 * Time Range - Start and end times
 */
export interface TimeRange {
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  duration: TimeSlotDuration; // Calculated duration in minutes
}

/**
 * Location Information for Events
 */
export interface EventLocation {
  name: string; // Room/building name
  address?: string; // Full address
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  roomNumber?: string;
  building?: string;
  floor?: number;
}

/**
 * Attendee Information - For meetings/classes
 */
export interface EventAttendee {
  id: string;
  name: string;
  email: string;
  role: 'organizer' | 'teacher' | 'student' | 'participant';
  rsvpStatus: 'accepted' | 'declined' | 'tentative' | 'no-response';
}

/**
 * Reminder/Notification Settings for Events
 */
export interface EventReminder {
  type: 'notification' | 'email' | 'sms';
  trigger: number; // Minutes before event (negative = before, 0 = at time)
  enabled: boolean;
}

/**
 * Main Calendar Event Interface
 */
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  eventType: CalendarEventType;
  status: CalendarEventStatus;
  startDate: string; // ISO 8601 datetime
  endDate: string; // ISO 8601 datetime
  allDay: boolean;
  timeRange?: TimeRange;
  location?: EventLocation;
  priority: EventPriority;
  color: string; // Hex color code
  category: 'academic' | 'personal' | 'system';
  
  // Recurrence
  isRecurring: boolean;
  recurrenceRule?: RecurrenceRule;
  recurrenceId?: string; // For single occurrence of recurring event
  
  // Associated Data
  assignmentId?: string; // Link to assignment
  courseId?: string; // Link to course
  teacherId?: string; // Link to teacher
  gradeId?: string; // Link to grade entry
  
  // Attendance & Participation
  attendees?: EventAttendee[];
  isRequired: boolean;
  
  // Reminders
  reminders: EventReminder[];
  
  // User Interaction
  isBookmarked: boolean;
  isHidden: boolean;
  userNotes?: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string; // User ID who created event
}

/**
 * Calendar Event for API responses (normalized)
 */
export interface CalendarEventResponse extends CalendarEvent {
  participants?: number; // Count of attendees
  attachments?: string[]; // File URLs
}

/**
 * Calendar Events by Date - For month/week views
 */
export interface DateEventMap {
  [dateString: string]: CalendarEvent[]; // ISO 8601 date as key
}

/**
 * Calendar Filter Options
 */
export interface CalendarFilter {
  eventTypes?: CalendarEventType[];
  courseIds?: string[];
  teacherIds?: string[];
  priority?: EventPriority[];
  isRequired?: boolean;
  showHidden?: boolean;
  dateRange?: {
    startDate: string; // ISO 8601
    endDate: string; // ISO 8601
  };
  searchText?: string;
  isBookmarked?: boolean;
  category?: ('academic' | 'personal' | 'system')[];
  status?: CalendarEventStatus[];
}

/**
 * Calendar Preferences - User settings for calendar behavior
 */
export interface CalendarPreferences {
  viewMode: CalendarViewMode;
  startDayOfWeek: 0 | 1; // 0 = Sunday, 1 = Monday
  timeFormat: '12h' | '24h';
  showWeekends: boolean;
  showTimeGrid: boolean; // For day/week views
  defaultEventDuration: TimeSlotDuration;
  colorByType: boolean; // Use predefined colors for event types
  
  // Notification Preferences
  enableReminders: boolean;
  defaultReminderTime: number; // Minutes before event
  
  // Display Preferences
  showCourseColors: boolean;
  compactMode: boolean;
  highlightToday: boolean;
  showTwoMonths: boolean; // For month view
  
  // Behavior
  autoCreateNotifications: boolean;
  allowQuickEventCreation: boolean;
  groupByType: boolean;
  
  // Time Zone
  timeZone: string; // e.g., 'America/New_York'
}

/**
 * Calendar State in Redux
 */
export interface CalendarState {
  // Events Storage
  byId: Record<string, CalendarEvent>;
  allIds: string[];
  
  // View & Filter State
  currentViewMode: CalendarViewMode;
  selectedDate: string; // ISO 8601
  selectedMonth: string; // YYYY-MM
  filter: CalendarFilter;
  
  // Event Organization
  eventsByDate: DateEventMap; // Denormalized for performance
  upcomingEvents: string[]; // Event IDs, sorted by date
  
  // UI State
  showEventDetails: boolean;
  selectedEventId?: string;
  hoveredDate?: string;
  
  // Pagination & Loading
  currentPage: number;
  pageSize: number;
  hasMoreEvents: boolean;
  
  // User Preferences
  preferences: CalendarPreferences;
  
  // Loading & Error States
  loading: boolean;
  syncing: boolean;
  error: string | null;
  syncError: string | null;
}

/**
 * Calendar Summary - Statistics and overview
 */
export interface CalendarSummary {
  totalEvents: number;
  upcomingCount: number;
  overdueCount: number;
  examsCount: number;
  deadlinesCount: number;
  assignmentsCount: number;
  
  // By Priority
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  
  // By Status
  scheduledCount: number;
  completedCount: number;
  cancelledCount: number;
  
  // Date Range Stats
  eventsThisWeek: number;
  eventsThisMonth: number;
  eventsNextMonth: number;
  
  // Busy Times
  busyDates: string[]; // Dates with 3+ events
}

/**
 * Calendar View Configuration
 */
export interface CalendarViewConfig {
  mode: CalendarViewMode;
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  cellHeight?: number; // For day/week views
  hourHeight?: number; // For time-based views
  showTimeGutter?: boolean;
}

/**
 * Event Creation/Update Payload
 */
export interface CreateCalendarEventPayload {
  title: string;
  description?: string;
  eventType: CalendarEventType;
  startDate: string;
  endDate: string;
  allDay?: boolean;
  timeRange?: TimeRange;
  location?: EventLocation;
  priority?: EventPriority;
  color?: string;
  category?: 'academic' | 'personal' | 'system';
  isRecurring?: boolean;
  recurrenceRule?: RecurrenceRule;
  assignmentId?: string;
  courseId?: string;
  teacherId?: string;
  attendees?: Omit<EventAttendee, 'rsvpStatus'>[];
  isRequired?: boolean;
  reminders?: EventReminder[];
  userNotes?: string;
}

/**
 * Bulk Event Operations
 */
export interface BulkCalendarOperation {
  type: 'create' | 'update' | 'delete' | 'hide' | 'unhide';
  eventIds?: string[];
  payload?: Partial<CreateCalendarEventPayload>;
}

/**
 * Calendar Export Configuration
 */
export interface CalendarExportConfig {
  format: 'ical' | 'json' | 'csv';
  includeDescription: boolean;
  includeAttendees: boolean;
  includeReminders: boolean;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}

/**
 * Calendar Sync State - For server synchronization
 */
export interface CalendarSyncState {
  lastSyncTime: string;
  syncInProgress: boolean;
  conflictCount: number;
  pendingChanges: {
    created: string[]; // Event IDs
    updated: string[];
    deleted: string[];
  };
}

/**
 * Pagination Config for Calendar
 */
export interface CalendarPagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Advanced Calendar Query - For complex filtering
 */
export interface AdvancedCalendarQuery {
  filter: CalendarFilter;
  pagination: CalendarPagination;
  sort?: {
    field: 'startDate' | 'priority' | 'title' | 'eventType';
    direction: 'asc' | 'desc';
  };
  includeRecurrenceExpansion?: boolean; // Expand recurring events
  maxRecurrenceInstances?: number; // Limit recurrence expansion
}

/**
 * Calendar Time Slot - For availability/scheduling
 */
export interface CalendarTimeSlot {
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  isAvailable: boolean;
  eventId?: string; // If occupied
  type?: 'class' | 'event' | 'free' | 'break';
}

/**
 * Weekly Schedule - All time slots for a week
 */
export interface WeeklySchedule {
  weekStart: string; // ISO 8601
  weekEnd: string; // ISO 8601
  daySchedules: {
    [dayOfWeek: string]: CalendarTimeSlot[];
  };
  totalHours: number; // Total scheduled hours
}

/**
 * Calendar Notification - Real-time event notification
 */
export interface CalendarNotification {
  id: string;
  eventId: string;
  type: 'reminder' | 'change' | 'new' | 'cancelled';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

/**
 * Export type for useCalendar hook return value
 */
export interface UseCalendarReturn {
  // State
  events: CalendarEvent[];
  currentViewMode: CalendarViewMode;
  selectedDate: string;
  selectedMonth: string;
  filter: CalendarFilter;
  preferences: CalendarPreferences;
  summary: CalendarSummary;
  loading: boolean;
  syncing: boolean;
  error: string | null;
  
  // Event Operations
  fetchEvents: (filter?: CalendarFilter) => Promise<void>;
  fetchEventsByDateRange: (startDate: string, endDate: string) => Promise<CalendarEvent[]>;
  getEventById: (eventId: string) => CalendarEvent | undefined;
  getEventsByDate: (date: string) => CalendarEvent[];
  createEvent: (event: CreateCalendarEventPayload) => Promise<CalendarEvent>;
  updateEvent: (eventId: string, updates: Partial<CreateCalendarEventPayload>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  duplicateEvent: (eventId: string, newDate?: string) => Promise<CalendarEvent>;
  
  // View & Navigation
  setViewMode: (mode: CalendarViewMode) => void;
  selectDate: (date: string) => void;
  selectMonth: (month: string) => void;
  nextMonth: () => void;
  previousMonth: () => void;
  goToToday: () => void;
  
  // Event Interaction
  markEventAsCompleted: (eventId: string) => Promise<void>;
  bookmarkEvent: (eventId: string) => Promise<void>;
  unhideEvent: (eventId: string) => Promise<void>;
  hideEvent: (eventId: string) => Promise<void>;
  addUserNote: (eventId: string, note: string) => Promise<void>;
  
  // Filter & Search
  setFilter: (filter: CalendarFilter) => void;
  clearFilter: () => void;
  searchEvents: (query: string) => CalendarEvent[];
  filterByEventType: (types: CalendarEventType[]) => void;
  filterByPriority: (priorities: EventPriority[]) => void;
  
  // Preferences
  updatePreferences: (prefs: Partial<CalendarPreferences>) => Promise<void>;
  
  // Reminders
  setEventReminder: (eventId: string, reminder: EventReminder) => Promise<void>;
  removeEventReminder: (eventId: string, reminderId: string) => Promise<void>;
  
  // Export
  exportCalendar: (config: CalendarExportConfig) => Promise<string>;
  
  // Sync
  syncCalendarWithServer: () => Promise<void>;
  
  // Bulk Operations
  bulkOperation: (operation: BulkCalendarOperation) => Promise<void>;
}
