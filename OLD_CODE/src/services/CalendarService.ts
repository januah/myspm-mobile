/**
 * Calendar Service - Singleton for Calendar API Communication
 * Handles all calendar operations, WebSocket management, and data synchronization
 * Implements exponential backoff for WebSocket reconnection
 */

import type {
  CalendarEvent,
  CreateCalendarEventPayload,
  CalendarFilter,
  CalendarPreferences,
  BulkCalendarOperation,
  CalendarExportConfig,
  AdvancedCalendarQuery,
} from '../types/calendar';
import { CALENDAR_API_CONFIG, CALENDAR_TIMING } from '../constants/calendar';
import { get, post, patch, del } from './fetchClient';

interface WebSocketMessage {
  type: 'event:created' | 'event:updated' | 'event:deleted' | 'sync:required' | 'ping';
  payload?: any;
}

class CalendarService {
  private static instance: CalendarService;
  private wsConnection: WebSocket | null = null;
  private wsUrl: string = CALENDAR_API_CONFIG.WEBSOCKET_URL;
  private baseUrl: string = CALENDAR_API_CONFIG.BASE_URL;
  private authToken: string | null = null;
  private currentLanguage: string = 'en';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelays = [1000, 2000, 5000, 10000, 30000]; // Exponential backoff
  private isConnecting = false;
  private eventListeners: Map<string, Set<Function>> = new Map();
  private syncInProgress = false;
  private lastSyncTime: number = 0;

  /**
   * Get singleton instance
   */
  static getInstance(): CalendarService {
    if (!CalendarService.instance) {
      CalendarService.instance = new CalendarService();
    }
    return CalendarService.instance;
  }

  /**
   * Initialize service with authentication token
   */
  initialize(token: string): void {
    this.authToken = token;
  }

  /**
   * Set current language for API requests
   */
  setLanguage(language: string): void {
    this.currentLanguage = language;
  }

  /**
   * Get authentication headers
   */
  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authToken}`,
    };
  }

  /**
   * Establish WebSocket connection for real-time updates
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.wsConnection?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        reject(new Error('WebSocket connection already in progress'));
        return;
      }

      this.isConnecting = true;
      const url = `${this.wsUrl}?token=${this.authToken}`;

      try {
        this.wsConnection = new WebSocket(url);

        this.wsConnection.onopen = () => {
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.emit('calendar:connected', {});
          resolve();
        };

        this.wsConnection.onmessage = (event) => {
          this.handleWebSocketMessage(JSON.parse(event.data));
        };

        this.wsConnection.onerror = (error) => {
          this.isConnecting = false;
          this.emit('calendar:error', { error: error.toString() });
          reject(error);
        };

        this.wsConnection.onclose = () => {
          this.isConnecting = false;
          this.emit('calendar:disconnected', {});
          this.attemptReconnect();
        };
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  /**
   * Attempt to reconnect with exponential backoff
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emit('calendar:connection_failed', {
        message: 'Max reconnect attempts reached',
      });
      return;
    }

    const delay = this.reconnectDelays[this.reconnectAttempts];
    this.reconnectAttempts++;

    setTimeout(() => {
      this.connect().catch(() => {
        // Retry scheduled in the catch handler
      });
    }, delay);
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleWebSocketMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'event:created':
        this.emit('calendar:event_created', message.payload);
        break;
      case 'event:updated':
        this.emit('calendar:event_updated', message.payload);
        break;
      case 'event:deleted':
        this.emit('calendar:event_deleted', message.payload);
        break;
      case 'sync:required':
        this.emit('calendar:sync_required', {});
        break;
      case 'ping':
        this.sendWebSocketMessage({ type: 'ping' });
        break;
    }
  }

  /**
   * Send message via WebSocket
   */
  private sendWebSocketMessage(message: any): void {
    if (this.wsConnection?.readyState === WebSocket.OPEN) {
      this.wsConnection.send(JSON.stringify(message));
    }
  }

  /**
   * Disconnect WebSocket
   */
  disconnect(): void {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
  }

  /**
   * Fetch all events with optional filtering
   */
  async fetchEvents(filter?: CalendarFilter, page = 1, pageSize = 50): Promise<CalendarEvent[]> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('pageSize', pageSize.toString());

      if (filter) {
        if (filter.eventTypes?.length) {
          params.append('types', filter.eventTypes.join(','));
        }
        if (filter.courseIds?.length) {
          params.append('courses', filter.courseIds.join(','));
        }
        if (filter.teacherIds?.length) {
          params.append('teachers', filter.teacherIds.join(','));
        }
        if (filter.priority?.length) {
          params.append('priorities', filter.priority.join(','));
        }
        if (filter.searchText) {
          params.append('search', filter.searchText);
        }
        if (filter.dateRange) {
          params.append('startDate', filter.dateRange.startDate);
          params.append('endDate', filter.dateRange.endDate);
        }
        if (filter.isBookmarked) {
          params.append('bookmarked', 'true');
        }
      }

      const response = await get(`${this.baseUrl}/events?${params.toString()}`, this.currentLanguage, { Authorization: `Bearer ${this.authToken}` });

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const data = await response.json();
      return data.events || [];
    } catch (error) {
      this.emit('calendar:fetch_error', { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }

  /**
   * Fetch events by date range
   */
  async fetchEventsByDateRange(startDate: string, endDate: string): Promise<CalendarEvent[]> {
    try {
      const response = await get(`${this.baseUrl}/events/range?startDate=${startDate}&endDate=${endDate}`, this.currentLanguage, { Authorization: `Bearer ${this.authToken}` });

      if (!response.ok) {
        throw new Error(`Failed to fetch events by range: ${response.statusText}`);
      }

      const data = await response.json();
      return data.events || [];
    } catch (error) {
      this.emit('calendar:fetch_error', { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }

  /**
   * Fetch single event by ID
   */
  async fetchEventById(eventId: string): Promise<CalendarEvent> {
    try {
      const response = await get(`${this.baseUrl}/events/${eventId}`, this.currentLanguage, { Authorization: `Bearer ${this.authToken}` });

      if (!response.ok) {
        throw new Error(`Failed to fetch event: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      this.emit('calendar:fetch_error', { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }

  /**
   * Create new event
   */
  async createEvent(event: CreateCalendarEventPayload): Promise<CalendarEvent> {
    try {
      const response = await post(`${this.baseUrl}/events`, event, this.currentLanguage, { Authorization: `Bearer ${this.authToken}` });

      if (!response.ok) {
        throw new Error(`Failed to create event: ${response.statusText}`);
      }

      const createdEvent = await response.json();
      this.emit('calendar:event_created', createdEvent);
      return createdEvent;
    } catch (error) {
      this.emit('calendar:create_error', { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }

  /**
   * Update existing event
   */
  async updateEvent(
    eventId: string,
    updates: Partial<CreateCalendarEventPayload>
  ): Promise<CalendarEvent> {
    try {
      const response = await patch(`${this.baseUrl}/events/${eventId}`, updates, this.currentLanguage, { Authorization: `Bearer ${this.authToken}` });

      if (!response.ok) {
        throw new Error(`Failed to update event: ${response.statusText}`);
      }

      const updatedEvent = await response.json();
      this.emit('calendar:event_updated', updatedEvent);
      return updatedEvent;
    } catch (error) {
      this.emit('calendar:update_error', { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }

  /**
   * Delete event
   */
  async deleteEvent(eventId: string): Promise<void> {
    try {
      const response = await del(`${this.baseUrl}/events/${eventId}`, this.currentLanguage, { Authorization: `Bearer ${this.authToken}` });

      if (!response.ok) {
        throw new Error(`Failed to delete event: ${response.statusText}`);
      }

      this.emit('calendar:event_deleted', { eventId });
    } catch (error) {
      this.emit('calendar:delete_error', { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }

  /**
   * Duplicate event to new date
   */
  async duplicateEvent(eventId: string, newStartDate: string): Promise<CalendarEvent> {
    try {
      const event = await this.fetchEventById(eventId);
      const payload: CreateCalendarEventPayload = {
        title: event.title,
        description: event.description,
        eventType: event.eventType,
        startDate: newStartDate,
        endDate: newStartDate, // Will be adjusted based on duration
        location: event.location,
        priority: event.priority,
        category: event.category,
        reminders: event.reminders,
      };

      return await this.createEvent(payload);
    } catch (error) {
      this.emit('calendar:duplicate_error', { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }

  /**
   * Bulk operations on multiple events
   */
  async bulkOperation(operation: BulkCalendarOperation): Promise<void> {
    try {
      const response = await post(`${this.baseUrl}/events/bulk`, operation, this.currentLanguage, { Authorization: `Bearer ${this.authToken}` });

      if (!response.ok) {
        throw new Error(`Failed to perform bulk operation: ${response.statusText}`);
      }

      this.emit('calendar:bulk_operation_complete', { operation });
    } catch (error) {
      this.emit('calendar:bulk_error', { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }

  /**
   * Fetch user preferences
   */
  async fetchPreferences(): Promise<CalendarPreferences> {
    try {
      const response = await get(`${this.baseUrl}/preferences`, this.currentLanguage, { Authorization: `Bearer ${this.authToken}` });

      if (!response.ok) {
        throw new Error(`Failed to fetch preferences: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      this.emit('calendar:fetch_error', { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }

  /**
   * Update user preferences
   */
  async updatePreferences(preferences: Partial<CalendarPreferences>): Promise<void> {
    try {
      const response = await patch(`${this.baseUrl}/preferences`, preferences, this.currentLanguage, { Authorization: `Bearer ${this.authToken}` });

      if (!response.ok) {
        throw new Error(`Failed to update preferences: ${response.statusText}`);
      }

      this.emit('calendar:preferences_updated', preferences);
    } catch (error) {
      this.emit('calendar:preferences_error', { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }

  /**
   * Export calendar in specified format
   */
  async exportCalendar(config: CalendarExportConfig): Promise<string> {
    try {
      const response = await post(`${this.baseUrl}/export`, config, this.currentLanguage, { Authorization: `Bearer ${this.authToken}` });

      if (!response.ok) {
        throw new Error(`Failed to export calendar: ${response.statusText}`);
      }

      const data = await response.json();
      return data.exportUrl || data.data;
    } catch (error) {
      this.emit('calendar:export_error', { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }

  /**
   * Import calendar from file
   */
  async importCalendar(fileData: string): Promise<number> {
    try {
      const response = await post(`${this.baseUrl}/import`, { data: fileData }, this.currentLanguage, { Authorization: `Bearer ${this.authToken}` });

      if (!response.ok) {
        throw new Error(`Failed to import calendar: ${response.statusText}`);
      }

      const data = await response.json();
      return data.importedCount || 0;
    } catch (error) {
      this.emit('calendar:import_error', { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }

  /**
   * Sync calendar with server
   */
  async syncCalendar(): Promise<void> {
    if (this.syncInProgress) {
      return;
    }

    try {
      this.syncInProgress = true;
      const response = await post(`${this.baseUrl}/sync`, { lastSync: this.lastSyncTime }, this.currentLanguage, { Authorization: `Bearer ${this.authToken}` });

      if (!response.ok) {
        throw new Error(`Failed to sync calendar: ${response.statusText}`);
      }

      this.lastSyncTime = Date.now();
      this.emit('calendar:synced', {});
    } catch (error) {
      this.emit('calendar:sync_error', { error: error instanceof Error ? error.message : String(error) });
      throw error;
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Event listener registration
   */
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  /**
   * Remove event listener
   */
  off(event: string, callback: Function): void {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event)!.delete(callback);
    }
  }

  /**
   * Emit event to all listeners
   */
  private emit(event: string, data: any): void {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event)!.forEach((callback) => {
        callback(data);
      });
    }

    // Also dispatch as DOM custom event for Redux integration
    window.dispatchEvent(
      new CustomEvent(event, {
        detail: data,
      })
    );
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): 'connected' | 'connecting' | 'disconnected' {
    if (this.isConnecting) return 'connecting';
    if (this.wsConnection?.readyState === WebSocket.OPEN) return 'connected';
    return 'disconnected';
  }

  /**
   * Reset service state
   */
  reset(): void {
    this.disconnect();
    this.authToken = null;
    this.reconnectAttempts = 0;
    this.eventListeners.clear();
    this.syncInProgress = false;
    this.lastSyncTime = 0;
  }
}

export default CalendarService.getInstance();
