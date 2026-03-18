import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNotifications } from '../hooks/useNotifications';
import NotificationService from '../services/notificationService';

interface PracticeSession {
  id: string;
  title: string;
  duration: number;
  completed: boolean;
}

export const PracticeScreenNotificationsIntegration: React.FC = () => {
  const [session, setSession] = useState<PracticeSession>({
    id: 'session-1',
    title: 'Advanced Mathematics',
    duration: 45,
    completed: false,
  });
  const [sessionStartTime] = useState(Date.now());
  const [sessionTime, setSessionTime] = useState(0);
  const [achievementUnlocked, setAchievementUnlocked] = useState<string | null>(null);

  const { isInitialized, unreadCount } = useNotifications({
    autoInitialize: true,
    userId: 'user123',
  });

  // Update session time
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStartTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const completeSession = async () => {
    setSession({ ...session, completed: true });

    // Simulate achievement unlock (e.g., 10-day streak)
    const unlockedAchievement = 'Gold Streak Badge';
    setAchievementUnlocked(unlockedAchievement);

    // Send notification about achievement
    if (isInitialized) {
      try {
        // In a real app, the backend would handle this
        // But we can demonstrate the service layer sending notifications
        await NotificationService.getInstance().updatePreferences({
          enabledCategories: ['achievement_unlocked'],
          quiet_hours: undefined,
        });

        // Log that achievement notification would be sent
        console.log('Achievement notification queued:', unlockedAchievement);

        // Show local alert as demo
        Alert.alert(
          '🎉 Achievement Unlocked!',
          `You've earned the "${unlockedAchievement}" badge!\n\nYour notification system recorded this achievement.`,
          [{ text: 'Awesome!', onPress: () => {} }]
        );
      } catch (error) {
        console.error('Failed to log achievement:', error);
      }
    }
  };

  const handleStreakReminder = async () => {
    if (isInitialized) {
      try {
        // Demonstrate sending a streak reminder notification
        console.log('Streak reminder notification triggered');
        Alert.alert(
          '🔥 Streak Reminder',
          'Keep your practice streak going! Complete one more session today.',
          [{ text: 'Start Practice', onPress: () => {} }]
        );
      } catch (error) {
        console.error('Failed to send streak reminder:', error);
      }
    }
  };

  const handleExamNotification = async () => {
    if (isInitialized) {
      try {
        // Demonstrate exam-related notification
        console.log('Exam scheduled notification triggered');
        Alert.alert(
          '📅 Upcoming Exam',
          'Your Math exam is scheduled for next Monday. Start preparing now!',
          [
            { text: 'Later', onPress: () => {} },
            { text: 'View Exam', onPress: () => {} },
          ]
        );
      } catch (error) {
        console.error('Failed to send exam notification:', error);
      }
    }
  };

  const handleLeaderboardUpdate = async () => {
    if (isInitialized) {
      try {
        // Demonstrate leaderboard notification
        console.log('Leaderboard update notification triggered');
        Alert.alert(
          '🏆 Leaderboard Update',
          'You moved up to position #5! Keep practicing to climb higher.',
          [{ text: 'View Leaderboard', onPress: () => {} }]
        );
      } catch (error) {
        console.error('Failed to send leaderboard notification:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Practice Session</Text>
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Session Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{session.title}</Text>
          <View style={styles.sessionInfo}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Time Spent</Text>
              <Text style={styles.infoValue}>{formatTime(sessionTime)}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{session.duration} min</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text
                style={[
                  styles.infoValue,
                  session.completed && styles.statusCompleted,
                ]}
              >
                {session.completed ? 'Complete' : 'In Progress'}
              </Text>
            </View>
          </View>
        </View>

        {/* Achievement Display */}
        {achievementUnlocked && (
          <View style={[styles.card, styles.achievementCard]}>
            <Text style={styles.achievementIcon}>🎉</Text>
            <Text style={styles.achievementTitle}>Achievement Unlocked!</Text>
            <Text style={styles.achievementSubtitle}>{achievementUnlocked}</Text>
            <Text style={styles.achievementText}>
              A notification about this achievement has been sent to your notification history.
            </Text>
          </View>
        )}

        {/* Notification System Status */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notification System</Text>
          <View style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <View
                style={[
                  styles.statusDot,
                  isInitialized && styles.statusDotActive,
                ]}
              />
              <View style={styles.statusTextContainer}>
                <Text style={styles.statusTitle}>
                  {isInitialized ? 'Connected' : 'Connecting...'}
                </Text>
                <Text style={styles.statusDescription}>
                  {isInitialized
                    ? 'Ready to receive notifications'
                    : 'Setting up notification service'}
                </Text>
              </View>
            </View>
            <View style={styles.statusItem}>
              <View
                style={[
                  styles.statusDot,
                  styles.statusDotInfo,
                ]}
              />
              <View style={styles.statusTextContainer}>
                <Text style={styles.statusTitle}>Unread Notifications</Text>
                <Text style={styles.statusDescription}>
                  {unreadCount} notifications waiting
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Demo Notification Triggers */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Demo Notification Scenarios</Text>
          <Text style={styles.demoDescription}>
            These buttons demonstrate how notifications are triggered during practice sessions:
          </Text>

          <TouchableOpacity
            style={styles.demoButton}
            onPress={handleStreakReminder}
            disabled={!isInitialized}
          >
            <Text style={styles.demoButtonText}>🔥 Streak Reminder</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.demoButton}
            onPress={handleExamNotification}
            disabled={!isInitialized}
          >
            <Text style={styles.demoButtonText}>📅 Exam Scheduled</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.demoButton}
            onPress={handleLeaderboardUpdate}
            disabled={!isInitialized}
          >
            <Text style={styles.demoButtonText}>🏆 Leaderboard Update</Text>
          </TouchableOpacity>

          {!isInitialized && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#4D96FF" />
              <Text style={styles.loadingText}>Initializing notifications...</Text>
            </View>
          )}
        </View>

        {/* Complete Session Button */}
        {!session.completed && (
          <TouchableOpacity style={styles.completeButton} onPress={completeSession}>
            <Text style={styles.completeButtonText}>Complete Session</Text>
          </TouchableOpacity>
        )}

        {session.completed && (
          <View style={styles.completedContainer}>
            <Text style={styles.completedIcon}>✓</Text>
            <Text style={styles.completedTitle}>Session Complete!</Text>
            <Text style={styles.completedText}>
              Great job! Your achievement notification has been recorded.
            </Text>
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  notificationBadge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  card: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  sessionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  statusCompleted: {
    color: '#6BCB77',
  },
  achievementCard: {
    backgroundColor: '#FFFACD',
    borderColor: '#FFD93D',
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  achievementSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD93D',
    marginBottom: 8,
  },
  achievementText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
  },
  statusContainer: {
    gap: 8,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E8E8E8',
  },
  statusDotActive: {
    backgroundColor: '#6BCB77',
  },
  statusDotInfo: {
    backgroundColor: '#4D96FF',
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  statusDescription: {
    fontSize: 12,
    color: '#999999',
  },
  demoDescription: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 12,
    lineHeight: 18,
  },
  demoButton: {
    backgroundColor: '#4D96FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  demoButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: '#999999',
    fontWeight: '500',
  },
  completeButton: {
    backgroundColor: '#6BCB77',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  completedContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 16,
  },
  completedIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  completedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  completedText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
});
