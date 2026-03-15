/**
 * Teacher Linking Constants
 * Configuration, templates, and defaults for teacher linking
 */

import { TeacherRole } from '../types/teacher';

/**
 * Link code configuration
 */
export const LINK_CODE_CONFIG = {
  // Length of generated link codes
  CODE_LENGTH: 8,
  
  // Time code is valid (24 hours in milliseconds)
  CODE_EXPIRY_TIME: 24 * 60 * 60 * 1000,
  
  // Default max uses per code (0 = unlimited)
  DEFAULT_MAX_USES: 0,
  
  // Code generation attempts before failure
  MAX_GENERATION_ATTEMPTS: 5,
  
  // Pattern for code (uppercase alphanumeric)
  CODE_PATTERN: /^[A-Z0-9]{8}$/,
  
  // Code separator (for display purposes)
  DISPLAY_SEPARATOR: '-', // e.g., "ABC1-2DEF"
};

/**
 * Link invitation configuration
 */
export const INVITE_CONFIG = {
  // Time invitation is valid (7 days in milliseconds)
  INVITE_EXPIRY_TIME: 7 * 24 * 60 * 60 * 1000,
  
  // Max pending invitations per teacher
  MAX_PENDING_INVITES: 100,
  
  // Notification settings for invitations
  SEND_NOTIFICATION: true,
  SEND_EMAIL: true,
};

/**
 * Teacher link status descriptions
 */
export const LINK_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending Confirmation',
  active: 'Connected',
  inactive: 'Inactive',
  rejected: 'Rejected',
};

/**
 * Teacher role descriptions and capabilities
 */
export const TEACHER_ROLES: Record<TeacherRole, {
  label: string;
  description: string;
  canViewGrades: boolean;
  canSetAssignments: boolean;
  canViewAnalytics: boolean;
  canViewNotes: boolean;
}> = {
  instructor: {
    label: 'Instructor',
    description: 'Full access to student progress and assignments',
    canViewGrades: true,
    canSetAssignments: true,
    canViewAnalytics: true,
    canViewNotes: true,
  },
  assistant: {
    label: 'Teaching Assistant',
    description: 'Limited access to student progress',
    canViewGrades: true,
    canSetAssignments: false,
    canViewAnalytics: false,
    canViewNotes: true,
  },
  tutor: {
    label: 'Tutor',
    description: 'View-only access to student progress',
    canViewGrades: true,
    canSetAssignments: false,
    canViewAnalytics: false,
    canViewNotes: false,
  },
};

/**
 * Default link code format
 * Generates codes like "ABC1-2DEF"
 */
export const generateDisplayCode = (code: string): string => {
  const sep = LINK_CODE_CONFIG.DISPLAY_SEPARATOR;
  const parts = code.match(/.{1,4}/g) || [];
  return parts.join(sep);
};

/**
 * Validation rules for teacher linking
 */
export const VALIDATION_RULES = {
  // Code input
  CODE_MIN_LENGTH: 6,
  CODE_MAX_LENGTH: 10,
  
  // Email input
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Teacher name length
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
};

/**
 * Error messages for teacher linking
 */
export const TEACHER_LINK_ERROR_MESSAGES: Record<string, string> = {
  INVALID_CODE: 'The code you entered is invalid or expired.',
  CODE_ALREADY_USED: 'This code has already been used.',
  CODE_EXPIRED: 'This code has expired. Ask your teacher for a new one.',
  TEACHER_NOT_FOUND: 'Teacher not found. Please check the code or email.',
  ALREADY_LINKED: 'You are already connected with this teacher.',
  SELF_LINK: 'You cannot link yourself as a teacher.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
  PERMISSION_DENIED: 'You do not have permission to perform this action.',
  TEACHER_INACTIVE: 'This teacher account is not active.',
  VERIFICATION_REQUIRED: 'This teacher has not been verified yet.',
  MAX_TEACHERS_REACHED: 'You have reached the maximum number of linked teachers.',
  PENDING_LINK_EXISTS: 'You already have a pending link request with this teacher.',
  INVITATION_EXPIRED: 'This invitation has expired.',
  INVALID_INVITATION: 'This invitation is invalid or has been revoked.',
};

/**
 * Success messages for teacher linking
 */
export const TEACHER_LINK_SUCCESS_MESSAGES: Record<string, string> = {
  LINK_CREATED: 'Successfully linked with teacher!',
  UNLINK_SUCCESSFUL: 'You have unlinked this teacher.',
  CODE_SENT: 'Link code sent to your teacher.',
  INVITATION_SENT: 'Invitation sent to teacher.',
  INVITATION_ACCEPTED: 'You have accepted the invitation.',
};

/**
 * Teacher linking flow states
 */
export const LINKING_FLOW_STATES = {
  INITIAL: 'initial',
  ENTERING_CODE: 'entering_code',
  VALIDATING_CODE: 'validating_code',
  CODE_VALID: 'code_valid',
  CONFIRMING_LINK: 'confirming_link',
  LINKING: 'linking',
  LINKED_SUCCESS: 'linked_success',
  ERROR: 'error',
};

/**
 * Verification methods for teacher identity
 */
export const TEACHER_VERIFICATION_METHODS = {
  CERTIFICATE: 'certificate',
  LICENSE: 'license',
  EMAIL_VERIFICATION: 'email_verification',
  ADMIN_VERIFICATION: 'admin_verification',
};

/**
 * Teacher search filter options
 */
export const TEACHER_SEARCH_FILTERS = {
  ROLE: ['instructor', 'assistant', 'tutor'],
  VERIFIED_ONLY: true,
  ACTIVE_ONLY: true,
};

/**
 * Default pagination for teacher lists
 */
export const TEACHER_LIST_PAGINATION = {
  PAGE_SIZE: 20,
  MAX_PAGES: 10,
};

/**
 * Teacher link expiry configuration
 */
export const LINK_EXPIRY = {
  // Inactive teacher link expires after (90 days)
  INACTIVE_EXPIRY: 90 * 24 * 60 * 60 * 1000,
  
  // Check expiry on app launch
  CHECK_ON_LAUNCH: true,
  
  // Auto-cleanup expired links
  AUTO_CLEANUP: true,
};

/**
 * Rate limiting for linking attempts
 */
export const RATE_LIMITING = {
  // Max link attempts per minute
  MAX_ATTEMPTS_PER_MINUTE: 3,
  
  // Lock duration after max attempts (5 minutes)
  LOCK_DURATION: 5 * 60 * 1000,
  
  // Max daily linking attempts
  MAX_DAILY_ATTEMPTS: 20,
};

/**
 * Analytics events for teacher linking
 */
export const TEACHER_LINKING_EVENTS = {
  LINK_INITIATED: 'teacher_link_initiated',
  LINK_CODE_ENTERED: 'teacher_link_code_entered',
  LINK_CODE_VALIDATED: 'teacher_link_code_validated',
  LINK_CONFIRMED: 'teacher_link_confirmed',
  LINK_SUCCESSFUL: 'teacher_link_successful',
  LINK_FAILED: 'teacher_link_failed',
  UNLINK_INITIATED: 'teacher_unlink_initiated',
  UNLINK_CONFIRMED: 'teacher_unlink_confirmed',
  UNLINK_SUCCESSFUL: 'teacher_unlink_successful',
  INVITATION_SENT: 'teacher_invitation_sent',
  INVITATION_ACCEPTED: 'teacher_invitation_accepted',
  INVITATION_REJECTED: 'teacher_invitation_rejected',
};

/**
 * Deep links for teacher linking screens
 */
export const TEACHER_LINKING_DEEP_LINKS = {
  LINK_TEACHER: '/app/teacher/link',
  LINK_WITH_CODE: '/app/teacher/link/code',
  LINK_WITH_EMAIL: '/app/teacher/link/email',
  TEACHER_LIST: '/app/teacher/list',
  TEACHER_PROFILE: '/app/teacher/:id',
  VERIFY_EMAIL: '/app/teacher/verify-email',
};

/**
 * Sample teacher data for demo/testing
 */
export const SAMPLE_TEACHERS = [
  {
    id: 'teacher-1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@school.edu',
    role: 'instructor' as const,
    subject: 'Mathematics',
    school: 'Central High School',
    verified: true,
  },
  {
    id: 'teacher-2',
    name: 'Michael Chen',
    email: 'michael.chen@school.edu',
    role: 'instructor' as const,
    subject: 'Physics',
    school: 'Central High School',
    verified: true,
  },
  {
    id: 'teacher-3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@school.edu',
    role: 'assistant' as const,
    subject: 'English',
    school: 'Central High School',
    verified: true,
  },
];
