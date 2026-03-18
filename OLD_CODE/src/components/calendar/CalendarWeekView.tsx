/**
 * CalendarWeekView Component - Week View with Time Grid
 * Shows 7 days in a row with hourly time slots and event positioning
 */

import React, { useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import type { CalendarEvent } from '../../types/calendar';
import { CALENDAR_DAY_NAMES_SHORT, CALENDAR_TIME_GRID_CONFIG } from '../../constants/calendar';

interface CalendarWeekViewProps {
  selectedDate: string; // YYYY-MM-DD format
  events: CalendarEvent[];
  onDateSelect: (date: string) => void;
  onEventPress: (event: CalendarEvent) => void;
  onNextWeek: () => void;
  onPreviousWeek: () => void;
}

const CalendarWeekView: React.FC<CalendarWeekViewProps> = ({
  selectedDate,
  events,
  onDateSelect,
  onEventPress,
  onNextWeek,
  onPreviousWeek,
}) => {
  const screenWidth = Dimensions.get('window').width;

  // Get week days starting from selected date
  const weekDays = useMemo(() => {
    const selected = new Date(selectedDate);
    const dayOfWeek = selected.getDay();
    const start = new Date(selected);
    start.setDate(selected.getDate() - dayOfWeek);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        dateStr,
        dayOfWeek: i,
        dayName: CALENDAR_DAY_NAMES_SHORT[i],
        dayOfMonth: date.getDate(),
      });
    }
    return days;
  }, [selectedDate]);

  // Get events for each day
  const dayEvents = useMemo(() => {
    return weekDays.map((day) =>
      events.filter((e) => e.startDate.split('T')[0] === day.dateStr)
    );
  }, [weekDays, events]);

  // Time slots (6 AM to 10 PM)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = CALENDAR_TIME_GRID_CONFIG.MIN_HOUR; hour < CALENDAR_TIME_GRID_CONFIG.MAX_HOUR; hour++) {
      slots.push({
        time: `${hour}:00`,
        hour,
      });
    }
    return slots;
  }, []);

  // Calculate event position and height
  const getEventStyle = (event: CalendarEvent) => {
    const startTime = event.timeRange?.startTime || '09:00';
    const endTime = event.timeRange?.endTime || '10:00';

    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const startPositionPercent =
      ((startHour - CALENDAR_TIME_GRID_CONFIG.MIN_HOUR) * 60 + startMin) /
      (60 * (CALENDAR_TIME_GRID_CONFIG.MAX_HOUR - CALENDAR_TIME_GRID_CONFIG.MIN_HOUR)) *
      100;
    const heightPercent =
      ((endHour - startHour) * 60 + (endMin - startMin)) /
      (60 * (CALENDAR_TIME_GRID_CONFIG.MAX_HOUR - CALENDAR_TIME_GRID_CONFIG.MIN_HOUR)) *
      100;

    return {
      top: `${startPositionPercent}%`,
      height: `${heightPercent}%`,
    };
  };

  const renderDayColumn = (dayIndex: number) => {
    const day = weekDays[dayIndex];
    const dayEventsList = dayEvents[dayIndex];
    const isSelected = day.dateStr === selectedDate;
    const isToday = day.dateStr === new Date().toISOString().split('T')[0];

    return (
      <View key={day.dateStr} style={styles.dayColumn}>
        {/* Day header */}
        <TouchableOpacity
          style={[
            styles.dayHeader,
            isSelected && styles.dayHeaderSelected,
            isToday && styles.dayHeaderToday,
          ]}
          onPress={() => onDateSelect(day.dateStr)}
        >
          <Text style={styles.dayHeaderName}>{day.dayName}</Text>
          <Text
            style={[
              styles.dayHeaderDate,
              isSelected && styles.dayHeaderDateSelected,
            ]}
          >
            {day.dayOfMonth}
          </Text>
        </TouchableOpacity>

        {/* Time grid */}
        <View style={[styles.timeGrid, { position: 'relative' }]}>
          {timeSlots.map((slot) => (
            <View key={slot.time} style={styles.timeSlot} />
          ))}

          {/* Events overlay */}
          {dayEventsList.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={[
                styles.eventContainer,
                getEventStyle(event),
                { backgroundColor: event.color },
              ]}
              onPress={() => onEventPress(event)}
            >
              <Text style={styles.eventTitle} numberOfLines={2}>
                {event.title}
              </Text>
              <Text style={styles.eventTime}>
                {event.timeRange?.startTime || 'TBD'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {weekDays.map((_, index) => renderDayColumn(index))}
      </ScrollView>

      {/* Time labels sidebar */}
      <ScrollView
        style={styles.timeLabels}
        showsVerticalScrollIndicator={false}
      >
        {timeSlots.map((slot) => (
          <View key={slot.time} style={styles.timeLabel}>
            <Text style={styles.timeLabelText}>
              {slot.hour > 12 ? slot.hour - 12 : slot.hour}
              {slot.hour >= 12 ? 'PM' : 'AM'}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingRight: 16,
  },
  dayColumn: {
    width: 120,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
  },
  dayHeader: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  dayHeaderSelected: {
    backgroundColor: '#3B82F6',
  },
  dayHeaderToday: {
    borderTopWidth: 2,
    borderTopColor: '#3B82F6',
  },
  dayHeaderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  dayHeaderDate: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  dayHeaderDateSelected: {
    color: '#FFFFFF',
  },
  timeGrid: {
    minHeight: 1000,
  },
  timeSlot: {
    height: CALENDAR_TIME_GRID_CONFIG.CELL_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  eventContainer: {
    position: 'absolute',
    left: 4,
    right: 4,
    borderRadius: 6,
    padding: 6,
    overflow: 'hidden',
  },
  eventTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  eventTime: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  timeLabels: {
    width: 50,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  timeLabel: {
    height: CALENDAR_TIME_GRID_CONFIG.CELL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  timeLabelText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
});

export default CalendarWeekView;
