import { configureStore } from '@reduxjs/toolkit';
import languageSlice from './languageSlice';
import calendarSlice from './slices/calendarSlice';
import notificationSlice from './slices/notificationSlice';
import teacherSlice from './teacherSlice';

/**
 * Configure Redux store with all slices
 */
export const store = configureStore({
  reducer: {
    language: languageSlice,
    calendar: calendarSlice,
    notifications: notificationSlice,
    teacher: teacherSlice,
  },
});

// Export RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
