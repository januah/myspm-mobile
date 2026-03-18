import React, { useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationCenter, NotificationSettings } from '../components/notifications';

type ProfileTab = 'overview' | 'notifications' | 'settings';

export const ProfileScreenNotificationsIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<ProfileTab>('overview');
  const { fcmToken, isInitialized, unreadCount, preferences, isTokenRefreshing } =
    useNotifications({
      autoInitialize: true,
      userId: 'user123', // In real app, get from auth state
      onNotification: handleIncomingNotification,
    });

  function handleIncomingNotification(notification: any) {
    // Handle notification received while app is in foreground
    console.log('Notification received:', notification);
    // Could trigger UI updates, navigation, etc.
  }

  const handleNotificationPress = useCallback((notification: any) => {
    // Handle notification tap - navigate to relevant screen
    if (notification.deepLink) {
      // Use router to navigate: router.push(notification.deepLink);
      console.log('Navigate to:', notification.deepLink);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.tabActive]}
          onPress={() => setActiveTab('overview')}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'overview' && styles.tabLabelActive,
            ]}
          >
            Overview
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'notifications' && styles.tabActive]}
          onPress={() => setActiveTab('notifications')}
        >
          <View style={styles.tabLabelContainer}>
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'notifications' && styles.tabLabelActive,
              ]}
            >
              Notifications
            </Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'settings' && styles.tabActive]}
          onPress={() => setActiveTab('settings')}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'settings' && styles.tabLabelActive,
            ]}
          >
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' && (
          <View style={styles.section}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>User Profile</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Display Name</Text>
                <Text style={styles.infoValue}>John Student</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>john@example.com</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Subscription</Text>
                <Text style={styles.infoValue}>Premium Plan</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>FCM Status</Text>
                <Text style={[styles.infoValue, isInitialized && styles.statusActive]}>
                  {isInitialized ? '✓ Connected' : 'Connecting...'}
                </Text>
              </View>
            </View>

            {isInitialized && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Notification Summary</Text>
                <View style={styles.summaryGrid}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>{unreadCount}</Text>
                    <Text style={styles.summaryLabel}>Unread</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>
                      {preferences?.enabledCategories.length || 0}
                    </Text>
                    <Text style={styles.summaryLabel}>Categories</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>
                      {preferences?.quiet_hours ? '✓' : '✗'}
                    </Text>
                    <Text style={styles.summaryLabel}>Quiet Hours</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}

        {activeTab === 'notifications' && (
          <NotificationCenter onNotificationPress={handleNotificationPress} />
        )}

        {activeTab === 'settings' && (
          <View style={styles.section}>
            <NotificationSettings />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#4D96FF',
  },
  tabLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999999',
    textAlign: 'center',
  },
  tabLabelActive: {
    color: '#4D96FF',
  },
  unreadBadge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  infoLabel: {
    fontSize: 13,
    color: '#999999',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  statusActive: {
    color: '#6BCB77',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4D96FF',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#999999',
    fontWeight: '500',
  },
});
