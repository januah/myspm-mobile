/**
 * CalendarScreen - Example Integration Screen
 * Demonstrates complete calendar system integration with statistics and controls
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useCalendar } from '../hooks/calendar/useCalendar';
import CalendarView from '../components/calendar/CalendarView';
import type { CalendarEvent } from '../types/calendar';

const CalendarScreen: React.FC = () => {
  const {
    events,
    upcomingEvents,
    summary,
    loading,
    syncing,
    error,
    currentViewMode,
    fetchEvents,
    syncCalendar,
  } = useCalendar();

  const [refreshing, setRefreshing] = useState(false);
  const [showStats, setShowStats] = useState(true);

  // Initial load
  useEffect(() => {
    const loadCalendar = async () => {
      try {
        await fetchEvents();
      } catch (err) {
        console.error('Failed to load calendar:', err);
      }
    };

    loadCalendar();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await syncCalendar();
      await fetchEvents();
    } catch (err) {
      console.error('Failed to sync calendar:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleEventPress = (event: CalendarEvent) => {
    // Navigate to event details or show modal
    console.log('Event pressed:', event.id);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Calendar</Text>
          <Text style={styles.headerSubtitle}>
            {summary.totalEvents} events • {summary.upcomingCount} upcoming
          </Text>
        </View>

        <View style={styles.headerControls}>
          {syncing && <ActivityIndicator color="#3B82F6" size="small" />}
          <TouchableOpacity
            style={styles.syncButton}
            onPress={handleRefresh}
            disabled={syncing}
          >
            <Text style={styles.syncButtonText}>🔄</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Error Banner */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => handleRefresh()}>
            <Text style={styles.errorRetry}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Statistics Section */}
      {showStats && (
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📅</Text>
            <Text style={styles.statValue}>{summary.totalEvents}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⏰</Text>
            <Text style={styles.statValue}>{summary.upcomingCount}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🔴</Text>
            <Text style={styles.statValue}>{summary.criticalCount}</Text>
            <Text style={styles.statLabel}>Critical</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📝</Text>
            <Text style={styles.statValue}>{summary.examsCount}</Text>
            <Text style={styles.statLabel}>Exams</Text>
          </View>
        </View>
      )}

      {/* Toggle Stats Button */}
      <TouchableOpacity
        style={styles.toggleStatsButton}
        onPress={() => setShowStats(!showStats)}
      >
        <Text style={styles.toggleStatsText}>
          {showStats ? '▼ Hide Stats' : '▲ Show Stats'}
        </Text>
      </TouchableOpacity>

      {/* Calendar View */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading calendar...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.calendarContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#3B82F6"
            />
          }
        >
          <CalendarView
            onEventPress={handleEventPress}
            showHeader={true}
            allowViewSwitching={true}
          />

          {/* Additional Info */}
          {upcomingEvents.length > 0 && (
            <View style={styles.upcomingSection}>
              <Text style={styles.upcomingTitle}>Next Events</Text>
              {upcomingEvents.slice(0, 3).map((event) => (
                <TouchableOpacity
                  key={event.id}
                  style={styles.upcomingEventItem}
                  onPress={() => handleEventPress(event)}
                >
                  <View
                    style={[
                      styles.eventIndicator,
                      { backgroundColor: event.color },
                    ]}
                  />
                  <View style={styles.upcomingEventContent}>
                    <Text style={styles.upcomingEventTitle}>
                      {event.title}
                    </Text>
                    <Text style={styles.upcomingEventTime}>
                      {new Date(event.startDate).toLocaleDateString()}{' '}
                      {event.timeRange
                        ? event.timeRange.startTime
                        : 'All day'}
                    </Text>
                  </View>
                  <Text style={styles.upcomingEventIcon}>→</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Status Messages */}
          {events.length === 0 && !loading && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyTitle}>No Events</Text>
              <Text style={styles.emptyMessage}>
                Create new events to get started with your calendar.
              </Text>
            </View>
          )}

          {summary.busyDates.length > 0 && (
            <View style={styles.busyDatesSection}>
              <Text style={styles.busyDatesTitle}>Busy Dates</Text>
              <Text style={styles.busyDatesText}>
                You have 3+ events on {summary.busyDates.length} dates.
              </Text>
              <View style={styles.busyDatesList}>
                {summary.busyDates.slice(0, 5).map((date) => (
                  <Text key={date} style={styles.busyDate}>
                    {new Date(date).toLocaleDateString()}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* Footer Spacing */}
          <View style={styles.footer} />
        </ScrollView>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          // Navigate to create event screen
          console.log('Create new event');
        }}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  syncButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncButtonText: {
    fontSize: 18,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FEE2E2',
    borderBottomWidth: 1,
    borderBottomColor: '#FECACA',
  },
  errorText: {
    fontSize: 13,
    color: '#DC2626',
    flex: 1,
  },
  errorRetry: {
    fontSize: 13,
    fontWeight: '600',
    color: '#DC2626',
    marginLeft: 12,
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B82F6',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  toggleStatsButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  toggleStatsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  calendarContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 12,
  },
  upcomingSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  upcomingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  upcomingEventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  eventIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  upcomingEventContent: {
    flex: 1,
  },
  upcomingEventTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  upcomingEventTime: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  upcomingEventIcon: {
    fontSize: 14,
    color: '#3B82F6',
  },
  emptyState: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  busyDatesSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FEF3C7',
    borderTopWidth: 1,
    borderTopColor: '#FCD34D',
  },
  busyDatesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 4,
  },
  busyDatesText: {
    fontSize: 12,
    color: '#B45309',
    marginBottom: 8,
  },
  busyDatesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  busyDate: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    fontSize: 11,
    color: '#92400E',
    fontWeight: '600',
  },
  footer: {
    height: 80,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '300',
  },
});

export default CalendarScreen;
