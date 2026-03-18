import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { detectDeviceLanguage } from '@/i18n';
import { LANGUAGE_CODES, DEFAULT_LANGUAGE } from '@/i18n/config';

export interface LanguageState {
  currentLanguage: string;
  deviceLanguage: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: LanguageState = {
  currentLanguage: DEFAULT_LANGUAGE,
  deviceLanguage: DEFAULT_LANGUAGE,
  isLoading: false,
  error: null,
};

// Async thunk to load language preference from AsyncStorage
export const loadLanguagePreference = createAsyncThunk(
  'language/loadPreference',
  async () => {
    try {
      // Try to get saved language preference
      const savedLanguage = await AsyncStorage.getItem('user_language_preference');

      if (savedLanguage && LANGUAGE_CODES.includes(savedLanguage)) {
        return {
          currentLanguage: savedLanguage,
          deviceLanguage: detectDeviceLanguage(),
        };
      }

      // If no saved preference, use device language
      const detectedLanguage = detectDeviceLanguage();
      return {
        currentLanguage: detectedLanguage,
        deviceLanguage: detectedLanguage,
      };
    } catch (error) {
      console.error('Error loading language preference:', error);
      // Fallback to default language if error occurs
      return {
        currentLanguage: DEFAULT_LANGUAGE,
        deviceLanguage: detectDeviceLanguage(),
      };
    }
  },
);

// Async thunk to save language preference to AsyncStorage
export const saveLanguagePreference = createAsyncThunk(
  'language/savePreference',
  async (language: string) => {
    try {
      if (!LANGUAGE_CODES.includes(language)) {
        throw new Error(`Invalid language: ${language}`);
      }

      await AsyncStorage.setItem('user_language_preference', language);

      // Future: Send to backend API when ready
      // await api.post('/users/language', { language });

      return language;
    } catch (error) {
      console.error('Error saving language preference:', error);
      throw error;
    }
  },
);

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    // Synchronous action to set language immediately (used with i18n.changeLanguage)
    setLanguage: (state, action: PayloadAction<string>) => {
      if (LANGUAGE_CODES.includes(action.payload)) {
        state.currentLanguage = action.payload;
        state.error = null;
      } else {
        state.error = `Invalid language: ${action.payload}`;
      }
    },

    // Clear error state
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // Load language preference
    builder
      .addCase(loadLanguagePreference.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadLanguagePreference.fulfilled, (state, action) => {
        state.currentLanguage = action.payload.currentLanguage;
        state.deviceLanguage = action.payload.deviceLanguage;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loadLanguagePreference.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load language preference';
        state.currentLanguage = DEFAULT_LANGUAGE;
        state.deviceLanguage = detectDeviceLanguage();
      });

    // Save language preference
    builder
      .addCase(saveLanguagePreference.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveLanguagePreference.fulfilled, (state, action) => {
        state.currentLanguage = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(saveLanguagePreference.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to save language preference';
      });
  },
});

export const { setLanguage, clearError } = languageSlice.actions;

// Selectors
export const selectCurrentLanguage = (state: { language: LanguageState }) =>
  state.language.currentLanguage;

export const selectDeviceLanguage = (state: { language: LanguageState }) =>
  state.language.deviceLanguage;

export const selectLanguageLoading = (state: { language: LanguageState }) =>
  state.language.isLoading;

export const selectLanguageError = (state: { language: LanguageState }) =>
  state.language.error;

export default languageSlice.reducer;
