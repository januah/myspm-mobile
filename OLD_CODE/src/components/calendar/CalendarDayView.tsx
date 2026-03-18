/**
 * CalendarDayView Component - Single Day Detail View
 * Shows all events for a selected day with hourly timeline
 */

import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import type { CalendarEvent } from '../../types/calendar';
import { CALENDAR_TIME_GRID_CONFIG, CALENDAR_DAY_NAMES } from '../../constants/calendar';

interface CalendarDayViewProps {
  date: string; // YYYY-MM-DD format
  events: CalendarEvent[];
  onEventPress: (event: CalendarEvent) => void;
  onNextDay: () => void;
  onPreviousDay: () => void;
}

const CalendarDayView: React.FC<CalendarDayViewProps> = ({
  date,
  events,
  onEventPress,
  onNextDay,
  onPreviousDay,
}) => {
  const [year, month, day] = date.split('-');
  const dateObj = new Date(date);
  const dayName = CALENDAR_DAY_NAMES[dateObj.getDay()];
  const formattedDate = `${dayName}, ${month}/${day}/${year}`;

  // Separate all-day and timed events
  const { allDayEvents, timedEvents } = useMemo(() => {
    return {
      allDayEvents: events.filter((e) => e.allDay),
      timedEvents: events
        .filter((e) => !e.allDay)
        .sort((a, b) => {
          const aTime = a.timeRange?.startTime || '00:00';
          const bTime = b.timeRange?.startTime || '00:00';
          return aTime.localeCompare(bTime);
        }),
    };
  }, [events]);

  // Time slots
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = CALENDAR_TIME_GRID_CONFIG.MIN_HOUR; hour < CALENDAR_TIME_GRID_CONFIG.MAX_HOUR; hour++) {
      slots.push({
        time: `${hour}:00`,
        hour,
        label: `${hour > 12 ? hour - 12 : hour}${hour >= 12 ? 'PM' : 'AM'}`,
      });
    }
    return slots;
  }, []);

  // Events for specific hour
  const getEventsForHour = (hour: number) => {
    return timedEvents.filter((e) => {
      const startTime = e.timeRange?.startTime || '09:00';
      const startHour = parseInt(startTime.split(':')[0]);
      return startHour === hour;
    });
  };

  const renderEventCard = (event: CalendarEvent) => (
    <TouchableOpacity
      key={event.id}
      style={[
        styles.eventCard,
        { borderLeftColor: event.color, borderLeftWidth: 4 },
      ]}
      onPress={() => onEventPress(event)}
    >
      <View style={styles.eventCardHeader}>
        <Text style={styles.eventCardTitle}>{event.title}</Text>
        <View
          style={[
            styles.priorityBadge,
            {
              backgroundColor:
                event.priority === 'critical'
                  ? '#FEE2E2'
                  : event.priority === 'high'
                  ? '#FEF3C7'
                  : '#E0F2FE',
            },
          ]}
        >
          <Text
            style={[
              styles.priorityText,
              {
                color:
                  event.priority === 'critical'
                    ? '#DC2626'
                    : event.priority === 'high'
                    ? '#D97706'
                    : '#0369A1',
              },
            ]}
          >
            {event.priority.charAt(0).toUpperCase() + event.priority.slice(1)}
          </Text>
        </View>
      </View>

      {event.timeRange && (
        <Text style={styles.eventCardTime}>
          {event.timeRange.startTime} - {event.timeRange.endTime}
        </Text>
      )}

      {event.description && (
        <Text style={styles.eventCardDescription} numberOfLines={2}>
          {event.description}
        </Text>
      )}

      {event.location && (
        <Text style={styles.eventCardLocation}>
          📍 {event.location.name}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Date Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onPreviousDay} style={styles.navButton}>
          <Text style={styles.navButtonText}>← Prev</Text>
        </TouchableOpacity>

        <View style={styles.dateHeader}>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>

        <TouchableOpacity onPress={onNextDay} style={styles.navButton}>
          <Text style={styles.navButtonText}>Next →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* All-day events */}
        {allDayEvents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All Day</Text>
            {allDayEvents.map((event) => renderEventCard(event))}
          </View>
        )}

        {/* Timed events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule</Text>

          {timedEvents.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No events scheduled</Text>
            </View>
          ) : (
            timeSlots.map((slot) => {
              const eventsAtHour = getEventsForHour(slot.hour);
              if (eventsAtHour.length === 0) {
                return null;
              }

              return (
                <View key={slot.time} style={styles.timeBlock}>
                  <Text style={styles.timeLabel}>{slot.label}</Text>
                  <View style={styles.eventsContainer}>
                    {eventsAtHour.map((event) => renderEventCard(event))}
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Event Stats */}
        {(allDayEvents.length > 0 || timedEvents.length > 0) && (
          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Events</Text>
              <Text style={styles.statValue}>{events.length}</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Critical</Text>
              <Text style={styles.statValue}>
                {events.filter((e) => e.priority === 'critical').length}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statLabel}>High Priority</Text>
              <Text style={styles.statValue}>
                {events.filter((e) => e.priority === 'high').length}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  navButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#E0E7FF',
  },
  navButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4F46E5',
  },
  dateHeader: {
    flex: 1,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  timeBlock: {
    marginBottom: 16,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  eventsContainer: {
    gap: 8,
  },
  eventCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  eventCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  eventCardTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
  },
  eventCardTime: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
  },
  eventCardDescription: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 6,
    lineHeight: 18,
  },
  eventCardLocation: {
    fontSize: 12,
    color: '#64748B',
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    marginTop: 20,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3B82F6',
  },
});

export default CalendarDayView;
