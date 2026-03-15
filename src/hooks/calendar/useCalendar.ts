/**
 * useCalendar Hook - Custom React Hook for Calendar Integration
 * Provides complete calendar functionality to React components
 * Wraps Redux dispatch and WebSocket listeners
 */

import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type {
  CalendarEvent,
  CalendarEventType,
  EventPriority,
  CalendarFilter,
  CalendarPreferences,
  CalendarViewMode,
  CreateCalendarEventPayload,
  BulkCalendarOperation,
  CalendarExportConfig,
  UseCalendarReturn,
} from '../../types/calendar';

import {
  fetchEvents,
  fetchEventsByDateRange,
  fetchEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  duplicateEvent,
  bulkOperation,
  fetchPreferences,
  updatePreferences,
  exportCalendar,
  syncCalendar,
  setViewMode,
  selectDate,
  selectMonth,
  setFilter,
  clearFilter,
  selectEvent,
  clearError,
  receiveNewEvent,
  receiveUpdatedEvent,
  receiveDeletedEvent,
} from '../../store/slices/calendarSlice';

import {
  selectAllEvents,
  selectUpcomingEvents,
  selectEventsByDate,
  selectCalendarSummary,
  selectCurrentViewMode,
  selectSelectedDate,
  selectCalendarFilter,
  selectCalendarPreferences,
  selectCalendarLoading,
  selectCalendarError,
} from '../../store/slices/calendarSlice';

import CalendarService from '../../services/CalendarService';

/**
 * Main Calendar Hook
 */
export const useCalendar = (): UseCalendarReturn => {
  const dispatch = useDispatch();
  const listenerRef = useRef<Map<string, Function>>(new Map());

  // Selectors
  const events = useSelector(selectAllEvents);
  const upcomingEvents = useSelector(selectUpcomingEvents);
  const currentViewMode = useSelector(selectCurrentViewMode);
  const selectedDate = useSelector(selectSelectedDate);
  const filter = useSelector(selectCalendarFilter);
  const preferences = useSelector(selectCalendarPreferences);
  const summary = useSelector(selectCalendarSummary);
  const loading = useSelector(selectCalendarLoading);
  const error = useSelector(selectCalendarError);
  const syncing = false; // Would connect to redux state

  // WebSocket Event Listeners Setup
  useEffect(() => {
    const handleEventCreated = (event: CustomEvent<CalendarEvent>) => {
      dispatch(receiveNewEvent(event.detail));
    };

    const handleEventUpdated = (event: CustomEvent<CalendarEvent>) => {
      dispatch(receiveUpdatedEvent(event.detail));
    };

    const handleEventDeleted = (event: CustomEvent<{ eventId: string }>) => {
      dispatch(receiveDeletedEvent(event.detail.eventId));
    };

    const handleConnected = () => {
      // Connection established
    };

    window.addEventListener('calendar:event_created', handleEventCreated as EventListener);
    window.addEventListener('calendar:event_updated', handleEventUpdated as EventListener);
    window.addEventListener('calendar:event_deleted', handleEventDeleted as EventListener);
    window.addEventListener('calendar:connected', handleConnected);

    listenerRef.current.set('event_created', handleEventCreated);
    listenerRef.current.set('event_updated', handleEventUpdated);
    listenerRef.current.set('event_deleted', handleEventDeleted);
    listenerRef.current.set('connected', handleConnected);

    return () => {
      window.removeEventListener('calendar:event_created', handleEventCreated as EventListener);
      window.removeEventListener('calendar:event_updated', handleEventUpdated as EventListener);
      window.removeEventListener('calendar:event_deleted', handleEventDeleted as EventListener);
      window.removeEventListener('calendar:connected', handleConnected);
    };
  }, [dispatch]);

  // Event Operations
  const fetchAllEvents = useCallback(
    (filterOptions?: CalendarFilter) => {
      return dispatch(
        fetchEvents({
          filter: filterOptions,
          page: 1,
          pageSize: 50,
        })
      );
    },
    [dispatch]
  );

  const fetchByDateRange = useCallback(
    (startDate: string, endDate: string) => {
      return dispatch(
        fetchEventsByDateRange({
          startDate,
          endDate,
        })
      );
    },
    [dispatch]
  );

  const getEventById = useCallback(
    (eventId: string): CalendarEvent | undefined => {
      return events.find((e) => e.id === eventId);
    },
    [events]
  );

  const getEventsByDate = useCallback(
    (date: string): CalendarEvent[] => {
      return events.filter((e) => e.startDate.split('T')[0] === date);
    },
    [events]
  );

  const createNewEvent = useCallback(
    (eventData: CreateCalendarEventPayload) => {
      return dispatch(createEvent(eventData));
    },
    [dispatch]
  );

  const updateExistingEvent = useCallback(
    (eventId: string, updates: Partial<CreateCalendarEventPayload>) => {
      return dispatch(
        updateEvent({
          eventId,
          updates,
        })
      );
    },
    [dispatch]
  );

  const removeEvent = useCallback(
    (eventId: string) => {
      return dispatch(deleteEvent(eventId));
    },
    [dispatch]
  );

  const duplicateExistingEvent = useCallback(
    (eventId: string, newDate?: string) => {
      return dispatch(
        duplicateEvent({
          eventId,
          newDate,
        })
      );
    },
    [dispatch]
  );

  // View & Navigation
  const setViewModeLocal = useCallback(
    (mode: CalendarViewMode) => {
      dispatch(setViewMode(mode));
    },
    [dispatch]
  );

  const selectDateLocal = useCallback(
    (date: string) => {
      dispatch(selectDate(date));
    },
    [dispatch]
  );

  const selectMonthLocal = useCallback(
    (month: string) => {
      dispatch(selectMonth(month));
    },
    [dispatch]
  );

  const nextMonth = useCallback(() => {
    const [year, month] = selectedDate.split('-');
    let nextMonth = parseInt(month) + 1;
    let nextYear = parseInt(year);
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }
    dispatch(
      selectMonth(`${nextYear}-${String(nextMonth).padStart(2, '0')}`)
    );
  }, [selectedDate, dispatch]);

  const previousMonth = useCallback(() => {
    const [year, month] = selectedDate.split('-');
    let prevMonth = parseInt(month) - 1;
    let prevYear = parseInt(year);
    if (prevMonth < 1) {
      prevMonth = 12;
      prevYear -= 1;
    }
    dispatch(
      selectMonth(`${prevYear}-${String(prevMonth).padStart(2, '0')}`)
    );
  }, [selectedDate, dispatch]);

  const goToToday = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    dispatch(selectDate(today));
    dispatch(selectMonth(today.substring(0, 7)));
  }, [dispatch]);

  // Event Interaction
  const markEventAsCompleted = useCallback(
    (eventId: string) => {
      return dispatch(
        updateEvent({
          eventId,
          updates: { status: 'completed' },
        })
      );
    },
    [dispatch]
  );

  const bookmarkEvent = useCallback(
    (eventId: string) => {
      const event = events.find((e) => e.id === eventId);
      if (event) {
        return dispatch(
          updateEvent({
            eventId,
            updates: { isBookmarked: true },
          })
        );
      }
    },
    [dispatch, events]
  );

  const unhideEvent = useCallback(
    (eventId: string) => {
      return dispatch(
        updateEvent({
          eventId,
          updates: { isHidden: false },
        })
      );
    },
    [dispatch]
  );

  const hideEvent = useCallback(
    (eventId: string) => {
      return dispatch(
        updateEvent({
          eventId,
          updates: { isHidden: true },
        })
      );
    },
    [dispatch]
  );

  const addUserNote = useCallback(
    (eventId: string, note: string) => {
      return dispatch(
        updateEvent({
          eventId,
          updates: { userNotes: note },
        })
      );
    },
    [dispatch]
  );

  // Filter & Search
  const setFilterLocal = useCallback(
    (newFilter: CalendarFilter) => {
      dispatch(setFilter(newFilter));
      dispatch(
        fetchEvents({
          filter: newFilter,
          page: 1,
          pageSize: 50,
        })
      );
    },
    [dispatch]
  );

  const clearFilterLocal = useCallback(() => {
    dispatch(clearFilter());
    dispatch(
      fetchEvents({
        filter: undefined,
        page: 1,
        pageSize: 50,
      })
    );
  }, [dispatch]);

  const searchEvents = useCallback(
    (query: string): CalendarEvent[] => {
      const lowerQuery = query.toLowerCase();
      return events.filter(
        (e) =>
          e.title.toLowerCase().includes(lowerQuery) ||
          e.description?.toLowerCase().includes(lowerQuery) ||
          e.location?.name.toLowerCase().includes(lowerQuery)
      );
    },
    [events]
  );

  const filterByEventType = useCallback(
    (types: CalendarEventType[]) => {
      dispatch(setFilter({ ...filter, eventTypes: types }));
      dispatch(
        fetchEvents({
          filter: { ...filter, eventTypes: types },
          page: 1,
          pageSize: 50,
        })
      );
    },
    [dispatch, filter]
  );

  const filterByPriority = useCallback(
    (priorities: EventPriority[]) => {
      dispatch(setFilter({ ...filter, priority: priorities }));
      dispatch(
        fetchEvents({
          filter: { ...filter, priority: priorities },
          page: 1,
          pageSize: 50,
        })
      );
    },
    [dispatch, filter]
  );

  // Preferences
  const updatePreferencesLocal = useCallback(
    (prefs: Partial<CalendarPreferences>) => {
      return dispatch(updatePreferences(prefs));
    },
    [dispatch]
  );

  // Reminders
  const setEventReminder = useCallback(
    (eventId: string, reminder: any) => {
      const event = events.find((e) => e.id === eventId);
      if (event) {
        const updatedReminders = [...event.reminders, reminder];
        return dispatch(
          updateEvent({
            eventId,
            updates: { reminders: updatedReminders },
          })
        );
      }
    },
    [dispatch, events]
  );

  const removeEventReminder = useCallback(
    (eventId: string, reminderId: string) => {
      const event = events.find((e) => e.id === eventId);
      if (event) {
        const updatedReminders = event.reminders.filter((r, idx) => idx !== parseInt(reminderId));
        return dispatch(
          updateEvent({
            eventId,
            updates: { reminders: updatedReminders },
          })
        );
      }
    },
    [dispatch, events]
  );

  // Export
  const exportCalendarLocal = useCallback(
    (config: CalendarExportConfig) => {
      return dispatch(exportCalendar(config));
    },
    [dispatch]
  );

  // Sync
  const syncCalendarLocal = useCallback(() => {
    return dispatch(syncCalendar());
  }, [dispatch]);

  // Bulk Operations
  const bulkOperationLocal = useCallback(
    (operation: BulkCalendarOperation) => {
      return dispatch(bulkOperation(operation));
    },
    [dispatch]
  );

  return {
    events,
    upcomingEvents,
    currentViewMode,
    selectedDate,
    filter,
    preferences,
    summary,
    loading,
    syncing,
    error,
    fetchEvents: fetchAllEvents,
    fetchEventsByDateRange: fetchByDateRange,
    getEventById,
    getEventsByDate,
    createEvent: createNewEvent,
    updateEvent: updateExistingEvent,
    deleteEvent: removeEvent,
    duplicateEvent: duplicateExistingEvent,
    setViewMode: setViewModeLocal,
    selectDate: selectDateLocal,
    selectMonth: selectMonthLocal,
    nextMonth,
    previousMonth,
    goToToday,
    markEventAsCompleted,
    bookmarkEvent,
    unhideEvent,
    hideEvent,
    addUserNote,
    setFilter: setFilterLocal,
    clearFilter: clearFilterLocal,
    searchEvents,
    filterByEventType,
    filterByPriority,
    updatePreferences: updatePreferencesLocal,
    setEventReminder,
    removeEventReminder,
    exportCalendar: exportCalendarLocal,
    syncCalendar: syncCalendarLocal,
    bulkOperation: bulkOperationLocal,
  };
};

export default useCalendar;
