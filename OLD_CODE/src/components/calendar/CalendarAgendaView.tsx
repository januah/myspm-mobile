/**
 * CalendarAgendaView Component - Agenda/List View
 * Shows upcoming events in chronological list format
 */

import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import type { CalendarEvent } from '../../types/calendar';

interface CalendarAgendaViewProps {
  events: CalendarEvent[];
  onEventPress: (event: CalendarEvent) => void;
}

const CalendarAgendaView: React.FC<CalendarAgendaViewProps> = ({
  events,
  onEventPress,
}) => {
  // Sort events by start date and time
  const sortedEvents = useMemo(() => {
    const now = new Date();
    return [...events]
      .filter((e) => new Date(e.startDate) >= now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [events]);

  // Group events by date
  const groupedEvents = useMemo(() => {
    const groups: { date: string; dateLabel: string; events: CalendarEvent[] }[] = [];
    const today = new Date();

    sortedEvents.forEach((event) => {
      const eventDate = new Date(event.startDate);
      const dateKey = eventDate.toISOString().split('T')[0];

      let dateLabel: string;
      if (dateKey === today.toISOString().split('T')[0]) {
        dateLabel = 'Today';
      } else {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (dateKey === tomorrow.toISOString().split('T')[0]) {
          dateLabel = 'Tomorrow';
        } else {
          const dayDiff = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          if (dayDiff <= 7) {
            const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
              eventDate.getDay()
            ];
            dateLabel = dayName;
          } else {
            dateLabel = eventDate.toLocaleDateString();
          }
        }
      }

      const existingGroup = groups.find((g) => g.date === dateKey);
      if (existingGroup) {
        existingGroup.events.push(event);
      } else {
        groups.push({
          date: dateKey,
          dateLabel,
          events: [event],
        });
      }
    });

    return groups;
  }, [sortedEvents]);

  const renderEventItem = ({ item: event }: { item: CalendarEvent }) => {
    const eventDate = new Date(event.startDate);
    const timeString = event.timeRange
      ? `${event.timeRange.startTime} - ${event.timeRange.endTime}`
      : 'All day';

    const getDaysUntil = (date: Date): number => {
      const today = new Date();
      const diff = date.getTime() - today.getTime();
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    const daysUntil = getDaysUntil(eventDate);
    const isUrgent = daysUntil <= 3 && event.priority !== 'low';

    return (
      <TouchableOpacity
        style={[
          styles.eventItem,
          isUrgent && styles.eventItemUrgent,
        ]}
        onPress={() => onEventPress(event)}
      >
        {/* Left indicator */}
        <View
          style={[
            styles.eventIndicator,
            { backgroundColor: event.color },
          ]}
        />

        {/* Event details */}
        <View style={styles.eventContent}>
          <View style={styles.eventHeader}>
            <Text style={styles.eventTitle} numberOfLines={2}>
              {event.title}
            </Text>
            <View
              style={[
                styles.priorityTag,
                {
                  backgroundColor:
                    event.priority === 'critical'
                      ? '#FEE2E2'
                      : event.priority === 'high'
                      ? '#FEF3C7'
                      : '#DBEAFE',
                },
              ]}
            >
              <Text
                style={[
                  styles.priorityTagText,
                  {
                    color:
                      event.priority === 'critical'
                        ? '#DC2626'
                        : event.priority === 'high'
                        ? '#D97706'
                        : '#0284C7',
                  },
                ]}
              >
                {event.priority.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.eventTime}>{timeString}</Text>

          {event.description && (
            <Text style={styles.eventDescription} numberOfLines={1}>
              {event.description}
            </Text>
          )}

          <View style={styles.eventMeta}>
            {event.location && (
              <Text style={styles.eventMetaItem} numberOfLines={1}>
                📍 {event.location.name}
              </Text>
            )}
            {daysUntil === 0 && (
              <Text style={styles.eventMetaItem}>🔔 Today</Text>
            )}
            {daysUntil === 1 && (
              <Text style={styles.eventMetaItem}>🔔 Tomorrow</Text>
            )}
          </View>
        </View>

        {/* Event type icon */}
        <View style={styles.eventTypeIcon}>
          <Text style={styles.eventTypeIconText}>
            {event.eventType === 'exam'
              ? '📝'
              : event.eventType === 'assignment'
              ? '📋'
              : event.eventType === 'deadline'
              ? '⏰'
              : event.eventType === 'class'
              ? '👨‍🎓'
              : event.eventType === 'meeting'
              ? '🤝'
              : '📌'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({
    item: group,
  }: {
    item: { date: string; dateLabel: string; events: CalendarEvent[] };
  }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{group.dateLabel}</Text>
      <Text style={styles.sectionBadge}>{group.events.length}</Text>
    </View>
  );

  const sections = groupedEvents.flatMap((group) => [
    { type: 'header', data: group },
    ...group.events.map((event) => ({ type: 'event', data: event })),
  ]);

  if (sortedEvents.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📭</Text>
        <Text style={styles.emptyTitle}>No Upcoming Events</Text>
        <Text style={styles.emptyText}>
          You're all caught up! Create new events to get started.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sections}
        renderItem={({ item }) =>
          item.type === 'header'
            ? renderSectionHeader({ item: item.data })
            : renderEventItem({ item: item.data })
        }
        keyExtractor={(item, index) =>
          item.type === 'header' ? `header-${item.data.date}` : `event-${item.data.id}`
        }
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 0,
    paddingTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  sectionBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  eventItemUrgent: {
    backgroundColor: '#FEF3C7',
  },
  eventIndicator: {
    width: 4,
    height: 50,
    borderRadius: 2,
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  eventTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  priorityTag: {
    width: 24,
    height: 24,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  priorityTagText: {
    fontSize: 12,
    fontWeight: '700',
  },
  eventTime: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 6,
  },
  eventMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  eventMetaItem: {
    fontSize: 11,
    color: '#64748B',
  },
  eventTypeIcon: {
    marginLeft: 12,
  },
  eventTypeIconText: {
    fontSize: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
});

export default CalendarAgendaView;
