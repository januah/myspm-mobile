/**
 * useTeacher Hook
 * Custom hook for teacher linking integration
 */

import { useEffect, useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  initializeTeacher,
  loadLinkedTeachers,
  linkTeacherWithCode,
  linkTeacherWithEmail,
  unlinkTeacher,
  validateLinkCode,
  setLinkCode,
  clearLinkCode,
  selectTeacher,
  clearSelectedTeacher,
  setUnlinkConfirmation,
  clearUnlinkConfirmation,
  clearSuccessMessage,
  clearError,
  selectLinkedTeachers,
  selectPendingRequests,
  selectIsLinking,
  selectLinkError,
  selectValidationError,
  selectSelectedTeacher,
  selectUnlinkConfirmation,
  selectSuccessMessage,
  selectIsLoadingTeachers,
} from '../store/teacherSlice';
import { Teacher, LinkCodeInput } from '../types/teacher';

interface UseTeacherOptions {
  autoInitialize?: boolean;
  userId?: string;
  onTeacherLinked?: (teacher: Teacher) => void;
  onTeacherUnlinked?: (teacherId: string) => void;
  onLinkError?: (error: string) => void;
}

interface UseTeacherReturn {
  // State
  linkedTeachers: Teacher[];
  pendingRequests: any[];
  isLinking: boolean;
  isLoadingTeachers: boolean;
  isValidatingCode: boolean;
  linkError: string | null;
  validationError: string | null;
  selectedTeacher: Teacher | null;
  unlinkConfirmation: Teacher | null;
  successMessage: string | null;
  teacherCount: number;
  hasLinkedTeachers: boolean;
  
  // Methods
  linkWithCode: (code: string, userId: string) => Promise<void>;
  linkWithEmail: (email: string, userId: string, message?: string) => Promise<void>;
  unlinkTeacher: (teacherId: string, userId: string) => Promise<void>;
  validateCode: (code: string, userId: string) => Promise<void>;
  setLinkCode: (code: string) => void;
  clearLinkCode: () => void;
  selectTeacher: (teacher: Teacher) => void;
  clearSelectedTeacher: () => void;
  confirmUnlink: (teacher: Teacher) => void;
  cancelUnlink: () => void;
  clearSuccessMessage: () => void;
  clearError: () => void;
  refreshTeachers: (userId: string) => Promise<void>;
}

/**
 * Main teacher linking hook
 * Provides interface for linking/unlinking teachers and managing related state
 */
export const useTeacher = (options: UseTeacherOptions = {}): UseTeacherReturn => {
  const {
    autoInitialize = true,
    userId,
    onTeacherLinked,
    onTeacherUnlinked,
    onLinkError,
  } = options;

  const dispatch = useAppDispatch();

  // Redux selectors
  const linkedTeachers = useAppSelector(selectLinkedTeachers);
  const pendingRequests = useAppSelector(selectPendingRequests);
  const isLinking = useAppSelector(selectIsLinking);
  const isLoadingTeachers = useAppSelector(selectIsLoadingTeachers);
  const linkError = useAppSelector(selectLinkError);
  const validationError = useAppSelector(selectValidationError);
  const selectedTeacher = useAppSelector(selectSelectedTeacher);
  const unlinkConfirmation = useAppSelector(selectUnlinkConfirmation);
  const successMessage = useAppSelector(selectSuccessMessage);

  // Local state for validation
  const [isValidatingCode, setIsValidatingCode] = useState(false);

  // Auto-initialize on mount
  useEffect(() => {
    if (autoInitialize && userId) {
      dispatch(initializeTeacher(userId));
      dispatch(loadLinkedTeachers(userId));
    }
  }, [autoInitialize, userId, dispatch]);

  // Call onTeacherLinked callback when a teacher is successfully linked
  useEffect(() => {
    if (successMessage?.includes('linked') && selectedTeacher) {
      onTeacherLinked?.(selectedTeacher);
    }
  }, [successMessage, selectedTeacher, onTeacherLinked]);

  // Call onLinkError callback when there's an error
  useEffect(() => {
    if (linkError) {
      onLinkError?.(linkError);
    }
  }, [linkError, onLinkError]);

  // Methods
  const handleLinkWithCode = useCallback(
    async (code: string, userId: string) => {
      try {
        await dispatch(linkTeacherWithCode({ code, userId })).unwrap();
      } catch (error: any) {
        console.error('Failed to link with code:', error);
      }
    },
    [dispatch]
  );

  const handleLinkWithEmail = useCallback(
    async (email: string, userId: string, message?: string) => {
      try {
        await dispatch(linkTeacherWithEmail({ email, userId, message })).unwrap();
      } catch (error: any) {
        console.error('Failed to link with email:', error);
      }
    },
    [dispatch]
  );

  const handleUnlinkTeacher = useCallback(
    async (teacherId: string, userId: string) => {
      try {
        const result = await dispatch(unlinkTeacher({ teacherId, userId })).unwrap();
        onTeacherUnlinked?.(teacherId);
      } catch (error: any) {
        console.error('Failed to unlink teacher:', error);
      }
    },
    [dispatch, onTeacherUnlinked]
  );

  const handleValidateCode = useCallback(
    async (code: string, userId: string) => {
      setIsValidatingCode(true);
      try {
        await dispatch(validateLinkCode({ code, userId })).unwrap();
      } catch (error: any) {
        console.error('Failed to validate code:', error);
      } finally {
        setIsValidatingCode(false);
      }
    },
    [dispatch]
  );

  const handleSetLinkCode = useCallback(
    (code: string) => {
      dispatch(setLinkCode(code));
    },
    [dispatch]
  );

  const handleClearLinkCode = useCallback(() => {
    dispatch(clearLinkCode());
  }, [dispatch]);

  const handleSelectTeacher = useCallback(
    (teacher: Teacher) => {
      dispatch(selectTeacher(teacher));
    },
    [dispatch]
  );

  const handleClearSelectedTeacher = useCallback(() => {
    dispatch(clearSelectedTeacher());
  }, [dispatch]);

  const handleConfirmUnlink = useCallback(
    (teacher: Teacher) => {
      dispatch(setUnlinkConfirmation(teacher));
    },
    [dispatch]
  );

  const handleCancelUnlink = useCallback(() => {
    dispatch(clearUnlinkConfirmation());
  }, [dispatch]);

  const handleClearSuccessMessage = useCallback(() => {
    dispatch(clearSuccessMessage());
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleRefreshTeachers = useCallback(
    async (userId: string) => {
      try {
        await dispatch(loadLinkedTeachers(userId)).unwrap();
      } catch (error: any) {
        console.error('Failed to refresh teachers:', error);
      }
    },
    [dispatch]
  );

  return {
    // State
    linkedTeachers,
    pendingRequests,
    isLinking,
    isLoadingTeachers,
    isValidatingCode,
    linkError,
    validationError,
    selectedTeacher,
    unlinkConfirmation,
    successMessage,
    teacherCount: linkedTeachers.length,
    hasLinkedTeachers: linkedTeachers.length > 0,
    
    // Methods
    linkWithCode: handleLinkWithCode,
    linkWithEmail: handleLinkWithEmail,
    unlinkTeacher: handleUnlinkTeacher,
    validateCode: handleValidateCode,
    setLinkCode: handleSetLinkCode,
    clearLinkCode: handleClearLinkCode,
    selectTeacher: handleSelectTeacher,
    clearSelectedTeacher: handleClearSelectedTeacher,
    confirmUnlink: handleConfirmUnlink,
    cancelUnlink: handleCancelUnlink,
    clearSuccessMessage: handleClearSuccessMessage,
    clearError: handleClearError,
    refreshTeachers: handleRefreshTeachers,
  };
};

/**
 * Hook for code-based linking flow
 */
export const useTeacherCodeLinking = (userId: string) => {
  const {
    linkWithCode,
    validateCode,
    selectedTeacher,
    validationError,
    isValidatingCode,
  } = useTeacher({
    autoInitialize: true,
    userId,
  });

  const handleCodeChange = useCallback(
    async (code: string) => {
      if (code.length >= 6) {
        await validateCode(code, userId);
      }
    },
    [validateCode, userId]
  );

  const handleConfirmLink = useCallback(
    async (code: string) => {
      await linkWithCode(code, userId);
    },
    [linkWithCode, userId]
  );

  return {
    selectedTeacher,
    validationError,
    isValidatingCode,
    onCodeChange: handleCodeChange,
    onConfirmLink: handleConfirmLink,
  };
};

/**
 * Hook for email-based linking flow
 */
export const useTeacherEmailLinking = (userId: string) => {
  const { linkWithEmail, isLinking, linkError, successMessage } = useTeacher({
    autoInitialize: true,
    userId,
  });

  const handleSendInvite = useCallback(
    async (email: string, message?: string) => {
      await linkWithEmail(email, userId, message);
    },
    [linkWithEmail, userId]
  );

  return {
    isLinking,
    linkError,
    successMessage,
    onSendInvite: handleSendInvite,
  };
};
