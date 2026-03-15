/**
 * Settings Screen
 * User settings and preferences including language selection
 */

import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LanguageSwitcher from '@/components/LanguageSwitcher';
import {
  selectCurrentLanguage,
  selectLanguageLoading,
  setLanguage,
  saveLanguagePreference
} from '@/store/languageSlice';
import { changeLanguage, getCurrentLanguage } from '@/i18n';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentLanguage = useSelector(selectCurrentLanguage);
  const isLoading = useSelector(selectLanguageLoading);
  const [error, setError] = useState<string | null>(null);

  const handleLanguageChange = async (language: string) => {
    try {
      setError(null);

      // Update i18n language
      await changeLanguage(language);

      // Save to Redux store
      dispatch(setLanguage(language));

      // Save to AsyncStorage for persistence
      await AsyncStorage.setItem('user_language_preference', language);

      // Future: Save to backend API when ready
      // await dispatch(saveLanguagePreference(language) as any);

      // Show success feedback
      // This will automatically show due to the component update
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change language';
      setError(errorMessage);
      Alert.alert(t('errors.title'), errorMessage);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Language Settings Section */}
      <View style={styles.section}>
        <LanguageSwitcher
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
          isLoading={isLoading}
        />
      </View>

      {/* Additional Settings Sections (Future) */}
      {/*
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.preferences')}</Text>
        {/* Add more settings here */}
      {/* </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  section: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
    marginVertical: 12,
    color: '#111827',
  },
});
