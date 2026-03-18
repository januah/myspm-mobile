/**
 * Teacher Linking Service
 * Singleton service for managing teacher-student relationships
 */

import {
  Teacher,
  TeacherLinkRequest,
  TeacherLinkCode,
  LinkedTeachersCollection,
  LinkCodeValidationResult,
  TeacherLinkResponse,
  UnlinkTeacherResponse,
  LinkCodeInput,
  TeacherSearchResult,
} from '../types/teacher';
import {
  LINK_CODE_CONFIG,
  INVITE_CONFIG,
  VALIDATION_RULES,
  TEACHER_LINK_ERROR_MESSAGES,
  TEACHER_LINK_SUCCESS_MESSAGES,
  RATE_LIMITING,
} from '../constants/teacher';
import { get, post, patch, del } from './fetchClient';

interface TeacherServiceConfig {
  apiBaseUrl?: string;
  enableLogging?: boolean;
}

class TeacherService {
  private static instance: TeacherService;
  private config: TeacherServiceConfig;
  private linkedTeachers: Map<string, Teacher> = new Map();
  private pendingRequests: Map<string, TeacherLinkRequest> = new Map();
  private linkAttempts: Map<string, number[]> = new Map(); // For rate limiting
  private notificationHandlers: Set<(event: string, data: any) => void> = new Set();
  private currentLanguage: string = 'en';

  private constructor(config: TeacherServiceConfig = {}) {
    this.config = {
      enableLogging: true,
      ...config,
    };
  }



  /**
   * Set current language for API requests
   */
  setLanguage(language: string): void {
    this.currentLanguage = language;
  }
  /**
   * Get singleton instance
   */
  static getInstance(config?: TeacherServiceConfig): TeacherService {
    if (!TeacherService.instance) {
      TeacherService.instance = new TeacherService(config);
    }
    return TeacherService.instance;
  }

  /**
   * Initialize teacher service
   */
  async initialize(userId: string): Promise<void> {
    try {
      this.log('Initializing teacher service for user:', userId);
      
      // Load linked teachers from backend
      await this.loadLinkedTeachers(userId);
      
      // Load pending requests
      await this.loadPendingRequests(userId);
      
      this.log('Teacher service initialized successfully');
    } catch (error) {
      this.error('Failed to initialize teacher service:', error);
      throw error;
    }
  }

  /**
   * Link teacher via code
   */
  async linkTeacherWithCode(code: string, userId: string): Promise<TeacherLinkResponse> {
    try {
      // Validate code format
      if (!this.validateCodeFormat(code)) {
        return {
          success: false,
          message: TEACHER_LINK_ERROR_MESSAGES.INVALID_CODE,
          error: 'INVALID_CODE_FORMAT',
        };
      }

      // Check rate limiting
      if (!this.checkRateLimit(userId)) {
        return {
          success: false,
          message: 'Too many link attempts. Please try again later.',
          error: 'RATE_LIMIT_EXCEEDED',
        };
      }

      // Validate code with backend
      const validation = await this.validateLinkCode(code, userId);
      if (!validation.valid) {
        this.recordLinkAttempt(userId);
        return {
          success: false,
          message: validation.error || TEACHER_LINK_ERROR_MESSAGES.INVALID_CODE,
          error: 'VALIDATION_FAILED',
        };
      }

      if (!validation.teacher) {
        return {
          success: false,
          message: TEACHER_LINK_ERROR_MESSAGES.TEACHER_NOT_FOUND,
          error: 'TEACHER_NOT_FOUND',
        };
      }

      // Check if already linked
      if (this.isTeacherLinked(validation.teacher.id)) {
        return {
          success: false,
          message: TEACHER_LINK_ERROR_MESSAGES.ALREADY_LINKED,
          error: 'ALREADY_LINKED',
        };
      }

      // Create link request
      const linkRequest = await this.createLinkRequest(
        validation.teacher.id,
        userId,
        'code',
        code
      );

      if (!linkRequest) {
        return {
          success: false,
          message: 'Failed to create link request',
          error: 'REQUEST_CREATION_FAILED',
        };
      }

      // Link teacher
      const teacher: Teacher = {
        id: validation.teacher.id,
        name: validation.teacher.name,
        email: validation.teacher.email,
        role: validation.teacher.role,
        verified: true,
        linkedAt: Date.now(),
        linkMethod: 'code',
      };

      this.linkedTeachers.set(teacher.id, teacher);
      this.notifyListeners('teacher_linked', teacher);

      return {
        success: true,
        message: TEACHER_LINK_SUCCESS_MESSAGES.LINK_CREATED,
        teacher,
        request: linkRequest,
      };
    } catch (error) {
      this.error('Failed to link teacher with code:', error);
      return {
        success: false,
        message: TEACHER_LINK_ERROR_MESSAGES.NETWORK_ERROR,
        error: 'NETWORK_ERROR',
      };
    }
  }

  /**
   * Link teacher via email invitation
   */
  async linkTeacherWithEmail(
    teacherEmail: string,
    userId: string,
    message?: string
  ): Promise<TeacherLinkResponse> {
    try {
      // Validate email format
      if (!VALIDATION_RULES.EMAIL_PATTERN.test(teacherEmail)) {
        return {
          success: false,
          message: TEACHER_LINK_ERROR_MESSAGES.INVALID_EMAIL,
          error: 'INVALID_EMAIL',
        };
      }

      // Check rate limiting
      if (!this.checkRateLimit(userId)) {
        return {
          success: false,
          message: 'Too many link attempts. Please try again later.',
          error: 'RATE_LIMIT_EXCEEDED',
        };
      }

      // Find teacher by email
      const teacher = await this.searchTeacher(teacherEmail);
      if (!teacher) {
        return {
          success: false,
          message: TEACHER_LINK_ERROR_MESSAGES.TEACHER_NOT_FOUND,
          error: 'TEACHER_NOT_FOUND',
        };
      }

      // Check if already linked
      if (this.isTeacherLinked(teacher.id)) {
        return {
          success: false,
          message: TEACHER_LINK_ERROR_MESSAGES.ALREADY_LINKED,
          error: 'ALREADY_LINKED',
        };
      }

      // Create invitation
      const inviteToken = this.generateInviteToken();
      const linkRequest = await this.createInvitationRequest(
        teacher.id,
        userId,
        teacherEmail,
        inviteToken,
        message
      );

      this.notifyListeners('invitation_sent', { teacher, userId });

      return {
        success: true,
        message: TEACHER_LINK_SUCCESS_MESSAGES.INVITATION_SENT,
        teacher,
        request: linkRequest,
      };
    } catch (error) {
      this.error('Failed to link teacher with email:', error);
      return {
        success: false,
        message: TEACHER_LINK_ERROR_MESSAGES.NETWORK_ERROR,
        error: 'NETWORK_ERROR',
      };
    }
  }

  /**
   * Unlink teacher
   */
  async unlinkTeacher(teacherId: string, userId: string): Promise<UnlinkTeacherResponse> {
    try {
      const teacher = this.linkedTeachers.get(teacherId);
      if (!teacher) {
        return {
          success: false,
          message: 'Teacher not found',
          teacherId,
        };
      }

      // Remove from local storage
      this.linkedTeachers.delete(teacherId);

      // Notify backend
      await this.notifyBackend('unlink_teacher', { teacherId, userId });

      this.notifyListeners('teacher_unlinked', teacherId);

      return {
        success: true,
        message: TEACHER_LINK_SUCCESS_MESSAGES.UNLINK_SUCCESSFUL,
        teacherId,
      };
    } catch (error) {
      this.error('Failed to unlink teacher:', error);
      return {
        success: false,
        message: TEACHER_LINK_ERROR_MESSAGES.NETWORK_ERROR,
        teacherId,
      };
    }
  }

  /**
   * Get all linked teachers
   */
  getLinkedTeachers(userId: string): LinkedTeachersCollection {
    const active = Array.from(this.linkedTeachers.values());
    const pending = Array.from(this.pendingRequests.values());
    const inactive: Teacher[] = []; // Would filter from active based on status

    return {
      active,
      pending,
      inactive,
      totalCount: active.length + pending.length,
    };
  }

  /**
   * Get specific teacher
   */
  getTeacher(teacherId: string): Teacher | null {
    return this.linkedTeachers.get(teacherId) || null;
  }

  /**
   * Check if teacher is linked
   */
  isTeacherLinked(teacherId: string): boolean {
    return this.linkedTeachers.has(teacherId);
  }

  /**
   * Validate link code format
   */
  private validateCodeFormat(code: string): boolean {
    const cleanCode = code.toUpperCase().replace(/-/g, '');
    return LINK_CODE_CONFIG.CODE_PATTERN.test(cleanCode);
  }

  /**
   * Validate link code with backend
   */
  private async validateLinkCode(
    code: string,
    userId: string
  ): Promise<LinkCodeValidationResult> {
    try {
      // In a real app, this would call backend API
      // For now, return mock validation
      const cleanCode = code.toUpperCase().replace(/-/g, '');
      
      return {
        valid: true,
        code: cleanCode,
        teacher: {
          id: 'teacher-1',
          name: 'Dr. Sarah Johnson',
          email: 'sarah@school.edu',
          role: 'instructor',
        },
      };
    } catch (error) {
      this.error('Failed to validate code:', error);
      return {
        valid: false,
        code,
        error: TEACHER_LINK_ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
  }

  /**
   * Create link request
   */
  private async createLinkRequest(
    teacherId: string,
    studentId: string,
    method: string,
    code?: string
  ): Promise<TeacherLinkRequest | null> {
    try {
      const request: TeacherLinkRequest = {
        id: `req-${Date.now()}-${Math.random()}`,
        teacherId,
        studentId,
        status: 'active',
        code,
        createdAt: Date.now(),
      };

      this.pendingRequests.set(request.id, request);
      return request;
    } catch (error) {
      this.error('Failed to create link request:', error);
      return null;
    }
  }

  /**
   * Create invitation request
   */
  private async createInvitationRequest(
    teacherId: string,
    studentId: string,
    teacherEmail: string,
    token: string,
    message?: string
  ): Promise<TeacherLinkRequest | null> {
    try {
      const request: TeacherLinkRequest = {
        id: `inv-${Date.now()}-${Math.random()}`,
        teacherId,
        studentId,
        status: 'pending',
        inviteToken: token,
        createdAt: Date.now(),
        expiresAt: Date.now() + INVITE_CONFIG.INVITE_EXPIRY_TIME,
        message,
      };

      this.pendingRequests.set(request.id, request);
      return request;
    } catch (error) {
      this.error('Failed to create invitation request:', error);
      return null;
    }
  }

  /**
   * Search teacher by email
   */
  private async searchTeacher(email: string): Promise<TeacherSearchResult | null> {
    try {
      // In a real app, call backend API
      // Mock implementation
      return {
        id: 'teacher-1',
        name: 'Dr. Sarah Johnson',
        email,
        role: 'instructor',
        verified: true,
        studentCount: 45,
        isLinked: false,
      };
    } catch (error) {
      this.error('Failed to search teacher:', error);
      return null;
    }
  }

  /**
   * Check rate limiting
   */
  private checkRateLimit(userId: string): boolean {
    const attempts = this.linkAttempts.get(userId) || [];
    const now = Date.now();
    const recentAttempts = attempts.filter((t) => now - t < 60000); // Last minute

    return recentAttempts.length < RATE_LIMITING.MAX_ATTEMPTS_PER_MINUTE;
  }

  /**
   * Record link attempt for rate limiting
   */
  private recordLinkAttempt(userId: string): void {
    const attempts = this.linkAttempts.get(userId) || [];
    attempts.push(Date.now());
    this.linkAttempts.set(userId, attempts);
  }

  /**
   * Generate invite token
   */
  private generateInviteToken(): string {
    return `invite-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Load linked teachers from backend
   */
  private async loadLinkedTeachers(userId: string): Promise<void> {
    try {
      // In a real app, call backend API
      // Mock loading
      this.log('Loaded linked teachers for user:', userId);
    } catch (error) {
      this.error('Failed to load linked teachers:', error);
    }
  }

  /**
   * Load pending requests from backend
   */
  private async loadPendingRequests(userId: string): Promise<void> {
    try {
      // In a real app, call backend API
      this.log('Loaded pending requests for user:', userId);
    } catch (error) {
      this.error('Failed to load pending requests:', error);
    }
  }

  /**
   * Notify backend of action
   */
  private async notifyBackend(action: string, data: any): Promise<void> {
    try {
      // In a real app, call backend API
      this.log(`Notifying backend: ${action}`, data);
    } catch (error) {
      this.error('Failed to notify backend:', error);
    }
  }

  /**
   * Register notification listener
   */
  onEvent(handler: (event: string, data: any) => void): () => void {
    this.notificationHandlers.add(handler);
    return () => this.notificationHandlers.delete(handler);
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(event: string, data: any): void {
    this.notificationHandlers.forEach((handler) => {
      try {
        handler(event, data);
      } catch (error) {
        this.error('Error in notification handler:', error);
      }
    });
  }

  /**
   * Logging utilities
   */
  private log(...args: any[]): void {
    if (this.config.enableLogging) {
      console.log('[TeacherService]', ...args);
    }
  }

  private error(...args: any[]): void {
    console.error('[TeacherService]', ...args);
  }

  /**
   * Dispose service
   */
  dispose(): void {
    this.notificationHandlers.clear();
    this.linkedTeachers.clear();
    this.pendingRequests.clear();
    this.linkAttempts.clear();
  }
}

export default TeacherService;
