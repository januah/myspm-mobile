/**
 * Notification Service
 * 
 * Singleton service for managing notification operations including:
 * - Fetching notifications with filtering
 * - Managing notification status (read, archive, delete)
 * - Managing user preferences
 * - WebSocket subscription handling
 * - Real-time notification delivery
 * - Batch operations
 * 
 * Follows singleton pattern for centralized notification management
 */

import type {
  Notification,
  NotificationFilter,
  NotificationPreference,
  NotificationError,
  NotificationSummary,
  NotificationsListResponse,
  NotificationResponse,
  BatchNotificationOperation,
} from '../types/notification';

import {
  NOTIFICATION_ERROR_CODES,
  NOTIFICATION_TIMING,
  NOTIFICATION_PAGINATION,
  NOTIFICATION_FEATURE_FLAGS,
  NOTIFICATION_DEFAULT_PREFERENCES,
  NOTIFICATION_SOCKET_EVENTS,
} from '../constants/notification';

import { get, post, patch, del } from './fetchClient';

/**
 * Notification Service Singleton
 */
class NotificationServiceImpl {
  private static instance: NotificationServiceImpl;

  // Configuration
  private baseUrl: string = 'https://api.myspm.app/v1/notifications';
  private authToken: string | null = null;
  private currentLanguage: string = 'en';
  private userId: string | null = null;

  // State
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private retryQueue: Map<string, number> = new Map();

  // WebSocket
  private ws: WebSocket | null = null;
  private wsUrl: string = 'wss://api.myspm.app/v1/notifications';

  constructor() {
    // Private constructor for singleton
  }

  /**
   * Get singleton instance
   */
  static getInstance(): NotificationServiceImpl {
    if (!NotificationServiceImpl.instance) {
      NotificationServiceImpl.instance = new NotificationServiceImpl();
    }
    return NotificationServiceImpl.instance;
  }

  /**
   * Initialize the service with auth token and user ID
   */
  initialize(authToken: string, userId: string): void {
    this.authToken = authToken;
    this.userId = userId;

    // Initialize WebSocket if feature enabled
    if (NOTIFICATION_FEATURE_FLAGS.ENABLE_REAL_TIME) {
      this.connectWebSocket();
    }
  }

  /**
   * Fetch notifications with optional filtering
   */
  async fetchNotifications(
    filter: NotificationFilter = {}
  ): Promise<NotificationsListResponse> {
    try {
      const queryParams = this.buildQueryParams(filter);
      const response = await get(`${this.baseUrl}?${queryParams}`, this.currentLanguage, { Authorization: `Bearer ${this.authToken}` });

      if (!response.ok) {
        throw this.handleApiError(response);
      }

      const data: NotificationsListResponse = await response.json();
      return data;
    } catch (error) {
      throw this.handleError('FETCH_FAILED', error);
    }
  }

  /**
   * Fetch a single notification by ID
   */
  async fetchNotification(notificationId: string): Promise<Notification> {
    try {
      const response = await get(`${this.baseUrl}/${notificationId}`, this.currentLanguage, { Authorization: `Bearer ${this.authToken}` });

      if (!response.ok) {
        throw this.handleApiError(response);
      }

      const data: NotificationResponse = await response.json();
      return data.notification;
    } catch (error) {
      throw this.handleError('FETCH_FAILED', error);
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<Notification> {
    try {
      const response = await post(`${this.baseUrl}/${notificationId}/read`, {}, this.currentLanguage, { Authorization: `Bearer ${this.authToken}` });

      if (!response.ok) {
        throw this.handleApiError(response);
      }

      const data: NotificationResponse = await response.json();
      return data.notification;
    } catch (error) {
      throw this.handleError('UPDATE_FAILED', error);
    }
  }

  /**
   * Mark notification as unread
   */
  async markAsUnread(notificationId: string): Promise<Notification> {
    try {
      const response = await post(`${this.baseUrl}/${notificationId}/unread`, {}, this.currentLanguage, { Authorization: `Bearer ${this.authToken}` });

      if (!response.ok) {
        throw this.handleApiError(response);
      }

      const data: NotificationResponse = await response.json();
      return data.notification;
    } catch (error) {
      throw this.handleError('UPDATE_FAILED', error);
    }
  }

  /**
   * Archive notification
   */
  async archiveNotification(notificationId: string): Promise<Notification> {
    try {
      const response = await post(`${this.baseUrl}/${notificationId}/archive`, {}, this.currentLanguage, { Authorization: `Bearer ${this.authToken}` });

      if (!response.ok) {
        throw this.handleApiError(response);
      }

      const data: NotificationResponse = await response.json();
      return data.notification;
    } catch (error) {
      throw this.handleError('UPDATE_FAILED', error);
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const response = await del(`${this.baseUrl}/${notificationId}`, this.currentLanguage, { Authorization: `Bearer ${this.authToken}` });

      if (!response.ok) {
        throw this.handleApiError(response);
      }
    } catch (error) {
      throw this.handleError('DELETE_FAILED', error);
    }
  }

  /**
   * Snooze notification
   */
  async snoozeNotification(notificationId: string, minutes: number): Promise<Notification> {
    try {
      const snoozedUntil = new Date();
      snoozedUntil.setMinutes(snoozedUntil.getMinutes() + minutes);

      const response = await fetch(
        `${this.baseUrl}/${notificationId}/snooze`,
        {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({
            snoozedUntil: snoozedUntil.toISOString(),
          }),
        }
      );

      if (!response.ok) {
        throw this.handleApiError(response);
      }

      const data: NotificationResponse = await response.json();
      return data.notification;
    } catch (error) {
      throw this.handleError('UPDATE_FAILED', error);
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<NotificationSummary> {
    try {
      const response = await post(`${this.baseUrl}/read-all`, {}, this.currentLanguage, { Authorization: `Bearer ${this.authToken}` });

      if (!response.ok) {
        throw this.handleApiError(response);
      }

      const data = await response.json();
      return data.summary;
    } catch (error) {
      throw this.handleError('UPDATE_FAILED', error);
    }
  }

  /**
   * Batch operation on notifications
   */
  async batchOperation(operation: BatchNotificationOperation): Promise<NotificationSummary> {
    try {
      const response = await post(`${this.baseUrl}/batch`, operation, this.currentLanguage, { Authorization: `Bearer ${this.authToken}` });

      if (!response.ok) {
        throw this.handleApiError(response);
      }

      const data = await response.json();
      return data.summary;
    } catch (error) {
      throw this.handleError('BATCH_OPERATION_FAILED', error);
    }
  }

  /**
   * Get notification preferences
   */
  async getPreferences(): Promise<NotificationPreference[]> {
    try {
      const response = await get(`${this.baseUrl}/preferences`, this.currentLanguage, { Authorization: `Bearer ${this.authToken}` });

      if (!response.ok) {
        throw this.handleApiError(response);
      }

      const data = await response.json();
      return data.preferences;
    } catch (error) {
      throw this.handleError('FETCH_FAILED', error);
    }
  }

  /**
   * Update notification preference
   */
  async updatePreference(preference: NotificationPreference): Promise<NotificationPreference> {
    try {
      const response = await patch(`${this.baseUrl}/preferences/${preference.target}`, preference, this.currentLanguage, { Authorization: `Bearer ${this.authToken}` });

      if (!response.ok) {
        throw this.handleApiError(response);
      }

      const data = await response.json();
      return data.preference;
    } catch (error) {
      throw this.handleError('UPDATE_FAILED', error);
    }
  }

  /**
   * Reset preferences to defaults
   */
  async resetPreferences(): Promise<NotificationPreference[]> {
    try {
      const response = await post(`${this.baseUrl}/preferences/reset`, {}, this.currentLanguage, { Authorization: `Bearer ${this.authToken}` });

      if (!response.ok) {
        throw this.handleApiError(response);
      }

      const data = await response.json();
      return data.preferences;
    } catch (error) {
      throw this.handleError('UPDATE_FAILED', error);
    }
  }

  /**
   * Connect WebSocket for real-time notifications
   */
  private connectWebSocket(): void {
    if (!this.authToken || !this.userId) {
      console.warn('Cannot connect WebSocket: Missing auth token or user ID');
      return;
    }

    try {
      const wsUrlWithAuth = `${this.wsUrl}?token=${this.authToken}&userId=${this.userId}`;
      this.ws = new WebSocket(wsUrlWithAuth);

      this.ws.onopen = this.handleWebSocketOpen.bind(this);
      this.ws.onmessage = this.handleWebSocketMessage.bind(this);
      this.ws.onerror = this.handleWebSocketError.bind(this);
      this.ws.onclose = this.handleWebSocketClose.bind(this);
    } catch (error) {
      this.handleError('WS_CONNECTION_FAILED', error);
    }
  }

  /**
   * Handle WebSocket open
   */
  private handleWebSocketOpen(): void {
    console.log('WebSocket connected');
    this.isConnected = true;
    this.reconnectAttempts = 0;

    // Send subscription request
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: NOTIFICATION_SOCKET_EVENTS.CLIENT.SUBSCRIBE,
          data: {
            categories: ['assignment', 'grade', 'message', 'teacher', 'announcement'],
          },
        })
      );
    }
  }

  /**
   * Handle WebSocket message
   */
  private handleWebSocketMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case NOTIFICATION_SOCKET_EVENTS.SERVER.NEW_NOTIFICATION:
          this.handleNewNotification(data.notification);
          break;

        case NOTIFICATION_SOCKET_EVENTS.SERVER.NOTIFICATION_UPDATED:
          this.handleNotificationUpdated(data.notification);
          break;

        case NOTIFICATION_SOCKET_EVENTS.SERVER.SYNC_REQUIRED:
          this.handleSyncRequired();
          break;

        default:
          break;
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  }

  /**
   * Handle WebSocket error
   */
  private handleWebSocketError(): void {
    console.error('WebSocket error occurred');
    this.handleError('WS_CONNECTION_FAILED', new Error('WebSocket error'));
  }

  /**
   * Handle WebSocket close
   */
  private handleWebSocketClose(): void {
    console.log('WebSocket disconnected');
    this.isConnected = false;

    // Attempt reconnection with exponential backoff
    if (this.reconnectAttempts < NOTIFICATION_TIMING.WS_RECONNECT_DELAYS.length) {
      const delay = NOTIFICATION_TIMING.WS_RECONNECT_DELAYS[this.reconnectAttempts];
      setTimeout(() => {
        console.log(`Attempting WebSocket reconnect (attempt ${this.reconnectAttempts + 1})`);
        this.reconnectAttempts++;
        this.connectWebSocket();
      }, delay);
    }
  }

  /**
   * Handle new notification from WebSocket
   */
  private handleNewNotification(notification: Notification): void {
    // Dispatch event that Redux will listen to
    const event = new CustomEvent('notification:new', { detail: notification });
    window.dispatchEvent(event);
  }

  /**
   * Handle notification update from WebSocket
   */
  private handleNotificationUpdated(notification: Notification): void {
    const event = new CustomEvent('notification:updated', { detail: notification });
    window.dispatchEvent(event);
  }

  /**
   * Handle sync required from server
   */
  private handleSyncRequired(): void {
    const event = new CustomEvent('notification:sync_required');
    window.dispatchEvent(event);
  }

  /**
   * Disconnect WebSocket
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }

  /**
   * Build query parameters from filter
   */
  private buildQueryParams(filter: NotificationFilter): string {
    const params = new URLSearchParams();

    if (filter.categories?.length) {
      params.append('categories', filter.categories.join(','));
    }

    if (filter.actionTypes?.length) {
      params.append('actionTypes', filter.actionTypes.join(','));
    }

    if (filter.statuses?.length) {
      params.append('statuses', filter.statuses.join(','));
    }

    if (filter.minPriority) {
      params.append('minPriority', filter.minPriority);
    }

    if (filter.searchText) {
      params.append('search', filter.searchText);
    }

    if (filter.teacherId) {
      params.append('teacherId', filter.teacherId);
    }

    if (filter.assignmentId) {
      params.append('assignmentId', filter.assignmentId);
    }

    params.append('limit', String(filter.limit || NOTIFICATION_PAGINATION.DEFAULT_LIMIT));
    params.append('offset', String(filter.offset || NOTIFICATION_PAGINATION.INITIAL_OFFSET));

    if (filter.excludeArchived) {
      params.append('excludeArchived', 'true');
    }

    return params.toString();
  }

  /**
   * Get request headers
   */
  private getHeaders(): Headers {
    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    if (this.authToken) {
      headers.append('Authorization', `Bearer ${this.authToken}`);
    }

    return headers;
  }

  /**
   * Handle API errors
   */
  private handleApiError(response: Response): NotificationError {
    const statusCode = response.status;
    let errorCode = 'SERVER_ERROR';

    if (statusCode === 401) {
      errorCode = 'UNAUTHORIZED';
    } else if (statusCode === 404) {
      errorCode = 'NOTIFICATION_NOT_FOUND';
    } else if (statusCode === 400) {
      errorCode = 'INVALID_FILTER';
    }

    const errorConfig =
      NOTIFICATION_ERROR_CODES[errorCode as keyof typeof NOTIFICATION_ERROR_CODES] ||
      NOTIFICATION_ERROR_CODES.SERVER_ERROR;

    return {
      code: errorConfig.code,
      message: errorConfig.message,
      statusCode,
      timestamp: new Date(),
      retryable: errorConfig.retryable,
    };
  }

  /**
   * Handle errors with retry logic
   */
  private handleError(errorType: string, error: unknown): NotificationError {
    const errorConfig =
      NOTIFICATION_ERROR_CODES[errorType as keyof typeof NOTIFICATION_ERROR_CODES] ||
      NOTIFICATION_ERROR_CODES.SERVER_ERROR;

    const notificationError: NotificationError = {
      code: errorConfig.code,
      message: errorConfig.message,
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date(),
      retryable: errorConfig.retryable,
    };

    console.error(`[${notificationError.code}] ${notificationError.message}`, error);

    return notificationError;
  }

  /**
   * Check if connected
   */
  getIsConnected(): boolean {
    return this.isConnected;
  }
}

/**
 * Export singleton instance
 */
export const NotificationService = NotificationServiceImpl.getInstance();
