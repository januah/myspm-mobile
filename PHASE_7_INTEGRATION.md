# Phase 7: Firebase Cloud Messaging Integration Guide

## Overview

Phase 7 implements Firebase Cloud Messaging (FCM) for push notifications. This comprehensive guide covers setup, configuration, and integration of the notification system.

## Files Overview

### Types & Constants
- **types/notifications.ts** - Type definitions for notifications
- **constants/notifications.ts** - Notification templates, preferences, FCM channels

### Service Layer
- **services/notificationService.ts** - NotificationService singleton

### Redux Integration
- **store/notificationSlice.ts** - Redux state management

### React Hooks
- **hooks/useNotifications.ts** - Main integration hook

### Components
- **components/notifications/NotificationSettings.tsx** - User preferences UI
- **components/notifications/NotificationCenter.tsx** - Notification history/inbox
- **components/notifications/index.ts** - Component exports

### Integration Examples
- **screens/ProfileScreen.notifications-integration.tsx** - Profile with notification tabs
- **screens/PracticeScreen.notifications-integration.tsx** - Practice with notifications

## Installation

### 1. Install Firebase Messaging

```bash
npx expo install react-native-firebase/messaging
npx expo install firebase
```

### 2. Register App with Firebase

Visit [Firebase Console](https://console.firebase.google.com) and create a new project or use existing one.

### 3. Configure Android

Add to `android/build.gradle`:
```gradle
dependencies {
    classpath 'com.google.gms:google-services:4.3.15'
}
```

Add to `android/app/build.gradle`:
```gradle
apply plugin: 'com.google.gms.google-services'

dependencies {
    implementation 'com.google.firebase:firebase-messaging:23.2.1'
}
```

## API Reference

### useNotifications Hook

Main integration hook with auto-initialization.

#### Usage

```typescript
import { useNotifications } from '../hooks/useNotifications';

const MyComponent = () => {
  const {
    fcmToken,
    isInitialized,
    isLoading,
    isTokenRefreshing,
    error,
    preferences,
    history,
    unreadCount,
    getToken,
    refreshToken,
    updatePreferences,
    toggleCategory,
    updateQuietHours,
    disable,
    enable,
    markAsRead,
    clearHistory,
  } = useNotifications({
    autoInitialize: true,
    userId: 'user123',
    onNotification: (notification) => {
      console.log('Notification received:', notification);
    },
  });

  return (
    <View>
      <Text>FCM Token: {fcmToken}</Text>
      <Text>Unread: {unreadCount}</Text>
    </View>
  );
};
```

#### Options

```typescript
interface UseNotificationsOptions {
  // Auto-initialize FCM on mount (default: false)
  autoInitialize?: boolean;
  
  // User ID for associating notifications with user
  userId?: string;
  
  // Callback when notification received in foreground
  onNotification?: (notification: NotificationPayload) => void;
}
```

#### Return Value

```typescript
interface UseNotificationsReturn {
  // State
  fcmToken: string | null;
  isInitialized: boolean;
  isLoading: boolean;
  isTokenRefreshing: boolean;
  error: string | null;
  preferences: NotificationPreferences | null;
  history: (NotificationPayload & { id: string; timestamp: number; read: boolean })[];
  unreadCount: number;
  
  // Methods
  getToken: () => Promise<string>;
  refreshToken: () => Promise<string>;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => Promise<void>;
  toggleCategory: (category: string) => Promise<void>;
  updateQuietHours: (start: string, end: string) => Promise<void>;
  disable: () => Promise<void>;
  enable: () => Promise<void>;
  markAsRead: (notificationId: string) => void;
  clearHistory: () => void;
}
```

### NotificationCenter Component

Display notification history with reading and clearing.

```typescript
import { NotificationCenter } from '../components/notifications';

const App = () => {
  return (
    <NotificationCenter
      onNotificationPress={(notification) => {
        // Handle notification tap
        if (notification.deepLink) {
          // Navigate to screen
        }
      }}
    />
  );
};
```

### NotificationSettings Component

User preferences UI for notification configuration.

```typescript
import { NotificationSettings } from '../components/notifications';

const SettingsScreen = () => {
  return (
    <ScrollView>
      <NotificationSettings />
    </ScrollView>
  );
};
```

## Notification Types

### Trial Ending
- **Triggered**: 3 days and 1 day before trial expires
- **Payload**:
```typescript
{
  type: 'trial_ending',
  title: 'Your Trial Ends Soon',
  body: 'Premium features expire in 3 days. Upgrade now!',
  deepLink: '/app/subscription/upgrade'
}
```

### Subscription Expiring
- **Triggered**: 7 days and 1 day before subscription expires
- **Payload**:
```typescript
{
  type: 'subscription_expiring',
  title: 'Subscription Renewal',
  body: 'Your premium subscription expires soon.',
  deepLink: '/app/subscription'
}
```

### Daily Reminder
- **Triggered**: Daily at 6 PM local time
- **Payload**:
```typescript
{
  type: 'daily_reminder',
  title: 'Time to Practice',
  body: 'Complete a practice session today to build your streak!',
  deepLink: '/app/practice'
}
```

### Achievement Unlocked
- **Triggered**: When user earns badge/achievement
- **Payload**:
```typescript
{
  type: 'achievement_unlocked',
  title: '🎉 Achievement Unlocked!',
  body: 'You earned the "Gold Streak" badge!',
  deepLink: '/app/achievements'
}
```

### Leaderboard Update
- **Triggered**: When user rank changes
- **Payload**:
```typescript
{
  type: 'leaderboard_update',
  title: '🏆 Leaderboard Update',
  body: 'You moved up to position #5 on the leaderboard!',
  deepLink: '/app/leaderboard'
}
```

### Streak Reminder
- **Triggered**: When streak is at risk
- **Payload**:
```typescript
{
  type: 'streak_reminder',
  title: '🔥 Keep Your Streak Alive',
  body: 'Complete one more session today!',
  deepLink: '/app/practice'
}
```

### New Content
- **Triggered**: New courses/lessons released
- **Payload**:
```typescript
{
  type: 'new_content',
  title: '📚 New Content Available',
  body: 'Advanced calculus course just released!',
  deepLink: '/app/courses/advanced-calculus'
}
```

## Quiet Hours Configuration

Prevent notifications during sleep hours:

```typescript
const { updateQuietHours } = useNotifications({ autoInitialize: true });

// Set quiet hours from 10 PM to 8 AM
await updateQuietHours('22:00', '08:00');
```

Non-critical notifications are suppressed during quiet hours. Critical categories (trial_ending, subscription_expiring) are always delivered.

## Categories & Preferences

Enable/disable notification categories:

```typescript
const { toggleCategory, updatePreferences } = useNotifications({ 
  autoInitialize: true 
});

// Toggle specific category
await toggleCategory('achievement_unlocked');

// Update multiple preferences
await updatePreferences({
  enabledCategories: [
    'daily_reminder',
    'achievement_unlocked',
    'leaderboard_update'
  ],
  quiet_hours: {
    start: '22:00',
    end: '08:00'
  }
});
```

### Available Categories
- `trial_ending` - Trial expiration warnings
- `subscription_expiring` - Subscription renewal reminders
- `daily_reminder` - Daily practice reminders
- `achievement_unlocked` - Achievement & badge notifications
- `leaderboard_update` - Rank change notifications
- `streak_reminder` - Streak-related notifications
- `new_content` - New course/lesson releases
- `general` - General app updates

## Android FCM Channels

Notifications are organized by channel on Android:

- **achievements** - Achievement & badge notifications (Orange)
- **reminders** - Daily practice reminders (Blue)
- **updates** - Content updates & leaderboard (Green)
- **subscription** - Subscription & trial notifications (Red)
- **general** - General app notifications (Gray)

Channels are auto-created by the notification service with appropriate sounds and importance levels.

## Deep Linking

Notifications include deepLink for navigation:

```typescript
const handleNotificationPress = (notification) => {
  if (notification.deepLink) {
    // Use Expo Router
    router.push(notification.deepLink);
  }
};

<NotificationCenter onNotificationPress={handleNotificationPress} />
```

### Available Deep Links
- `/app/practice` - Practice screen
- `/app/leaderboard` - Leaderboard
- `/app/achievements` - Achievements
- `/app/courses/[slug]` - Specific course
- `/app/subscription` - Subscription management
- `/app/subscription/upgrade` - Upgrade page

## Error Handling

Handle initialization and permission errors:

```typescript
const { error, isInitialized } = useNotifications({
  autoInitialize: true,
});

useEffect(() => {
  if (error) {
    console.error('Notification error:', error);
    Alert.alert(
      'Notification Setup',
      'We could not set up notifications. You can enable them in settings.',
      [{ text: 'OK' }]
    );
  }
}, [error]);
```

## Testing

### Test Notifications

Use Firebase Console to send test notifications:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select Messaging
3. Create new notification
4. Enter FCM token from app
5. Send test notification

### Log FCM Token

```typescript
const { fcmToken, isInitialized } = useNotifications({
  autoInitialize: true,
});

useEffect(() => {
  if (isInitialized && fcmToken) {
    console.log('FCM Token:', fcmToken);
    // Copy this token to Firebase Console for testing
  }
}, [isInitialized, fcmToken]);
```

## Best Practices

### 1. Always Check Permission Status
```typescript
const { isInitialized, error } = useNotifications({
  autoInitialize: true,
});

if (error) {
  // Show permission request or info
}
```

### 2. Handle Foreground Messages
```typescript
const handleIncomingNotification = (notification) => {
  // Show in-app notification for foreground messages
  // Update UI state
  // Play sound if appropriate
};

useNotifications({
  autoInitialize: true,
  onNotification: handleIncomingNotification,
});
```

### 3. Respect User Preferences
Always check notification preferences before showing:

```typescript
const { preferences, isInitialized } = useNotifications({
  autoInitialize: true,
});

const shouldShow = (type: NotificationType) => {
  return preferences?.enabledCategories.includes(type);
};
```

### 4. Update User ID When Auth Changes
```typescript
const { user } = useAuth();

useNotifications({
  autoInitialize: true,
  userId: user?.id,
});
```

### 5. Handle Token Refresh
Refresh token periodically:

```typescript
useEffect(() => {
  const interval = setInterval(async () => {
    if (isInitialized) {
      await refreshToken();
    }
  }, 60 * 60 * 1000); // Every hour

  return () => clearInterval(interval);
}, [isInitialized, refreshToken]);
```

## Migration Checklist

- [ ] Install firebase dependencies
- [ ] Configure Firebase in android/iOS
- [ ] Set up Redux notification slice
- [ ] Create notificationService singleton
- [ ] Add useNotifications hook
- [ ] Create NotificationSettings component
- [ ] Create NotificationCenter component
- [ ] Add notifications to ProfileScreen
- [ ] Add notifications to PracticeScreen
- [ ] Test FCM token generation
- [ ] Send test notification via Firebase Console
- [ ] Test quiet hours configuration
- [ ] Test category toggling
- [ ] Test deep linking
- [ ] Test notification history display
- [ ] Deploy to backend with notification sending

## Troubleshooting

### FCM Token Not Generated
- Check Firebase configuration
- Verify Google Play Services installed
- Check Android manifest permissions
- Restart app after Firebase setup

### Notifications Not Received
- Check user preferences (category enabled)
- Check quiet hours setting
- Verify FCM token is registered with backend
- Check notification payload format
- Review CloudMessaging rules in Firebase

### Deep Links Not Working
- Verify Expo Router configuration
- Check deepLink format in notification
- Test deep link in app manually first

### Permissions Denied
- Check AndroidManifest.xml permissions
- Check iOS Info.plist permissions
- Implement permission request UI
- Guide user to app settings if denied
