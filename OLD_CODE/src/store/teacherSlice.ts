/**
 * Teacher Linking Redux Slice
 * State management for teacher-student relationships
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import TeacherService from '../services/teacherService';
import {
  Teacher,
  TeacherLinkRequest,
  LinkedTeachersCollection,
  TeacherLinkingState,
  LinkCodeInput,
  TeacherSearchResult,
} from '../types/teacher';

// Initial state
const initialState: TeacherLinkingState = {
  linkedTeachers: {
    active: [],
    pending: [],
    inactive: [],
  },
  linkCode: null,
  isLinking: false,
  isLoadingTeachers: false,
  isValidatingCode: false,
  linkError: null,
  validationError: null,
  selectedTeacher: null,
  unlinkConfirmation: null,
  successMessage: null,
};

// Async thunks
export const initializeTeacher = createAsyncThunk(
  'teacher/initialize',
  async (userId: string) => {
    const service = TeacherService.getInstance();
    await service.initialize(userId);
    return userId;
  }
);

export const loadLinkedTeachers = createAsyncThunk(
  'teacher/loadLinkedTeachers',
  async (userId: string) => {
    const service = TeacherService.getInstance();
    const collection = service.getLinkedTeachers(userId);
    return collection;
  }
);

export const linkTeacherWithCode = createAsyncThunk(
  'teacher/linkWithCode',
  async (
    { code, userId }: { code: string; userId: string },
    { rejectWithValue }
  ) => {
    const service = TeacherService.getInstance();
    const result = await service.linkTeacherWithCode(code, userId);
    
    if (!result.success) {
      return rejectWithValue(result);
    }
    
    return result;
  }
);

export const linkTeacherWithEmail = createAsyncThunk(
  'teacher/linkWithEmail',
  async (
    { email, userId, message }: { email: string; userId: string; message?: string },
    { rejectWithValue }
  ) => {
    const service = TeacherService.getInstance();
    const result = await service.linkTeacherWithEmail(email, userId, message);
    
    if (!result.success) {
      return rejectWithValue(result);
    }
    
    return result;
  }
);

export const unlinkTeacher = createAsyncThunk(
  'teacher/unlink',
  async (
    { teacherId, userId }: { teacherId: string; userId: string },
    { rejectWithValue }
  ) => {
    const service = TeacherService.getInstance();
    const result = await service.unlinkTeacher(teacherId, userId);
    
    if (!result.success) {
      return rejectWithValue(result);
    }
    
    return result;
  }
);

export const validateLinkCode = createAsyncThunk(
  'teacher/validateCode',
  async (
    { code, userId }: { code: string; userId: string },
    { rejectWithValue }
  ) => {
    try {
      // Validate format first
      if (!code || code.length < 6) {
        return rejectWithValue({
          valid: false,
          error: 'Code must be at least 6 characters',
        });
      }
      
      // In real app, would call backend validation
      return {
        valid: true,
        code,
        teacher: {
          id: 'teacher-1',
          name: 'Dr. Sarah Johnson',
          email: 'sarah@school.edu',
          role: 'instructor',
        },
      };
    } catch (error: any) {
      return rejectWithValue({
        valid: false,
        error: error.message || 'Validation failed',
      });
    }
  }
);

// Redux slice
const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    // Synchronous actions
    setLinkCode: (state, action: PayloadAction<string>) => {
      state.linkCode = action.payload;
      state.validationError = null;
    },
    
    clearLinkCode: (state) => {
      state.linkCode = null;
    },
    
    selectTeacher: (state, action: PayloadAction<Teacher>) => {
      state.selectedTeacher = action.payload;
    },
    
    clearSelectedTeacher: (state) => {
      state.selectedTeacher = null;
    },
    
    setUnlinkConfirmation: (state, action: PayloadAction<Teacher>) => {
      state.unlinkConfirmation = action.payload;
    },
    
    clearUnlinkConfirmation: (state) => {
      state.unlinkConfirmation = null;
    },
    
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    
    clearError: (state) => {
      state.linkError = null;
      state.validationError = null;
    },
    
    addTeacher: (state, action: PayloadAction<Teacher>) => {
      state.linkedTeachers.active.push(action.payload);
    },
    
    removeTeacher: (state, action: PayloadAction<string>) => {
      state.linkedTeachers.active = state.linkedTeachers.active.filter(
        (t) => t.id !== action.payload
      );
    },
  },
  
  extraReducers: (builder) => {
    // Initialize teacher
    builder.addCase(initializeTeacher.pending, (state) => {
      state.isLoadingTeachers = true;
    });
    builder.addCase(initializeTeacher.fulfilled, (state) => {
      state.isLoadingTeachers = false;
    });
    builder.addCase(initializeTeacher.rejected, (state, action) => {
      state.isLoadingTeachers = false;
      state.linkError = action.error.message || 'Failed to initialize';
    });

    // Load linked teachers
    builder.addCase(loadLinkedTeachers.pending, (state) => {
      state.isLoadingTeachers = true;
    });
    builder.addCase(loadLinkedTeachers.fulfilled, (state, action) => {
      state.isLoadingTeachers = false;
      state.linkedTeachers = action.payload;
    });
    builder.addCase(loadLinkedTeachers.rejected, (state, action) => {
      state.isLoadingTeachers = false;
      state.linkError = action.error.message || 'Failed to load teachers';
    });

    // Link with code
    builder.addCase(linkTeacherWithCode.pending, (state) => {
      state.isLinking = true;
      state.linkError = null;
    });
    builder.addCase(linkTeacherWithCode.fulfilled, (state, action) => {
      state.isLinking = false;
      state.successMessage = action.payload.message;
      if (action.payload.teacher) {
        state.linkedTeachers.active.push(action.payload.teacher);
      }
      state.linkCode = null;
    });
    builder.addCase(linkTeacherWithCode.rejected, (state, action: any) => {
      state.isLinking = false;
      state.linkError = action.payload?.message || 'Failed to link teacher';
    });

    // Link with email
    builder.addCase(linkTeacherWithEmail.pending, (state) => {
      state.isLinking = true;
      state.linkError = null;
    });
    builder.addCase(linkTeacherWithEmail.fulfilled, (state, action) => {
      state.isLinking = false;
      state.successMessage = action.payload.message;
      if (action.payload.request) {
        state.linkedTeachers.pending.push(action.payload.request);
      }
    });
    builder.addCase(linkTeacherWithEmail.rejected, (state, action: any) => {
      state.isLinking = false;
      state.linkError = action.payload?.message || 'Failed to send invitation';
    });

    // Unlink teacher
    builder.addCase(unlinkTeacher.pending, (state) => {
      state.isLinking = true;
      state.linkError = null;
    });
    builder.addCase(unlinkTeacher.fulfilled, (state, action) => {
      state.isLinking = false;
      state.successMessage = action.payload.message;
      state.linkedTeachers.active = state.linkedTeachers.active.filter(
        (t) => t.id !== action.payload.teacherId
      );
      state.unlinkConfirmation = null;
    });
    builder.addCase(unlinkTeacher.rejected, (state, action: any) => {
      state.isLinking = false;
      state.linkError = action.payload?.message || 'Failed to unlink teacher';
    });

    // Validate code
    builder.addCase(validateLinkCode.pending, (state) => {
      state.isValidatingCode = true;
      state.validationError = null;
    });
    builder.addCase(validateLinkCode.fulfilled, (state, action) => {
      state.isValidatingCode = false;
      if (action.payload.teacher) {
        state.selectedTeacher = action.payload.teacher as any;
      }
    });
    builder.addCase(validateLinkCode.rejected, (state, action: any) => {
      state.isValidatingCode = false;
      state.validationError = action.payload?.error || 'Invalid code';
      state.selectedTeacher = null;
    });
  },
});

// Selectors
export const selectLinkedTeachers = (state: any) =>
  state.teacher.linkedTeachers.active;

export const selectPendingRequests = (state: any) =>
  state.teacher.linkedTeachers.pending;

export const selectTeacherById = (state: any, teacherId: string) =>
  state.teacher.linkedTeachers.active.find((t: Teacher) => t.id === teacherId);

export const selectIsLinking = (state: any) => state.teacher.isLinking;

export const selectLinkError = (state: any) => state.teacher.linkError;

export const selectValidationError = (state: any) => state.teacher.validationError;

export const selectSelectedTeacher = (state: any) => state.teacher.selectedTeacher;

export const selectUnlinkConfirmation = (state: any) =>
  state.teacher.unlinkConfirmation;

export const selectSuccessMessage = (state: any) => state.teacher.successMessage;

export const selectIsLoadingTeachers = (state: any) =>
  state.teacher.isLoadingTeachers;

export const selectTeacherCount = (state: any) =>
  state.teacher.linkedTeachers.active.length;

export const selectHasLinkedTeachers = (state: any) =>
  state.teacher.linkedTeachers.active.length > 0;

// Export actions
export const {
  setLinkCode,
  clearLinkCode,
  selectTeacher,
  clearSelectedTeacher,
  setUnlinkConfirmation,
  clearUnlinkConfirmation,
  clearSuccessMessage,
  clearError,
  addTeacher,
  removeTeacher,
} = teacherSlice.actions;

export default teacherSlice.reducer;
