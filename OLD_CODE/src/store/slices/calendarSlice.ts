/**
 * Calendar Redux Slice - State Management for Calendar System
 * Handles all calendar state, async operations, and real-time updates via WebSocket
 */

import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  PayloadAction,
  EntityAdapter,
} from '@reduxjs/toolkit';

import type {
  CalendarEvent,
  CalendarFilter,
  CalendarPreferences,
  CalendarState,
  CalendarSummary,
  CreateCalendarEventPayload,
  BulkCalendarOperation,
  CalendarExportConfig,
  DateEventMap,
} from '../../types/calendar';
import { DEFAULT_CALENDAR_PREFERENCES } from '../../constants/calendar';
import CalendarService from '../../services/CalendarService';

// Entity adapter for normalized state
const calendarEventAdapter: EntityAdapter<CalendarEvent> = createEntityAdapter({
  selectId: (event: CalendarEvent) => event.id,
  sortComparer: (a, b) => {
    const aDate = new Date(a.startDate).getTime();
    const bDate = new Date(b.startDate).getTime();
    return aDate - bDate;
  },
});

// Async Thunks

export const fetchEvents = createAsyncThunk(
  'calendar/fetchEvents',
  async (
    params: { filter?: CalendarFilter; page?: number; pageSize?: number },
    { rejectWithValue }
  ) => {
    try {
      return await CalendarService.fetchEvents(params.filter, params.page, params.pageSize);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch events'
      );
    }
  }
);

export const fetchEventsByDateRange = createAsyncThunk(
  'calendar/fetchEventsByDateRange',
  async (
    params: { startDate: string; endDate: string },
    { rejectWithValue }
  ) => {
    try {
      return await CalendarService.fetchEventsByDateRange(params.startDate, params.endDate);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch events by date range'
      );
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'calendar/fetchEventById',
  async (eventId: string, { rejectWithValue }) => {
    try {
      return await CalendarService.fetchEventById(eventId);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch event'
      );
    }
  }
);

export const createEvent = createAsyncThunk(
  'calendar/createEvent',
  async (event: CreateCalendarEventPayload, { rejectWithValue }) => {
    try {
      return await CalendarService.createEvent(event);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to create event'
      );
    }
  }
);

export const updateEvent = createAsyncThunk(
  'calendar/updateEvent',
  async (
    params: { eventId: string; updates: Partial<CreateCalendarEventPayload> },
    { rejectWithValue }
  ) => {
    try {
      return await CalendarService.updateEvent(params.eventId, params.updates);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update event'
      );
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'calendar/deleteEvent',
  async (eventId: string, { rejectWithValue }) => {
    try {
      await CalendarService.deleteEvent(eventId);
      return eventId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to delete event'
      );
    }
  }
);

export const duplicateEvent = createAsyncThunk(
  'calendar/duplicateEvent',
  async (
    params: { eventId: string; newDate?: string },
    { rejectWithValue }
  ) => {
    try {
      const newDate = params.newDate || new Date().toISOString();
      return await CalendarService.duplicateEvent(params.eventId, newDate);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to duplicate event'
      );
    }
  }
);

export const bulkOperation = createAsyncThunk(
  'calendar/bulkOperation',
  async (operation: BulkCalendarOperation, { rejectWithValue }) => {
    try {
      await CalendarService.bulkOperation(operation);
      return operation;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to perform bulk operation'
      );
    }
  }
);

export const fetchPreferences = createAsyncThunk(
  'calendar/fetchPreferences',
  async (_, { rejectWithValue }) => {
    try {
      return await CalendarService.fetchPreferences();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch preferences'
      );
    }
  }
);

export const updatePreferences = createAsyncThunk(
  'calendar/updatePreferences',
  async (preferences: Partial<CalendarPreferences>, { rejectWithValue }) => {
    try {
      await CalendarService.updatePreferences(preferences);
      return preferences;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update preferences'
      );
    }
  }
);

export const exportCalendar = createAsyncThunk(
  'calendar/export',
  async (config: CalendarExportConfig, { rejectWithValue }) => {
    try {
      return await CalendarService.exportCalendar(config);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to export calendar'
      );
    }
  }
);

export const syncCalendar = createAsyncThunk(
  'calendar/sync',
  async (_, { rejectWithValue }) => {
    try {
      await CalendarService.syncCalendar();
      return true;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to sync calendar'
      );
    }
  }
);

// Initial State
const initialState: CalendarState = {
  byId: {},
  allIds: [],
  currentViewMode: 'month',
  selectedDate: new Date().toISOString().split('T')[0],
  selectedMonth: new Date().toISOString().substring(0, 7),
  filter: {},
  eventsByDate: {},
  upcomingEvents: [],
  showEventDetails: false,
  selectedEventId: undefined,
  currentPage: 1,
  pageSize: 50,
  hasMoreEvents: false,
  preferences: DEFAULT_CALENDAR_PREFERENCES,
  loading: false,
  syncing: false,
  error: null,
  syncError: null,
};

// Slice
const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<CalendarState['currentViewMode']>) => {
      state.currentViewMode = action.payload;
    },
    selectDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
      state.showEventDetails = false;
    },
    selectMonth: (state, action: PayloadAction<string>) => {
      state.selectedMonth = action.payload;
    },
    setFilter: (state, action: PayloadAction<CalendarFilter>) => {
      state.filter = action.payload;
    },
    clearFilter: (state) => {
      state.filter = {};
    },
    updatePagination: (state, action: PayloadAction<{ page: number; pageSize: number }>) => {
      state.currentPage = action.payload.page;
      state.pageSize = action.payload.pageSize;
    },
    selectEvent: (state, action: PayloadAction<string | undefined>) => {
      state.selectedEventId = action.payload;
      state.showEventDetails = !!action.payload;
    },
    toggleEventDetails: (state) => {
      state.showEventDetails = !state.showEventDetails;
    },
    setHoveredDate: (state, action: PayloadAction<string | undefined>) => {
      state.hoveredDate = action.payload;
    },
    // WebSocket real-time updates
    receiveNewEvent: (state, action: PayloadAction<CalendarEvent>) => {
      calendarEventAdapter.addOne(state, action.payload);
      state.allIds.push(action.payload.id);
    },
    receiveUpdatedEvent: (state, action: PayloadAction<CalendarEvent>) => {
      calendarEventAdapter.updateOne(state, {
        id: action.payload.id,
        changes: action.payload,
      });
    },
    receiveDeletedEvent: (state, action: PayloadAction<string>) => {
      calendarEventAdapter.removeOne(state, action.payload);
    },
    setSyncRequired: (state) => {
      // Will trigger sync in effects
    },
    setConnectionStatus: (state, action: PayloadAction<'connected' | 'connecting' | 'disconnected'>) => {
      // Track connection status if needed
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSyncError: (state) => {
      state.syncError = null;
    },
    resetCalendarState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Fetch Events
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        calendarEventAdapter.setAll(state, action.payload);
        state.allIds = action.payload.map((e) => e.id);
        state.upcomingEvents = action.payload
          .filter((e) => new Date(e.startDate) >= new Date())
          .map((e) => e.id);
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Events by Date Range
    builder
      .addCase(fetchEventsByDateRange.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventsByDateRange.fulfilled, (state, action) => {
        state.loading = false;
        calendarEventAdapter.setAll(state, action.payload);
        state.allIds = action.payload.map((e) => e.id);
      })
      .addCase(fetchEventsByDateRange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Event by ID
    builder
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        calendarEventAdapter.upsertOne(state, action.payload);
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Event
    builder
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        calendarEventAdapter.addOne(state, action.payload);
        state.allIds.push(action.payload.id);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Event
    builder
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        calendarEventAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload,
        });
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Event
    builder
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        calendarEventAdapter.removeOne(state, action.payload);
        state.allIds = state.allIds.filter((id) => id !== action.payload);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Duplicate Event
    builder
      .addCase(duplicateEvent.fulfilled, (state, action) => {
        calendarEventAdapter.addOne(state, action.payload);
        state.allIds.push(action.payload.id);
      })
      .addCase(duplicateEvent.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Bulk Operation
    builder
      .addCase(bulkOperation.fulfilled, (state) => {
        // Bulk operation completed, may need refetch
      })
      .addCase(bulkOperation.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Fetch Preferences
    builder
      .addCase(fetchPreferences.fulfilled, (state, action) => {
        state.preferences = action.payload;
      })
      .addCase(fetchPreferences.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Update Preferences
    builder
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.preferences = { ...state.preferences, ...action.payload };
      })
      .addCase(updatePreferences.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Export Calendar
    builder.addCase(exportCalendar.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // Sync Calendar
    builder
      .addCase(syncCalendar.pending, (state) => {
        state.syncing = true;
        state.syncError = null;
      })
      .addCase(syncCalendar.fulfilled, (state) => {
        state.syncing = false;
      })
      .addCase(syncCalendar.rejected, (state, action) => {
        state.syncing = false;
        state.syncError = action.payload as string;
      });
  },
});

// Actions
export const {
  setViewMode,
  selectDate,
  selectMonth,
  setFilter,
  clearFilter,
  updatePagination,
  selectEvent,
  toggleEventDetails,
  setHoveredDate,
  receiveNewEvent,
  receiveUpdatedEvent,
  receiveDeletedEvent,
  setSyncRequired,
  setConnectionStatus,
  clearError,
  clearSyncError,
  resetCalendarState,
} = calendarSlice.actions;

// Selectors
const selectCalendarState = (state: any) => state.calendar;

export const selectAllEvents = createSelector(
  [selectCalendarState],
  (calendar: CalendarState) => calendar.allIds.map((id) => calendar.byId[id]).filter(Boolean)
);

export const selectEventById = (eventId: string) =>
  createSelector([selectCalendarState], (calendar: CalendarState) => calendar.byId[eventId]);

export const selectUpcomingEvents = createSelector(
  [selectCalendarState],
  (calendar: CalendarState) =>
    calendar.upcomingEvents.map((id) => calendar.byId[id]).filter(Boolean)
);

export const selectEventsByDate = (date: string) =>
  createSelector(
    [selectCalendarState],
    (calendar: CalendarState) =>
      calendar.allIds
        .map((id) => calendar.byId[id])
        .filter((e) => e && e.startDate.split('T')[0] === date)
  );

export const selectCalendarSummary = createSelector(
  [selectCalendarState],
  (calendar: CalendarState): CalendarSummary => {
    const events = calendar.allIds.map((id) => calendar.byId[id]).filter(Boolean);
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return {
      totalEvents: events.length,
      upcomingCount: events.filter((e) => new Date(e.startDate) >= now).length,
      overdueCount: events.filter((e) => new Date(e.endDate) < now).length,
      examsCount: events.filter((e) => e.eventType === 'exam').length,
      deadlinesCount: events.filter((e) => e.eventType === 'deadline').length,
      assignmentsCount: events.filter((e) => e.eventType === 'assignment').length,
      criticalCount: events.filter((e) => e.priority === 'critical').length,
      highCount: events.filter((e) => e.priority === 'high').length,
      mediumCount: events.filter((e) => e.priority === 'medium').length,
      lowCount: events.filter((e) => e.priority === 'low').length,
      scheduledCount: events.filter((e) => e.status === 'scheduled').length,
      completedCount: events.filter((e) => e.status === 'completed').length,
      cancelledCount: events.filter((e) => e.status === 'cancelled').length,
      eventsThisWeek: events.filter(
        (e) => new Date(e.startDate) >= now && new Date(e.startDate) <= weekFromNow
      ).length,
      eventsThisMonth: events.filter(
        (e) => new Date(e.startDate) >= now && new Date(e.startDate) <= monthFromNow
      ).length,
      eventsNextMonth: events.filter((e) => {
        const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        const twoMonths = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
        return new Date(e.startDate) >= nextMonth && new Date(e.startDate) <= twoMonths;
      }).length,
      busyDates: events
        .reduce(
          (acc: { [key: string]: number }, e) => {
            const date = e.startDate.split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
          },
          {}
        )
        .entries()
        .filter(([_, count]) => count >= 3)
        .map(([date]) => date),
    };
  }
);

export const selectCurrentViewMode = createSelector(
  [selectCalendarState],
  (calendar: CalendarState) => calendar.currentViewMode
);

export const selectSelectedDate = createSelector(
  [selectCalendarState],
  (calendar: CalendarState) => calendar.selectedDate
);

export const selectCalendarFilter = createSelector(
  [selectCalendarState],
  (calendar: CalendarState) => calendar.filter
);

export const selectCalendarPreferences = createSelector(
  [selectCalendarState],
  (calendar: CalendarState) => calendar.preferences
);

export const selectCalendarLoading = createSelector(
  [selectCalendarState],
  (calendar: CalendarState) => calendar.loading
);

export const selectCalendarError = createSelector(
  [selectCalendarState],
  (calendar: CalendarState) => calendar.error
);

export default calendarSlice.reducer;
