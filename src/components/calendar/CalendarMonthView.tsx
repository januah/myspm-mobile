/**
 * CalendarMonthView Component - Month Grid Calendar Display
 * Shows calendar grid with events, allows date selection and event interaction
 */

import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import type { CalendarEvent } from '../../types/calendar';
import { CALENDAR_DAY_NAMES_SHORT, CALENDAR_MONTH_NAMES } from '../../constants/calendar';

interface CalendarMonthViewProps {
  month: string; // YYYY-MM format
  events: CalendarEvent[];
  selectedDate: string; // YYYY-MM-DD format
  onDateSelect: (date: string) => void;
  onEventPress: (event: CalendarEvent) => void;
  onNextMonth: () => void;
  onPreviousMonth: () => void;
}

interface DayItem {
  date: string;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

const CalendarMonthView: React.FC<CalendarMonthViewProps> = ({
  month,
  events,
  selectedDate,
  onDateSelect,
  onEventPress,
  onNextMonth,
  onPreviousMonth,
}) => {
  const [year, monthStr] = month.split('-');
  const monthNum = parseInt(monthStr);
  const yearNum = parseInt(year);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(yearNum, monthNum - 1, 1);
    const lastDay = new Date(yearNum, monthNum, 0);
    const prevMonthLastDay = new Date(yearNum, monthNum - 1, 0);

    const days: DayItem[] = [];
    const today = new Date().toISOString().split('T')[0];

    // Previous month days
    const startingDayOfWeek = firstDay.getDay();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(prevMonthLastDay);
      date.setDate(prevMonthLastDay.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        dayOfMonth: date.getDate(),
        isCurrentMonth: false,
        isToday: dateStr === today,
        events: events.filter((e) => e.startDate.split('T')[0] === dateStr),
      });
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(yearNum, monthNum - 1, i);
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        dayOfMonth: i,
        isCurrentMonth: true,
        isToday: dateStr === today,
        events: events.filter((e) => e.startDate.split('T')[0] === dateStr),
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(yearNum, monthNum, i);
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        dayOfMonth: i,
        isCurrentMonth: false,
        isToday: dateStr === today,
        events: events.filter((e) => e.startDate.split('T')[0] === dateStr),
      });
    }

    return days;
  }, [month, events]);

  const weeks = useMemo(() => {
    const result = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      result.push(calendarDays.slice(i, i + 7));
    }
    return result;
  }, [calendarDays]);

  const renderDayCell = (day: DayItem) => {
    const isSelected = day.date === selectedDate;
    const hasCriticalEvent = day.events.some((e) => e.priority === 'critical');
    const eventCount = day.events.length;

    return (
      <TouchableOpacity
        key={day.date}
        style={[
          styles.dayCell,
          !day.isCurrentMonth && styles.dayCellOtherMonth,
          isSelected && styles.dayCellSelected,
          day.isToday && styles.dayCellToday,
        ]}
        onPress={() => onDateSelect(day.date)}
      >
        <Text
          style={[
            styles.dayNumber,
            !day.isCurrentMonth && styles.dayNumberOtherMonth,
            isSelected && styles.dayNumberSelected,
          ]}
        >
          {day.dayOfMonth}
        </Text>

        {/* Event indicators */}
        <View style={styles.eventIndicators}>
          {eventCount > 0 && (
            <View
              style={[
                styles.eventBadge,
                hasCriticalEvent && styles.eventBadgeCritical,
              ]}
            >
              <Text style={styles.eventBadgeText}>
                {eventCount > 3 ? '3+' : eventCount}
              </Text>
            </View>
          )}
        </View>

        {/* Today indicator */}
        {day.isToday && !isSelected && (
          <View style={styles.todayIndicator} />
        )}
      </TouchableOpacity>
    );
  };

  const renderEventPreview = (event: CalendarEvent, index: number) => {
    return (
      <TouchableOpacity
        key={`${event.id}-${index}`}
        style={styles.eventPreview}
        onPress={() => onEventPress(event)}
      >
        <View
          style={[
            styles.eventPreviewIndicator,
            { backgroundColor: event.color },
          ]}
        />
        <Text style={styles.eventPreviewText} numberOfLines={1}>
          {event.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const selectedDayEvents = useMemo(
    () =>
      calendarDays.find((d) => d.date === selectedDate)?.events || [],
    [selectedDate, calendarDays]
  );

  return (
    <View style={styles.container}>
      {/* Day names header */}
      <View style={styles.dayNamesRow}>
        {CALENDAR_DAY_NAMES_SHORT.map((dayName) => (
          <View key={dayName} style={styles.dayNameCell}>
            <Text style={styles.dayNameText}>{dayName}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <ScrollView style={styles.calendar} showsVerticalScrollIndicator={false}>
        {weeks.map((week, weekIndex) => (
          <View key={`week-${weekIndex}`} style={styles.week}>
            {week.map((day) => renderDayCell(day))}
          </View>
        ))}
      </ScrollView>

      {/* Selected day events preview */}
      {selectedDayEvents.length > 0 && (
        <View style={styles.selectedDayEventsContainer}>
          <Text style={styles.selectedDayEventsTitle}>
            Events on {new Date(selectedDate).toLocaleDateString()}
          </Text>
          <FlatList
            data={selectedDayEvents}
            renderItem={({ item, index }) => renderEventPreview(item, index)}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            scrollEnabled={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  dayNamesRow: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  dayNameCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayNameText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  calendar: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  week: {
    flexDirection: 'row',
    marginBottom: 4,
    gap: 4,
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 6,
    justifyContent: 'flex-start',
  },
  dayCellOtherMonth: {
    backgroundColor: '#F8FAFC',
    borderColor: '#F1F5F9',
  },
  dayCellSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  dayCellToday: {
    borderColor: '#3B82F6',
    borderWidth: 2,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  dayNumberOtherMonth: {
    color: '#CBD5E1',
  },
  dayNumberSelected: {
    color: '#FFFFFF',
  },
  eventIndicators: {
    marginTop: 4,
    gap: 2,
  },
  eventBadge: {
    backgroundColor: '#FEE2E2',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  eventBadgeCritical: {
    backgroundColor: '#EF4444',
  },
  eventBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#DC2626',
  },
  todayIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3B82F6',
    position: 'absolute',
    bottom: 4,
    right: 4,
  },
  selectedDayEventsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 200,
    backgroundColor: '#F8FAFC',
  },
  selectedDayEventsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  eventPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  eventPreviewIndicator: {
    width: 3,
    height: 16,
    borderRadius: 1.5,
  },
  eventPreviewText: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
  },
});

export default CalendarMonthView;
