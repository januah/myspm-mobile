# MySPM Multi-Lingual Implementation - Completion Guide

## ✅ Phase 1-3 Complete: Core Infrastructure Built

### What Has Been Created

#### 1. **i18n Core Setup** (`src/i18n/`)
- ✅ **index.js** - i18next initialization with react-native-localize for device language detection
- ✅ **config.js** - Configuration with supported languages (en, ms, zh), language detection, and fallback chain
- ✅ **interceptor.js** - Fetch wrapper that adds `Accept-Language` header to API requests

**Key Features:**
- Automatic device language detection with fallback to English
- Language code mapping for device variants (e.g., en-US → en)
- Offline support (translations bundled in app)

#### 2. **Translation Files** (`src/locales/`)
- ✅ **en/common.json** - English translations (400+ keys)
- ✅ **ms/common.json** - Bahasa Melayu translations
- ✅ **zh/common.json** - Chinese Simplified translations

**Covered Namespaces:**
```
- common (general UI labels)
- navigation (tab labels)
- settings (settings screen)
- profile (user profile)
- teacher (teacher linking)
- practice (practice mode)
- exam (exam mode)
- gamification (leaderboard, ranks, achievements)
- leaderboard (rankings)
- notifications (alerts)
- validation (form validation)
- errors (error messages)
- camera (camera screen)
- calendar (calendar events)
```

#### 3. **State Management** (`src/store/languageSlice.ts`)
- ✅ Redux Toolkit slice with:
  - `setLanguage` action for immediate language change
  - `loadLanguagePreference` thunk to load from AsyncStorage
  - `saveLanguagePreference` thunk (prepared for backend sync)
  - Selectors: `selectCurrentLanguage`, `selectDeviceLanguage`, etc.
  - Error handling and loading states

**Storage:**
- Primary: AsyncStorage (`user_language_preference` key)
- Secondary: Redux state
- Future: Backend API (`POST /users/language` endpoint ready)

#### 4. **API Layer** (`src/services/fetchClient.ts`)
- ✅ Fetch wrapper that auto-adds `Accept-Language` header
- ✅ Helper methods: `get()`, `post()`, `put()`, `delete()`, `patch()`
- ✅ Ready for integration with existing services

#### 5. **UI Components**
- ✅ **LanguageSwitcher** (`src/components/LanguageSwitcher.tsx`)
  - Radio button UI for language selection
  - Shows native language names (Bahasa Melayu, 中文, English)
  - Loading states and error handling
  - Real-time selection feedback

- ✅ **Settings Screen** (`(tabs)/profile/settings.tsx`)
  - Integrates LanguageSwitcher component
  - Handles language persistence to AsyncStorage
  - Error alerts for failed changes
  - Ready for Redux Provider integration

#### 6. **Utility Functions** (`src/utils/questionAdapter.ts`)
- ✅ `getQuestionText()` - Extracts language-specific question text
- ✅ `getAvailableTranslations()` - Lists all available translations
- ✅ `hasTranslation()` - Checks if language version exists
- ✅ `normalizeQuestion()` - Converts between response formats
- ✅ `normalizeQuestions()` - Batch processing

**Handles Multiple API Response Formats:**
```javascript
// Format 1: Translations object (recommended)
{ question_key: 'q123', translations: { en: '...', ms: '...', zh: '...' } }

// Format 2: Individual language fields
{ question_text_en: '...', question_text_ms: '...', question_text_zh: '...' }

// Format 3: Fallback
{ question_text: '...' }
```

---

## 📋 Next Steps: Integration Required

### Step 1: Add Redux Provider to Root Layout
**File:** `_layout.tsx`

```tsx
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import languageReducer from '@/store/languageSlice';
import teacherReducer from '@/store/teacherSlice';
// Import other slices as needed

// Create store (do this once at module level)
const store = configureStore({
  reducer: {
    language: languageReducer,
    teacher: teacherReducer,
    // Add other slices here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Wrap app with Provider
<Provider store={store}>
  {/* ... rest of app ... */}
</Provider>
```

### Step 2: Initialize i18n on App Startup
**File:** `_layout.tsx` - Add before rendering app

```tsx
import { initializeI18n } from '@/i18n';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadLanguagePreference } from '@/store/languageSlice';

export default function RootLayout() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize i18n
    initializeI18n().then(() => {
      // Load language preference from storage
      dispatch(loadLanguagePreference() as any);
    });
  }, [dispatch]);

  // ... rest of component
}
```

### Step 3: Integrate useTranslation Hook in Components
**Pattern:** Use `useTranslation()` hook to access translations

```tsx
import { useTranslation } from 'react-i18next';

export function MyComponent() {
  const { t } = useTranslation();

  return (
    <View>
      <Text>{t('common.home')}</Text>
      <Button title={t('common.save')} />
    </View>
  );
}
```

**Components to Update:**
- Tab labels in `(tabs)/_layout.tsx`
- Screens: Home, Practice, Leaderboard, Profile
- Components using hard-coded strings
- Error messages and validation feedback

### Step 4: Update Services to Use fetchClient (Optional Phase 2)
**Files to Update:**
- `src/services/CalendarService.ts`
- `src/services/NotificationService.ts`
- `src/services/teacherService.ts`

**Pattern:**
```tsx
// Before
const response = await fetch(url, { method: 'GET' });

// After
import { get } from '@/services/fetchClient';
const language = useSelector(selectCurrentLanguage);
const response = await get(url, language);
```

### Step 5: Add Settings Navigation to Profile Tab
**File:** `(tabs)/profile/_layout.tsx` or Profile screen

```tsx
// Add navigation to settings screen
<Button
  title={t('common.settings')}
  onPress={() => navigation.navigate('settings')}
/>
```

### Step 6: Update Question Display Screens
**Pattern for Exam/Practice Screens:**
```tsx
import { getQuestionText } from '@/utils/questionAdapter';

function ExamScreen({ question }) {
  const userLanguage = useSelector(selectCurrentLanguage);
  const questionText = getQuestionText(question, userLanguage);

  return <Text>{questionText}</Text>;
}
```

---

## 🎨 Gamification UI Translation Example

### Current (Hard-coded)
```tsx
<Text>Rank: 1</Text>
<Text>Points: 500</Text>
<Text>Streak: 3</Text>
```

### After Integration
```tsx
const { t } = useTranslation();

<Text>{t('gamification.rank')}: 1</Text>
<Text>{t('gamification.points')}: 500</Text>
<Text>{t('gamification.streak')}: 3</Text>
```

### Auto-Translation:
- **English:** "Rank: 1", "Points: 500", "Streak: 3"
- **Malay:** "Kedudukan: 1", "Poin: 500", "Jalur: 3"
- **Chinese:** "排名: 1", "积分: 500", "连胜: 3"

---

## 🔄 Language Switching Flow

```
User selects language in Settings
    ↓
LanguageSwitcher calls onLanguageChange()
    ↓
changeLanguage(language) - updates i18n
    ↓
dispatch(setLanguage(language)) - updates Redux
    ↓
AsyncStorage.setItem('user_language_preference', language)
    ↓
Component re-renders with new language (automatic via i18n)
    ↓
✅ All UI text updates without app restart
```

---

## 🚀 Future Enhancements (Phase 2+)

### Backend Integration (When Ready)
```tsx
// In languageSlice.ts, uncomment when backend API exists:
const response = await api.post('/users/language', { language });
```

### Push Notifications
- When push notifications are implemented, use language-specific templates
- Backend sends `notification_text_en`, `notification_text_ms`, `notification_text_zh`
- Use `getQuestionText()` utility pattern for consistency

### Additional Languages
1. Add language to `SUPPORTED_LANGUAGES` in `src/i18n/config.js`
2. Create `src/locales/[code]/common.json`
3. No code changes required!

### Language-Specific Content
- Add namespace for specific features: `profile.json`, `gamification.json`
- Import in i18n config
- Better organization for large apps

---

## 📱 Testing Checklist

### Device Language Detection
- [ ] Device set to English → App loads in English
- [ ] Device set to Bahasa Melayu → App loads in Malay
- [ ] Device set to Chinese → App loads in Chinese
- [ ] Device set to unsupported language → Falls back to English

### Manual Language Switching
- [ ] Open Settings
- [ ] Select different language
- [ ] Verify UI updates instantly
- [ ] No app restart occurs
- [ ] All tabs/screens show new language

### Persistence
- [ ] Close and reopen app
- [ ] Language preference persists
- [ ] Works offline without internet

### Question Display
- [ ] Practice questions show in selected language
- [ ] Exam questions show in selected language
- [ ] Fallback to English if translation missing

### Gamification
- [ ] Leaderboard headers translated
- [ ] Achievement names translated
- [ ] Points, Streak, Rank labels translated

---

## 📚 File Structure Summary

```
src/
├── i18n/
│   ├── index.js          (✅ Created)
│   ├── config.js         (✅ Created)
│   └── interceptor.js    (✅ Created)
├── locales/
│   ├── en/common.json    (✅ Created)
│   ├── ms/common.json    (✅ Created)
│   └── zh/common.json    (✅ Created)
├── store/
│   └── languageSlice.ts  (✅ Created)
├── services/
│   └── fetchClient.ts    (✅ Created)
├── components/
│   └── LanguageSwitcher.tsx (✅ Created)
├── utils/
│   └── questionAdapter.ts   (✅ Created)
└── (tabs)/profile/
    └── settings.tsx      (✅ Created)
```

---

## 🔧 Configuration Files to Update

### `_layout.tsx` (Root Layout)
- Add Redux Provider
- Initialize i18n
- Load language preference from storage
- Wire up language change listener

### `(tabs)/_layout.tsx` (Tab Navigation)
- Add tab labels using translations
- No functional changes needed

### Existing Screens & Components
- Import `useTranslation()` hook
- Replace hard-coded strings with `t('key.path')`
- Rebuild and test

---

## 📞 Support & Debugging

### Check Current Language
```tsx
import i18n from '@/i18n';
console.log('Current language:', i18n.language);
```

### Check Available Translations
```tsx
import { getSupportedLanguages } from '@/i18n';
console.log(getSupportedLanguages());
```

### Test Question Translation
```tsx
import { getQuestionText, getAvailableTranslations } from '@/utils/questionAdapter';

const text = getQuestionText(question, 'ms');
const allTranslations = getAvailableTranslations(question);
console.log('Available translations:', allTranslations);
```

---

## ✨ Key Design Decisions

1. **i18next + react-native-localize** - Industry standard for React Native i18n
2. **AsyncStorage First** - Works offline, no backend dependency
3. **Redux for State** - Consistent with app architecture
4. **Flexible API** - Handles multiple response formats from backend
5. **No Breaking Changes** - Can be integrated gradually
6. **Easy to Extend** - Add new languages/namespaces without code changes

---

**Implementation Status:** 70% Complete
- Core infrastructure: ✅ Done
- UI components: ✅ Done
- Integration: ⏳ In Progress
- Testing: ⏳ Pending
