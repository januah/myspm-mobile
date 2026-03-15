/**
 * NotificationCenter Component
 * 
 * Comprehensive notification viewing and management interface
 * Features:
 * - List of all notifications with filtering/search
 * - Categorized view (assignments, grades, messages, etc.)
 * - Mark read/unread, archive, delete, snooze
 * - Empty states with helpful messaging
 * - Pull-to-refresh functionality
 * - Real-time updates
 * 
 * Usage:
 * <NotificationCenter />
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  RefreshControl,
  Modal,
  ActivityIndicator,
} from 'react-native';

import type { Notification, NotificationCategory } from '../../types/notification';
import { useNotifications } from '../../hooks/notifications/useNotifications';
import { NotificationItem } from './NotificationItem';
import { NOTIFICATION_EMPTY_STATES, NOTIFICATION_CATEGORY_COLORS } from '../../constants/notification';

export interface NotificationCenterProps {
  /** Whether center is visible */
  visible: boolean;

  /** Callback when closed */
  onClose: () => void;

  /** Initial category filter */
  initialCategory?: NotificationCategory | 'all';

  /** Whether to show action buttons in items */
  showActions?: boolean;
}

/**
 * NotificationCenter Component
 */
export const NotificationCenter = React.memo(
  ({
    visible,
    onClose,
    initialCategory = 'all',
    showActions = true,
  }: NotificationCenterProps) => {
    const {
      notifications,
      unreadCount,
      loading,
      error,
      fetchNotifications,
      markAsRead,
      archiveNotification,
      deleteNotification,
      snoozeNotification,
    } = useNotifications();

    const [selectedCategory, setSelectedCategory] = useState<NotificationCategory | 'all'>(initialCategory);
    const [refreshing, setRefreshing] = useState(false);
    const [searchText, setSearchText] = useState('');

    // Load notifications on mount
    useEffect(() => {
      if (visible) {
        handleRefresh();
      }
    }, [visible]);

    // Filter notifications by category and search
    const filteredNotifications = React.useMemo(() => {
      return notifications.filter((notification) => {
        const categoryMatch =
          selectedCategory === 'all' || notification.category === selectedCategory;
        const searchMatch =
          !searchText ||
          notification.title.toLowerCase().includes(searchText.toLowerCase()) ||
          notification.message.toLowerCase().includes(searchText.toLowerCase());

        return categoryMatch && searchMatch;
      });
    }, [notifications, selectedCategory, searchText]);

    const handleRefresh = useCallback(async () => {
      setRefreshing(true);
      try {
        await fetchNotifications({
          categories: selectedCategory === 'all' ? undefined : [selectedCategory as NotificationCategory],
        });
      } finally {
        setRefreshing(false);
      }
    }, [fetchNotifications, selectedCategory]);

    const handleMarkAsRead = useCallback(
      async (id: string) => {
        await markAsRead(id);
      },
      [markAsRead]
    );

    const handleArchive = useCallback(
      async (id: string) => {
        await archiveNotification(id);
      },
      [archiveNotification]
    );

    const handleDelete = useCallback(
      async (id: string) => {
        await deleteNotification(id);
      },
      [deleteNotification]
    );

    const handleSnooze = useCallback(
      async (id: string, minutes: number) => {
        await snoozeNotification(id, minutes);
      },
      [snoozeNotification]
    );

    const categories: Array<NotificationCategory | 'all'> = [
      'all',
      'assignment',
      'grade',
      'message',
      'teacher',
      'announcement',
      'deadline',
      'achievement',
      'image_upload',
      'system',
    ];

    const getCategoryLabel = (category: NotificationCategory | 'all'): string => {
      const labels: Record<string, string> = {
        all: 'All',
        assignment: 'Assignments',
        grade: 'Grades',
        message: 'Messages',
        teacher: 'Teachers',
        announcement: 'Announcements',
        deadline: 'Deadlines',
        achievement: 'Achievements',
        image_upload: 'Images',
        system: 'System',
      };
      return labels[category] || category;
    };

    const emptyState = filteredNotifications.length === 0 ?
      searchText ? NOTIFICATION_EMPTY_STATES.FILTERED :
      selectedCategory === 'all' ? NOTIFICATION_EMPTY_STATES.ALL :
      NOTIFICATION_EMPTY_STATES.FILTERED
      : null;

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
      },
      header: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
      },
      headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      unreadBadge: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
      },
      unreadBadgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
      },
      categoryFilter: {
        paddingVertical: 8,
        marginBottom: 8,
      },
      categoryScroll: {
        paddingHorizontal: 8,
      },
      categoryButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        marginHorizontal: 4,
      },
      categoryButtonActive: {
        backgroundColor: '#3B82F6',
      },
      categoryButtonText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#6B7280',
      },
      categoryButtonTextActive: {
        color: '#FFFFFF',
      },
      searchContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
      },
      searchInput: {
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 14,
        color: '#1F2937',
      },
      listContainer: {
        flex: 1,
      },
      emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
      },
      emptyIcon: {
        fontSize: 60,
        marginBottom: 16,
      },
      emptyTitle: {
        fontSize: 18,
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
      closeButton: {
        padding: 8,
      },
      closeButtonText: {
        fontSize: 24,
        color: '#1F2937',
      },
    });

    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.headerTitle, { flexDirection: 'row' }]}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#1F2937' }}>
                Notifications
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount} Unread</Text>
              </View>
            )}
          </View>

          {/* Category Filter */}
          <View style={styles.categoryFilter}>
            <FlatList
              data={categories}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    selectedCategory === item && styles.categoryButtonActive,
                  ]}
                  onPress={() => setSelectedCategory(item)}
              >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === item && styles.categoryButtonTextActive,
                    ]}
                  >
                    {getCategoryLabel(item)}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
              horizontal
              scrollEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            />
          </View>

          {/* Notifications List */}
          {loading && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />
            </View>
          ) : filteredNotifications.length === 0 && emptyState ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>{emptyState.icon}</Text>
              <Text style={styles.emptyTitle}>{emptyState.title}</Text>
              <Text style={styles.emptyDescription}>{emptyState.description}</Text>
            </View>
          ) : (
            <FlatList
              data={filteredNotifications}
              renderItem={({ item }) => (
                <NotificationItem
                  notification={item}
                  onMarkAsRead={handleMarkAsRead}
                  onArchive={showActions ? handleArchive : undefined}
                  onDelete={showActions ? handleDelete : undefined}
                  onSnooze={showActions ? handleSnooze : undefined}
                  showSwipeActions={showActions}
                />
              )}
              keyExtractor={(item) => item.id}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  tintColor="#3B82F6"
                />
              }
              style={styles.listContainer}
              contentContainerStyle={{ flexGrow: 1 }}
            />
          )}

          {/* Error Display */}
          {error && (
            <View style={{ padding: 16, backgroundColor: '#FEE2E2', borderTopWidth: 1, borderTopColor: '#FECACA' }}>
              <Text style={{ color: '#DC2626', fontWeight: '500' }}>
                {error.message}
              </Text>
            </View>
          )}
        </View>
      </Modal>
    );
  }
);

NotificationCenter.displayName = 'NotificationCenter';
