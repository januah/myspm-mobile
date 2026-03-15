/**
 * NotificationBadge Component
 * 
 * Badge component that displays unread notification count
 * Features:
 * - Shows unread count (0-99+)
 * - Animated pulsing effect for urgent notifications
 * - Customizable colors and positioning
 * - Support for dot-only display
 * 
 * Usage:
 * <NotificationBadge count={5} />
 * <NotificationBadge count={unreadCount} pulse={hasUrgent} />
 */

import React, { useMemo } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { NOTIFICATION_BADGE_CONFIG } from '../../constants/notification';

export interface NotificationBadgeProps {
  /** Unread count */
  count: number;

  /** Whether to show pulsing animation */
  pulse?: boolean;

  /** Custom background color */
  backgroundColor?: string;

  /** Custom text color */
  textColor?: string;

  /** Badge size (small, medium, large) */
  size?: 'small' | 'medium' | 'large';

  /** Position offset from top-right */
  offset?: { top: number; right: number };

  /** Whether to show as dot only (no number) */
  dotOnly?: boolean;
}

/**
 * Size configuration
 */
const SIZE_CONFIG = {
  small: {
    width: 20,
    height: 20,
    fontSize: 12,
    offset: { top: -5, right: -5 },
  },
  medium: {
    width: 24,
    height: 24,
    fontSize: 13,
    offset: { top: -8, right: -8 },
  },
  large: {
    width: 28,
    height: 28,
    fontSize: 14,
    offset: { top: -10, right: -10 },
  },
};

/**
 * NotificationBadge Component
 */
export const NotificationBadge = React.memo(
  ({
    count,
    pulse = false,
    backgroundColor = NOTIFICATION_BADGE_CONFIG.BADGE_COLOR,
    textColor = NOTIFICATION_BADGE_CONFIG.BADGE_TEXT_COLOR,
    size = 'medium',
    offset,
    dotOnly = false,
  }: NotificationBadgeProps) => {
    // Hide if count is 0
    if (count <= 0) {
      return null;
    }

    const sizeConfig = SIZE_CONFIG[size];
    const finalOffset = offset || sizeConfig.offset;

    // Format count (0-99+ display)
    const displayCount = useMemo(() => {
      if (dotOnly) return '';
      if (count > NOTIFICATION_BADGE_CONFIG.MAX_BADGE_NUMBER) {
        return `${NOTIFICATION_BADGE_CONFIG.MAX_BADGE_NUMBER}+`;
      }
      return String(count);
    }, [count, dotOnly]);

    // Determine badge dimensions
    const isCircle = displayCount.length <= 2;
    const width = isCircle ? sizeConfig.width : sizeConfig.width * 1.2;

    const styles = useMemo(
      () =>
        StyleSheet.create({
          container: {
            position: 'absolute',
            top: finalOffset.top,
            right: finalOffset.right,
            zIndex: 999,
          },
          badge: {
            width,
            height: sizeConfig.height,
            borderRadius: sizeConfig.height / 2,
            backgroundColor,
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: sizeConfig.width,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3,
            elevation: 5,
          },
          text: {
            color: textColor,
            fontSize: sizeConfig.fontSize,
            fontWeight: '600',
            textAlign: 'center',
          },
        }),
      [width, sizeConfig.width, sizeConfig.height, sizeConfig.fontSize, backgroundColor, textColor, finalOffset]
    );

    return (
      <View style={styles.container}>
        <PulseBadge
          pulse={pulse && count > 0}
          duration={NOTIFICATION_BADGE_CONFIG.PULSE_DURATION_MS}
          style={styles.badge}
        >
          {displayCount && <Text style={styles.text}>{displayCount}</Text>}
        </PulseBadge>
      </View>
    );
  }
);

NotificationBadge.displayName = 'NotificationBadge';

/**
 * PulseBadge Component (internal)
 * Wrapper that adds pulsing animation
 */
interface PulseBadgeProps {
  pulse: boolean;
  duration: number;
  style: any;
  children: React.ReactNode;
}

const PulseBadge = React.memo(({ pulse, duration, style, children }: PulseBadgeProps) => {
  const scaleAnim = useMemo(() => new Animated.Value(1), []);

  React.useEffect(() => {
    if (!pulse) {
      scaleAnim.setValue(1);
      return;
    }

    const pulseAnimation = Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: duration / 2,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: duration / 2,
        useNativeDriver: true,
      }),
    ]);

    const loop = Animated.loop(pulseAnimation);
    loop.start();

    return () => {
      loop.stop();
      scaleAnim.setValue(1);
    };
  }, [pulse, scaleAnim, duration]);

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
});

PulseBadge.displayName = 'PulseBadge';
