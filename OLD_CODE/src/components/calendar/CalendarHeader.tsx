/**
 * CalendarHeader Component - Navigation and View Mode Controls
 * Provides date navigation, view mode switching, and quick actions
 */

import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import type { CalendarViewMode } from '../../types/calendar';
import { CALENDAR_VIEW_MODE_CONFIG, CALENDAR_MONTH_NAMES } from '../../constants/calendar';

interface CalendarHeaderProps {
  currentViewMode: CalendarViewMode;
  selectedDate: string;
  onViewModeChange: (mode: CalendarViewMode) => void;
  onGoToToday: () => void;
  allowViewSwitching?: boolean;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentViewMode,
  selectedDate,
  onViewModeChange,
  onGoToToday,
  allowViewSwitching = true,
}) => {
  const [year, month, day] = selectedDate.split('-');
  const monthName = CALENDAR_MONTH_NAMES[parseInt(month) - 1];
  const displayText = `${monthName} ${year}`;

  const isToday =
    selectedDate === new Date().toISOString().split('T')[0];

  const viewModes: CalendarViewMode[] = ['month', 'week', 'day', 'agenda'];

  return (
    <View style={styles.container}>
      {/* Date Display */}
      <View style={styles.dateSection}>
        <Text style={styles.dateText}>{displayText}</Text>
        {!isToday && (
          <TouchableOpacity
            style={styles.todayButton}
            onPress={onGoToToday}
          >
            <Text style={styles.todayButtonText}>Today</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* View Mode Selector */}
      {allowViewSwitching && (
        <ScrollView
          style={styles.viewModeContainer}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.viewModeContent}
        >
          {viewModes.map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.viewModeButton,
                currentViewMode === mode && styles.viewModeButtonActive,
              ]}
              onPress={() => onViewModeChange(mode)}
            >
              <Text style={styles.viewModeIcon}>
                {CALENDAR_VIEW_MODE_CONFIG[mode].icon}
              </Text>
              <Text
                style={[
                  styles.viewModeText,
                  currentViewMode === mode && styles.viewModeTextActive,
                ]}
              >
                {CALENDAR_VIEW_MODE_CONFIG[mode].label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingTop: 12,
    paddingBottom: 8,
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  dateText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
  },
  todayButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#3B82F6',
    borderRadius: 6,
  },
  todayButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  viewModeContainer: {
    paddingHorizontal: 16,
  },
  viewModeContent: {
    gap: 8,
  },
  viewModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  viewModeButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  viewModeIcon: {
    fontSize: 16,
  },
  viewModeText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
  },
  viewModeTextActive: {
    color: '#FFFFFF',
  },
});

export default CalendarHeader;
