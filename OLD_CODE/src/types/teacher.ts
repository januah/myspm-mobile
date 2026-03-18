/**
 * Teacher Linking Types
 * Defines types for teacher-student relationships and linking
 */

/**
 * Teacher link method - how the student linked with teacher
 */
export type TeacherLinkMethod = 'code' | 'invite' | 'direct' | 'admin';

/**
 * Teacher link status
 */
export type TeacherLinkStatus = 'pending' | 'active' | 'inactive' | 'rejected';

/**
 * Teacher role/permission level
 */
export type TeacherRole = 'instructor' | 'assistant' | 'tutor';

/**
 * Teacher profile information
 */
export interface Teacher {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: TeacherRole;
  bio?: string;
  subject?: string;
  school?: string;
  verified: boolean;
  linkedAt: number; // timestamp
  linkMethod: TeacherLinkMethod;
}

/**
 * Teacher link request (pending link)
 */
export interface TeacherLinkRequest {
  id: string;
  teacherId: string;
  studentId: string;
  status: TeacherLinkStatus;
  code?: string; // Link code if applicable
  inviteToken?: string; // Invite token if applicable
  createdAt: number;
  expiresAt?: number; // For temporary links
  message?: string;
}

/**
 * Teacher invite/link code
 */
export interface TeacherLinkCode {
  code: string;
  teacherId: string;
  issuedAt: number;
  expiresAt: number;
  usedBy?: string[]; // Student IDs who used this code
  maxUses?: number;
  usageCount: number;
  isActive: boolean;
}

/**
 * Student's linked teachers list
 */
export interface LinkedTeachersCollection {
  active: Teacher[];
  pending: TeacherLinkRequest[];
  inactive: Teacher[];
  totalCount: number;
}

/**
 * Teacher invitation details
 */
export interface TeacherInvitation {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  studentEmail: string;
  token: string;
  status: TeacherLinkStatus;
  createdAt: number;
  expiresAt: number;
  message?: string;
}

/**
 * Link code validation result
 */
export interface LinkCodeValidationResult {
  valid: boolean;
  code: string;
  teacher?: {
    id: string;
    name: string;
    email: string;
    role: TeacherRole;
  };
  error?: string;
}

/**
 * Teacher linking context state
 */
export interface TeacherLinkingState {
  linkedTeachers: {
    active: Teacher[];
    pending: TeacherLinkRequest[];
    inactive: Teacher[];
  };
  linkCode: string | null; // Input code being validated
  isLinking: boolean;
  isLoadingTeachers: boolean;
  isValidatingCode: boolean;
  linkError: string | null;
  validationError: string | null;
  selectedTeacher: Teacher | null;
  unlinkConfirmation: Teacher | null;
  successMessage: string | null;
}

/**
 * Link code input state
 */
export interface LinkCodeInput {
  code: string;
  method: 'code' | 'email'; // Link via code or teacher email
  teacherEmail?: string;
}

/**
 * Teacher linking response
 */
export interface TeacherLinkResponse {
  success: boolean;
  message: string;
  teacher?: Teacher;
  request?: TeacherLinkRequest;
  error?: string;
}

/**
 * Unlink teacher response
 */
export interface UnlinkTeacherResponse {
  success: boolean;
  message: string;
  teacherId: string;
}

/**
 * Teacher search result for linking
 */
export interface TeacherSearchResult {
  id: string;
  name: string;
  email: string;
  role: TeacherRole;
  school?: string;
  verified: boolean;
  studentCount?: number;
  isLinked: boolean;
}

/**
 * Teacher identity verification data
 */
export interface TeacherIdentityVerification {
  id: string;
  teacherId: string;
  documentType: 'license' | 'certificate' | 'id' | 'verification_code';
  verificationStatus: 'pending' | 'approved' | 'rejected';
  verifiedAt?: number;
  expiresAt?: number;
}
