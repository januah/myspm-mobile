/**
 * EventModal Component - Event Details Modal
 * Shows comprehensive event information with action buttons
 */

import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import type { CalendarEvent } from '../../types/calendar';
import { CALENDAR_EVENT_TYPE_CONFIG, CALENDAR_PRIORITY_CONFIG } from '../../constants/calendar';

interface EventModalProps {
  event: CalendarEvent;
  visible: boolean;
  onClose: () => void;
  onEdit?: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
  onBookmark?: (eventId: string) => void;
  onAddReminder?: (eventId: string) => void;
}

const EventModal: React.FC<EventModalProps> = ({
  event,
  visible,
  onClose,
  onEdit,
  onDelete,
  onBookmark,
  onAddReminder,
}) => {
  const eventTypeConfig = CALENDAR_EVENT_TYPE_CONFIG[event.eventType];
  const priorityConfig = CALENDAR_PRIORITY_CONFIG[event.priority];

  const formatDateTime = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateDaysUntil = (): number => {
    const eventDate = new Date(event.startDate);
    const today = new Date();
    const diff = eventDate.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysUntil = calculateDaysUntil();

  const handleBookmark = useCallback(() => {
    onBookmark?.(event.id);
    onClose();
  }, [event.id, onBookmark, onClose]);

  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete(event.id);
      onClose();
    }
  }, [event.id, onDelete, onClose]);

  const handleEdit = useCallback(() => {
    onEdit?.(event);
    onClose();
  }, [event, onEdit, onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: event.color }]}>
            <View style={styles.headerContent}>
              <Text style={styles.eventIcon}>{eventTypeConfig.icon}</Text>
              <View style={styles.headerText}>
                <Text style={styles.title}>{event.title}</Text>
                <Text style={styles.type}>{eventTypeConfig.label}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Status & Priority */}
            <View style={styles.section}>
              <View style={styles.row}>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{event.status}</Text>
                </View>
                <View
                  style={[
                    styles.priorityBadge,
                    { backgroundColor: `${priorityConfig.backgroundColor}` },
                  ]}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      { color: priorityConfig.color },
                    ]}
                  >
                    {priorityConfig.label} Priority
                  </Text>
                </View>
              </View>
            </View>

            {/* Date & Time */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Date & Time</Text>
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>Starts:</Text>
                <Text style={styles.infoValue}>
                  {formatDateTime(event.startDate)}
                </Text>
              </View>
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>Ends:</Text>
                <Text style={styles.infoValue}>
                  {formatDateTime(event.endDate)}
                </Text>
              </View>
              {daysUntil >= 0 && (
                <View style={[styles.infoBlock, styles.urgencyBlock]}>
                  <Text style={styles.urgencyText}>
                    {daysUntil === 0
                      ? '🔔 Today'
                      : daysUntil === 1
                      ? '🔔 Tomorrow'
                      : `📅 In ${daysUntil} days`}
                  </Text>
                </View>
              )}
            </View>

            {/* Location */}
            {event.location && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Location</Text>
                <View style={styles.infoBlock}>
                  <Text style={styles.locationName}>
                    📍 {event.location.name}
                  </Text>
                  {event.location.address && (
                    <Text style={styles.locationAddress}>
                      {event.location.address}
                    </Text>
                  )}
                  {event.location.roomNumber && (
                    <Text style={styles.locationDetails}>
                      Room {event.location.roomNumber}
                    </Text>
                  )}
                </View>
              </View>
            )}

            {/* Description */}
            {event.description && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.descriptionText}>{event.description}</Text>
              </View>
            )}

            {/* User Notes */}
            {event.userNotes && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>My Notes</Text>
                <View style={styles.notesBlock}>
                  <Text style={styles.notesText}>{event.userNotes}</Text>
                </View>
              </View>
            )}

            {/* Associated Data */}
            {(event.courseId || event.teacherId || event.assignmentId) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Associated</Text>
                {event.courseId && (
                  <Text style={styles.associatedText}>📚 Course: {event.courseId}</Text>
                )}
                {event.teacherId && (
                  <Text style={styles.associatedText}>👨‍🏫 Teacher: {event.teacherId}</Text>
                )}
                {event.assignmentId && (
                  <Text style={styles.associatedText}>
                    📝 Assignment: {event.assignmentId}
                  </Text>
                )}
              </View>
            )}

            {/* Reminders */}
            {event.reminders.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Reminders</Text>
                {event.reminders.map((reminder, index) => (
                  <Text key={index} style={styles.reminderText}>
                    🔔 {reminder.type} - {reminder.trigger} minutes before
                  </Text>
                ))}
              </View>
            )}

            {/* Attendees */}
            {event.attendees && event.attendees.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Attendees</Text>
                {event.attendees.map((attendee) => (
                  <View key={attendee.id} style={styles.attendeeRow}>
                    <Text style={styles.attendeeName}>{attendee.name}</Text>
                    <Text style={styles.attendeeRole}>
                      {attendee.role.charAt(0).toUpperCase() +
                        attendee.role.slice(1)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actions}>
            {onAddReminder && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  onAddReminder(event.id);
                  onClose();
                }}
              >
                <Text style={styles.actionButtonText}>🔔 Remind</Text>
              </TouchableOpacity>
            )}

            {onBookmark && (
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  event.isBookmarked && styles.actionButtonActive,
                ]}
                onPress={handleBookmark}
              >
                <Text style={styles.actionButtonText}>
                  {event.isBookmarked ? '⭐' : '☆'} Bookmark
                </Text>
              </TouchableOpacity>
            )}

            {onEdit && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleEdit}
              >
                <Text style={styles.actionButtonText}>✏️ Edit</Text>
              </TouchableOpacity>
            )}

            {onDelete && (
              <TouchableOpacity
                style={[styles.actionButton, styles.actionButtonDanger]}
                onPress={handleDelete}
              >
                <Text style={styles.actionButtonDangerText}>🗑️ Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  eventIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  type: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#E0F2FE',
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0284C7',
    textTransform: 'capitalize',
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoBlock: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '500',
  },
  urgencyBlock: {
    backgroundColor: '#FEF3C7',
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  urgencyText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400E',
  },
  locationName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  locationDetails: {
    fontSize: 12,
    color: '#475569',
  },
  descriptionText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
  },
  notesBlock: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  notesText: {
    fontSize: 13,
    color: '#78350F',
  },
  associatedText: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 6,
  },
  reminderText: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 6,
  },
  attendeeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  attendeeName: {
    fontSize: 13,
    color: '#1E293B',
  },
  attendeeRole: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  actionButton: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#DBEAFE',
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonActive: {
    backgroundColor: '#FEF3C7',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0284C7',
  },
  actionButtonDanger: {
    backgroundColor: '#FEE2E2',
  },
  actionButtonDangerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
  },
});

export default EventModal;
