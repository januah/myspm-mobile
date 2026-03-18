/**
 * Language Switcher Component
 * Allows users to select their preferred language
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getSupportedLanguages } from '@/i18n';

interface LanguageSwitcherProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => Promise<void>;
  isLoading?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLanguage,
  onLanguageChange,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const [isChanging, setIsChanging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supportedLanguages = getSupportedLanguages();
  const languageList = Object.values(supportedLanguages);

  const handleLanguageSelect = async (languageCode: string) => {
    if (languageCode === selectedLanguage) {
      return; // No change needed
    }

    setSelectedLanguage(languageCode);
    setIsChanging(true);
    setError(null);

    try {
      await onLanguageChange(languageCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change language');
      setSelectedLanguage(currentLanguage); // Revert on error
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('settings.selectLanguage')}</Text>

      <View style={styles.languageOptions}>
        {languageList.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageButton,
              selectedLanguage === language.code && styles.languageButtonActive,
            ]}
            onPress={() => handleLanguageSelect(language.code)}
            disabled={isChanging || isLoading}
          >
            <View style={styles.radioCircle}>
              {selectedLanguage === language.code && (
                <View style={styles.radioInner} />
              )}
            </View>
            <View style={styles.languageText}>
              <Text style={styles.languageName}>{language.name}</Text>
              <Text style={styles.languageNative}>{language.nativeName}</Text>
            </View>
            {isChanging && selectedLanguage === language.code && (
              <ActivityIndicator size="small" color="#1B6EF3" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {isChanging && (
        <Text style={styles.changingText}>{t('common.loading')}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000',
  },
  languageOptions: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  languageButtonActive: {
    backgroundColor: '#F3F4F6',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1B6EF3',
  },
  languageText: {
    flex: 1,
  },
  languageName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  languageNative: {
    fontSize: 12,
    color: '#6B7280',
  },
  errorText: {
    marginTop: 12,
    fontSize: 12,
    color: '#EF4444',
    textAlign: 'center',
  },
  changingText: {
    marginTop: 12,
    fontSize: 12,
    color: '#1B6EF3',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default LanguageSwitcher;
