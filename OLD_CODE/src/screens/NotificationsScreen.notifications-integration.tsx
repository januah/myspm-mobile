/**
 * NotificationsScreen Integration Example
 * 
 * Complete example showing how to integrate the notification system into a screen
 * Demonstrates:
 * - NotificationCenter modal integration
 * - NotificationBadge on header button
 * - Filtering and managing notifications
 * - Real-time updates from WebSocket
 * - Preference management
 * - Empty states and error handling
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useNotifications } from '../hooks/notifications/useNotifications';
import { NotificationCenter } from '../components/notifications/NotificationCenter';
import { NotificationBadge } from '../components/notifications/NotificationBadge';
import { NotificationItem } from '../components/notifications/NotificationItem';

import type { Notification, NotificationCategory } from '../types/notification';

/**
 * NotificationsScreen Component
 */
export const NotificationsScreen = () => {
  const {
    notifications,
    unreadCount,
    summary,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    archiveNotification,
    deleteNotification,
    snoozeNotification,
    clearErrorFn,
  } = useNotifications();

  const [centerlVisible, setCenterVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<NotificationCategory | 'all'>('all');

  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = useCallback(async () => {
    await fetchNotifications({
      categories: selectedFilter === 'all' ? undefined : [selectedFilter as NotificationCategory],
      limit: 20,
    });
  }, [fetchNotifications, selectedFilter]);

  // Filter notifications
  const filteredNotifications = React.useMemo(() => {
    if (selectedFilter === 'all') return notifications;
    return notifications.filter((n) => n.category === selectedFilter);
  }, [notifications, selectedFilter]);

  const handleNotificationPress = useCallback((notification: Notification) => {
    if (notification.status === 'unread') {
      markAsRead(notification.id);
    }

    // Navigate to related entity
    if (notification.relatedIds.assignmentId) {
      // Navigate to assignment detail
      console.log('Navigate to assignment:', notification.relatedIds.assignmentId);
    } else if (notification.relatedIds.teacherId) {
      // Navigate to teacher profile
      console.log('Navigate to teacher:', notification.relatedIds.teacherId);
    }
  }, [markAsRead]);

  const handleArchive = useCallback((id: string) => {
    archiveNotification(id);
  }, [archiveNotification]);

  const handleDelete = useCallback((id: string) => {
    deleteNotification(id);
  }, [deleteNotification]);

  const handleSnooze = useCallback((id: string, minutes: number) => {
    snoozeNotification(id, minutes);
  }, [snoozeNotification]);

  const renderNotificationItem = useCallback(
    ({ item }: { item: Notification }) => (
      <NotificationItem
        notification={item}
        onPress={handleNotificationPress}
        onMarkAsRead={markAsRead}
        onArchive={handleArchive}
        onDelete={handleDelete}
        onSnooze={handleSnooze}
        showSwipeActions
      />
    ),
    [handleNotificationPress, markAsRead, handleArchive, handleDelete, handleSnooze]
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
      backgroundColor: '#F9FAFB',
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: '#1F2937',
      marginBottom: 12,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    statItem: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: '#F3F4F6',
    },
    statLabel: {
      fontSize: 12,
      color: '#6B7280',
      marginBottom: 4,
    },
    statValue: {
      fontSize: 18,
      fontWeight: '700',
      color: '#1F2937',
    },
    filterContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
    },
    filterLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: '#6B7280',
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    filterButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    filterButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      backgroundColor: '#E5E7EB',
    },
    filterButtonActive: {
      backgroundColor: '#3B82F6',
    },
    filterButtonText: {
      fontSize: 13,
      fontWeight: '500',
      color: '#4B5563',
    },
    filterButtonTextActive: {
      color: '#FFFFFF',
    },
    contentContainer: {
      flex: 1,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: 8,
      textAlign: 'center',
    },
    emptyDescription: {
      fontSize: 14,
      color: '#6B7280',
      textAlign: 'center',
      lineHeight: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: '#FEE2E2',
      borderBottomWidth: 1,
      borderBottomColor: '#FECACA',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    errorText: {
      color: '#DC2626',
      fontWeight: '500',
      flex: 1,
    },
    closeErrorButton: {
      paddingHorizontal: 8,
    },
    closeErrorButtonText: {
      color: '#DC2626',
      fontSize: 18,
      fontWeight: '600',
    },
    centerButton: {
      position: 'absolute',
      top: 20,
      right: 16,
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Unread</Text>
            <Text style={styles.statValue}>{unreadCount}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total</Text>
            <Text style={styles.statValue}>{notifications.length}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Urgent</Text>
            <Text style={styles.statValue}>{summary.byPriority.urgent}</Text>
          </View>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Category</Text>
        <View style={styles.filterButtons}>
          {['all', 'assignment', 'grade', 'message', 'announcement'].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.filterButton,
                selectedFilter === cat && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(cat as NotificationCategory | 'all')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilter === cat && styles.filterButtonTextActive,
                ]}
              >
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error.message}</Text>
          <TouchableOpacity style={styles.closeErrorButton} onPress={clearErrorFn}>
            <Text style={styles.closeErrorButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : filteredNotifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyTitle}>No Notifications</Text>
          <Text style={styles.emptyDescription}>
            {selectedFilter === 'all'
              ? "You're all caught up! Check back later."
              : `No ${selectedFilter} notifications yet.`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          style={styles.contentContainer}
          contentContainerStyle={{ flexGrow: 1 }}
          scrollEnabled={true}
        />
      )}

      {/* Notification Center Button (Floating) */}
      <TouchableOpacity
        style={styles.centerButton}
        onPress={() => setCenterVisible(true)}
      >
        <View>
          <Text style={{ fontSize: 28 }}>🔔</Text>
          <NotificationBadge
            count={unreadCount}
            pulse={summary.hasUrgent}
            size="small"
          />
        </View>
      </TouchableOpacity>

      {/* Notification Center Modal */}
      <NotificationCenter
        visible={centerlVisible}
        onClose={() => setCenterVisible(false)}
        initialCategory={selectedFilter}
      />
    </View>
  );
};

export default NotificationsScreen;
