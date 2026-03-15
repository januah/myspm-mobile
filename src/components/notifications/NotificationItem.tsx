/**
 * NotificationItem Component
 * 
 * Individual notification item for display in lists/centers
 * Features:
 * - Category-based color coding
 * - Read/unread state with visual indicator
 * - Timestamp display (relative time)
 * - Swipe actions (archive, delete, snooze)
 * - Optional action buttons
 * - Avatar/icon display
 * 
 * Usage:
 * <NotificationItem
 *   notification={notification}
 *   onPress={() => handlePress(notification)}
 *   onMarkAsRead={() => handleMarkAsRead(notification.id)}
 * />
 */

import React, { useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  PanResponder,
  GestureResponderEvent,
} from 'react-native';
import type { Notification } from '../../types/notification';
import { NOTIFICATION_CATEGORY_COLORS, NOTIFICATION_TYPE_CONFIG } from '../../constants/notification';

export interface NotificationItemProps {
  /** Notification to display */
  notification: Notification;

  /** Callback when pressed */
  onPress?: (notification: Notification) => void;

  /** Callback to mark as read */
  onMarkAsRead?: (id: string) => void;

  /** Callback to archive */
  onArchive?: (id: string) => void;

  /** Callback to delete */
  onDelete?: (id: string) => void;

  /** Callback to snooze */
  onSnooze?: (id: string, minutes: number) => void;

  /** Whether to show swipe actions */
  showSwipeActions?: boolean;

  /** Custom container style */
  containerStyle?: any;

  /** Hide timestamp */
  hideTimestamp?: boolean;

  /** Hide category icon */
  hideIcon?: boolean;
}

/**
 * NotificationItem Component
 */
export const NotificationItem = React.memo(
  ({
    notification,
    onPress,
    onMarkAsRead,
    onArchive,
    onDelete,
    onSnooze,
    showSwipeActions = true,
    containerStyle,
    hideTimestamp = false,
    hideIcon = false,
  }: NotificationItemProps) => {
    const isUnread = notification.status === 'unread';
    const typeConfig = NOTIFICATION_TYPE_CONFIG[notification.actionType];
    const categoryColor = NOTIFICATION_CATEGORY_COLORS[notification.category];

    // Get time ago string
    const getTimeAgo = useCallback(() => {
      const now = new Date();
      const created = new Date(notification.createdAt);
      const diffMs = now.getTime() - created.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

      return created.toLocaleDateString();
    }, [notification.createdAt]);

    const handlePress = useCallback(() => {
      if (isUnread && onMarkAsRead) {
        onMarkAsRead(notification.id);
      }
      if (onPress) {
        onPress(notification);
      }
    }, [isUnread, notification, onPress, onMarkAsRead]);

    const handleArchive = useCallback(
      (event: GestureResponderEvent) => {
        event.stopPropagation?.();
        if (onArchive) {
          onArchive(notification.id);
        }
      },
      [notification.id, onArchive]
    );

    const handleDelete = useCallback(
      (event: GestureResponderEvent) => {
        event.stopPropagation?.();
        if (onDelete) {
          onDelete(notification.id);
        }
      },
      [notification.id, onDelete]
    );

    const handleSnooze = useCallback(
      (event: GestureResponderEvent) => {
        event.stopPropagation?.();
        if (onSnooze) {
          onSnooze(notification.id, 30); // Default 30 minutes
        }
      },
      [notification.id, onSnooze]
    );

    const styles = StyleSheet.create({
      container: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        backgroundColor: isUnread ? '#F9FAFB' : '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
      },
      iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: categoryColor,
        opacity: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
      },
      icon: {
        fontSize: 20,
      },
      content: {
        flex: 1,
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
      },
      title: {
        fontSize: 14,
        fontWeight: isUnread ? '600' : '500',
        color: '#1F2937',
        flex: 1,
        marginRight: 8,
      },
      unreadIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: categoryColor,
      },
      message: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
        marginBottom: 6,
      },
      footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      time: {
        fontSize: 12,
        color: '#9CA3AF',
      },
      actions: {
        flexDirection: 'row',
        gap: 8,
      },
      actionButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        backgroundColor: '#E5E7EB',
      },
      actionButtonText: {
        fontSize: 12,
        color: '#4B5563',
        fontWeight: '500',
      },
      deleteButton: {
        backgroundColor: '#FEE2E2',
      },
      deleteButtonText: {
        color: '#DC2626',
      },
    });

    return (
      <TouchableOpacity
        style={[styles.container, containerStyle]}
        onPress={handlePress}
        activeOpacity={0.6}
      >
        {/* Icon */}
        {!hideIcon && (
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{typeConfig.icon}</Text>
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={2}>
              {notification.title}
            </Text>
            {isUnread && <View style={styles.unreadIndicator} />}
          </View>

          {/* Message */}
          <Text style={styles.message} numberOfLines={2}>
            {notification.message}
          </Text>

          {/* Footer */}
          <View style={styles.footer}>
            {!hideTimestamp && <Text style={styles.time}>{getTimeAgo()}</Text>}

            {/* Swipe Actions */}
            {showSwipeActions && (
              <View style={styles.actions}>
                {onSnooze && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleSnooze}
                  >
                    <Text style={styles.actionButtonText}>Snooze</Text>
                  </TouchableOpacity>
                )}

                {onArchive && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleArchive}
                  >
                    <Text style={styles.actionButtonText}>Archive</Text>
                  </TouchableOpacity>
                )}

                {onDelete && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={handleDelete}
                  >
                    <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);

NotificationItem.displayName = 'NotificationItem';
