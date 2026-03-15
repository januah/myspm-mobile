/**
 * CalendarView Component - Main Calendar Container
 * Displays calendar in different view modes (month, week, day, agenda)
 * Handles view switching and event interactions
 */

import React, { useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useCalendar } from '../../hooks/calendar/useCalendar';
import type { CalendarViewMode, CalendarEvent } from '../../types/calendar';
import CalendarMonthView from './CalendarMonthView';
import CalendarWeekView from './CalendarWeekView';
import CalendarDayView from './CalendarDayView';
import CalendarAgendaView from './CalendarAgendaView';
import CalendarHeader from './CalendarHeader';
import EventModal from './EventModal';

interface CalendarViewProps {
  onEventPress?: (event: CalendarEvent) => void;
  containerStyle?: any;
  showHeader?: boolean;
  allowViewSwitching?: boolean;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  onEventPress,
  containerStyle,
  showHeader = true,
  allowViewSwitching = true,
}) => {
  const {
    events,
    currentViewMode,
    selectedDate,
    selectedMonth,
    loading,
    error,
    setViewMode,
    selectDate,
    selectMonth,
    nextMonth,
    previousMonth,
    goToToday,
    getEventsByDate,
  } = useCalendar();

  const [selectedEventId, setSelectedEventId] = React.useState<string | undefined>();
  const [showEventDetails, setShowEventDetails] = React.useState(false);

  const selectedEvent = useMemo(
    () => events.find((e) => e.id === selectedEventId),
    [selectedEventId, events]
  );

  const handleEventPress = useCallback(
    (event: CalendarEvent) => {
      setSelectedEventId(event.id);
      setShowEventDetails(true);
      onEventPress?.(event);
    },
    [onEventPress]
  );

  const handleViewModeChange = useCallback(
    (mode: CalendarViewMode) => {
      if (allowViewSwitching) {
        setViewMode(mode);
      }
    },
    [setViewMode, allowViewSwitching]
  );

  const handleDateSelect = useCallback(
    (date: string) => {
      selectDate(date);
    },
    [selectDate]
  );

  const renderViewContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Error loading calendar</Text>
          <Text style={styles.errorMessage}>{error}</Text>
        </View>
      );
    }

    switch (currentViewMode) {
      case 'month':
        return (
          <CalendarMonthView
            month={selectedMonth}
            events={events}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onEventPress={handleEventPress}
            onNextMonth={nextMonth}
            onPreviousMonth={previousMonth}
          />
        );

      case 'week':
        return (
          <CalendarWeekView
            selectedDate={selectedDate}
            events={events}
            onDateSelect={handleDateSelect}
            onEventPress={handleEventPress}
            onNextWeek={() => {
              const nextDate = new Date(selectedDate);
              nextDate.setDate(nextDate.getDate() + 7);
              handleDateSelect(nextDate.toISOString().split('T')[0]);
            }}
            onPreviousWeek={() => {
              const prevDate = new Date(selectedDate);
              prevDate.setDate(prevDate.getDate() - 7);
              handleDateSelect(prevDate.toISOString().split('T')[0]);
            }}
          />
        );

      case 'day':
        return (
          <CalendarDayView
            date={selectedDate}
            events={getEventsByDate(selectedDate)}
            onEventPress={handleEventPress}
            onNextDay={() => {
              const nextDate = new Date(selectedDate);
              nextDate.setDate(nextDate.getDate() + 1);
              handleDateSelect(nextDate.toISOString().split('T')[0]);
            }}
            onPreviousDay={() => {
              const prevDate = new Date(selectedDate);
              prevDate.setDate(prevDate.getDate() - 1);
              handleDateSelect(prevDate.toISOString().split('T')[0]);
            }}
          />
        );

      case 'agenda':
        return (
          <CalendarAgendaView
            events={events}
            onEventPress={handleEventPress}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {showHeader && (
        <CalendarHeader
          currentViewMode={currentViewMode}
          selectedDate={selectedDate}
          onViewModeChange={handleViewModeChange}
          onGoToToday={goToToday}
          allowViewSwitching={allowViewSwitching}
        />
      )}

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderViewContent()}
      </ScrollView>

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          visible={showEventDetails}
          onClose={() => {
            setShowEventDetails(false);
            setSelectedEventId(undefined);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
});

export default CalendarView;
